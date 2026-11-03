const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load .env.local
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  });
}

const TOKEN_PATH = path.join(rootDir, "data", "tokens.json");
const SNAPSHOT_PATH = path.join(rootDir, "data", "hourly_snapshots.json");
const CHAT_FILE = path.join(rootDir, "data", "telegram_chat.json");
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "9149806319:AAF1BKIZwOJIeYEZaM7YZKXhohC0sdGUJSo";

async function sendTelegramAlert(text) {
  if (!BOT_TOKEN) return;

  let chatId = null;
  if (fs.existsSync(CHAT_FILE)) {
    try {
      chatId = JSON.parse(fs.readFileSync(CHAT_FILE, "utf-8")).chatId;
    } catch (e) {}
  }

  // Auto-discover chatId if missing
  if (!chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const json = await res.json();
      if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
        const last = json.result[json.result.length - 1];
        chatId = last.message?.chat?.id || last.channel_post?.chat?.id;
        if (chatId) {
          fs.writeFileSync(CHAT_FILE, JSON.stringify({ chatId: String(chatId), lastUpdated: new Date().toISOString() }, null, 2));
        }
      }
    } catch (e) {}
  }

  if (chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      });
      console.log("📲 Telegram alert dispatched to chat:", chatId);
    } catch (e) {
      console.warn("Could not dispatch Telegram alert:", e.message);
    }
  }
}

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/api/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(tokens);
    oauth2Client.on("tokens", (newTokens) => {
      const merged = { ...tokens, ...newTokens, updated_at: new Date().toISOString() };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
    });
  } else {
    throw new Error("No tokens.json found in data/ directory");
  }
  return oauth2Client;
}

async function recordSnapshot() {
  try {
    const auth = getOAuthClient();
    const youtube = google.youtube({ version: "v3", auth });

    // 1. Fetch channel stats
    const channelRes = await youtube.channels.list({
      part: ["statistics", "contentDetails"],
      mine: true,
    });

    const channel = channelRes.data.items?.[0];
    if (!channel) throw new Error("Channel not found");

    const currentTotalViews = parseInt(channel.statistics?.viewCount || "0", 10);
    const currentSubs = parseInt(channel.statistics?.subscriberCount || "0", 10);
    const totalVideos = parseInt(channel.statistics?.videoCount || "0", 10);

    // 2. Fetch latest uploads
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let videoSnapshots = [];

    if (uploadsPlaylistId) {
      const playlistRes = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails"],
        playlistId: uploadsPlaylistId,
        maxResults: 15,
      });

      const videoIds = playlistRes.data.items
        ?.map((item) => item.contentDetails?.videoId)
        .filter(Boolean);

      if (videoIds.length > 0) {
        const videosRes = await youtube.videos.list({
          part: ["snippet", "statistics"],
          id: videoIds,
        });

        videoSnapshots = (videosRes.data.items || []).map((v) => ({
          id: v.id,
          title: v.snippet?.title,
          views: parseInt(v.statistics?.viewCount || "0", 10),
          likes: parseInt(v.statistics?.likeCount || "0", 10),
        }));
      }
    }

    // 3. Load previous history to calculate deltas
    let history = [];
    if (fs.existsSync(SNAPSHOT_PATH)) {
      try {
        history = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf-8"));
      } catch (e) {
        history = [];
      }
    }

    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 3600 * 1000).toISOString().replace("Z", "+05:30");

    let deltaViews = 0;
    let elapsedMinutes = 30;
    let viewsPerHourRate = 0;
    let topMovers = [];

    if (history.length > 0) {
      const prev = history[history.length - 1];
      const prevTime = new Date(prev.timestampUTC);
      const diffMs = now.getTime() - prevTime.getTime();
      elapsedMinutes = Math.max(1, Math.round(diffMs / 60000));

      deltaViews = Math.max(0, currentTotalViews - prev.totalViews);
      viewsPerHourRate = Math.round((deltaViews / elapsedMinutes) * 60);

      // Calculate track-level movers
      if (prev.topVideos && Array.isArray(prev.topVideos)) {
        const prevMap = new Map(prev.topVideos.map((v) => [v.id, v.views]));
        topMovers = videoSnapshots
          .map((v) => {
            const prevViews = prevMap.get(v.id) || v.views;
            return {
              id: v.id,
              title: v.title,
              currentViews: v.views,
              delta: Math.max(0, v.views - prevViews),
            };
          })
          .filter((v) => v.delta > 0)
          .sort((a, b) => b.delta - a.delta);
      }
    }

    // Classify velocity status
    let peakStatus = "BASELINE_SLUMP";
    let peakLabel = "💤 Slump (<25 v/hr)";
    if (viewsPerHourRate >= 100) {
      peakStatus = "MEGA_PEAK";
      peakLabel = "🔥 MEGA PEAK (100+ v/hr)";
    } else if (viewsPerHourRate >= 50) {
      peakStatus = "ACTIVE_PEAK";
      peakLabel = "🚀 ACTIVE PEAK (50-99 v/hr)";
    } else if (viewsPerHourRate >= 25) {
      peakStatus = "MODERATE";
      peakLabel = "📈 MODERATE WARMUP (25-49 v/hr)";
    }

    const snapshot = {
      timestampUTC: now.toISOString(),
      timestampIST: istTime,
      totalViews: currentTotalViews,
      subscribers: currentSubs,
      totalVideos,
      deltaViewsSinceLast: deltaViews,
      elapsedMinutes,
      viewsPerHourRate,
      peakStatus,
      peakLabel,
      topMovers,
      topVideos: videoSnapshots,
    };

    history.push(snapshot);
    if (history.length > 200) history = history.slice(-200);

    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(history, null, 2));

    console.log("==================================================");
    console.log(`⏱️ Snapshot Recorded: ${istTime}`);
    console.log(`📊 Channel Total Views: ${currentTotalViews.toLocaleString()} (+${deltaViews} in ${elapsedMinutes}m)`);
    console.log(`👥 Subscribers: ${currentSubs} | Total Videos: ${totalVideos}`);
    console.log(`⚡ Real-Time Velocity: ${viewsPerHourRate} views/hour -> ${peakLabel}`);
    if (topMovers.length > 0) {
      console.log("\n🔥 Top Moving Tracks in this interval:");
      topMovers.slice(0, 3).forEach((m, idx) => {
        console.log(`   ${idx + 1}. +${m.delta} views -> ${m.title.slice(0, 50)} (${m.currentViews} total)`);
      });
    }
    console.log("==================================================");

    // If velocity surge (viewsPerHourRate >= 40 v/hr), send Telegram alert!
    if (viewsPerHourRate >= 40) {
      const topMoverStr = topMovers[0] ? `${topMovers[0].title.slice(0, 35)} (+${topMovers[0].delta} views)` : "Catalog circulation surge";
      await sendTelegramAlert(`⚡ *SUPASONIC BEATS • VELOCITY PEAK SURGE!* 🎧🔥\n\nRate: \`${viewsPerHourRate} views/hour\` (${peakLabel})\nTotal Views: \`${currentTotalViews.toLocaleString()}\`\nTop Mover: *${topMoverStr}*\n\n👉 Live Radar: https://supasonicbeats.vercel.app`);
    }

    // Check if Bhar Le Tu crossed 1,000 views
    const bharLeTu = videoSnapshots.find((v) => v.id === "lQl3dRGivOI");
    if (bharLeTu && bharLeTu.views >= 1000) {
      await sendTelegramAlert(`👑 *BOSS BATTLE WON! BHAR LE TU HIT 1,000 VIEWS!* 🏆\n\nBhar Le Tu is now Supasonic Beats' 5th Official Boss Track!\nTarget for Level 3 Boss Quests unlocked.\n👉 Check App: https://supasonicbeats.vercel.app`);
    }
  } catch (error) {
    console.error("Hourly tracker error:", error.message);
  }
}

// Check arguments
const isWatch = process.argv.includes("--watch");

if (isWatch) {
  console.log("🚀 Starting Supasonic Beats Hourly Tracker Daemon with Telegram Alerts...");
  recordSnapshot();
  setInterval(recordSnapshot, 30 * 60 * 1000); // every 30 mins
} else {
  recordSnapshot();
}
