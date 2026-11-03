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
    const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;
    let videoSnapshots = [];
    if (uploadsId) {
      const playlistRes = await youtube.playlistItems.list({
        part: ["contentDetails"],
        playlistId: uploadsId,
        maxResults: 15,
      });

      const ids = (playlistRes.data.items || []).map((i) => i.contentDetails?.videoId).filter(Boolean);
      if (ids.length > 0) {
        const vidRes = await youtube.videos.list({
          part: ["snippet", "statistics"],
          id: ids,
        });

        videoSnapshots = (vidRes.data.items || []).map((v) => ({
          id: v.id,
          title: v.snippet?.title || "",
          views: parseInt(v.statistics?.viewCount || "0", 10),
          likes: parseInt(v.statistics?.likeCount || "0", 10),
        }));
      }
    }

    // 3. Load snapshot history
    let history = [];
    if (fs.existsSync(SNAPSHOT_PATH)) {
      try {
        history = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf-8"));
      } catch (e) {
        history = [];
      }
    }

    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().replace("Z", "+05:30");

    let deltaViews = 0;
    let elapsedMinutes = 0;
    let viewsPerHourRate = 0;
    let topMovers = [];

    if (history.length > 0) {
      const last = history[history.length - 1];
      deltaViews = Math.max(0, currentTotalViews - last.totalViews);
      elapsedMinutes = Math.max(1, Math.round((now.getTime() - new Date(last.timestampUTC).getTime()) / (1000 * 60)));
      viewsPerHourRate = Math.round((deltaViews / elapsedMinutes) * 60);

      // Track individual video deltas
      if (last.topVideos && Array.isArray(last.topVideos)) {
        const lastMap = new Map(last.topVideos.map((v) => [v.id, v.views]));
        topMovers = videoSnapshots
          .map((v) => {
            const prevViews = lastMap.get(v.id) || v.views;
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
    if (history.length > 200) history = history.slice(-200); // keep last 200 snapshots (~4-7 days)

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
  } catch (error) {
    console.error("Hourly tracker error:", error.message);
  }
}

// Check arguments
const isWatch = process.argv.includes("--watch");

if (isWatch) {
  console.log("🚀 Starting Supasonic Beats Hourly Tracker Daemon (Every 30 Minutes)...");
  recordSnapshot();
  setInterval(recordSnapshot, 30 * 60 * 1000); // every 30 mins
} else {
  recordSnapshot();
}
