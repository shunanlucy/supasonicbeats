const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  });
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "9149806319:AAF1BKIZwOJIeYEZaM7YZKXhohC0sdGUJSo";
const SNAPSHOT_PATH = path.join(rootDir, "data", "hourly_snapshots.json");

let lastUpdateId = 0;

async function sendTelegramReply(chatId, text, keyboard = null) {
  try {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    };

    if (keyboard) {
      payload.reply_markup = {
        keyboard,
        resize_keyboard: true,
        one_time_keyboard: false,
      };
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Error sending reply:", e.message);
  }
}

function getLatestSnapshot() {
  if (fs.existsSync(SNAPSHOT_PATH)) {
    try {
      const history = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf-8"));
      if (history.length > 0) return history[history.length - 1];
    } catch (e) {}
  }
  return {
    totalViews: 27471,
    subscribers: 66,
    totalVideos: 67,
    viewsPerHourRate: 48,
    peakLabel: "🚀 ACTIVE PEAK",
  };
}

async function handleMessage(msg) {
  const chatId = msg.chat?.id;
  const rawText = (msg.text || "").trim();
  const lowerText = rawText.toLowerCase();

  console.log(`💬 Message from ${msg.from?.first_name} (${chatId}): "${rawText}"`);

  const mainMenuKeyboard = [
    [{ text: "📊 Live Stats" }, { text: "🏆 Channel Level" }],
    [{ text: "🔥 Top Movers" }, { text: "⚔️ Boss Battles" }],
    [{ text: "📈 Market Predictions" }, { text: "🌐 Open Studio App" }],
  ];

  const snapshot = getLatestSnapshot();

  // 1. START / HELP / HI
  if (lowerText === "/start" || lowerText === "hi" || lowerText === "hello" || lowerText === "help") {
    const reply = `🎧 *Supasonic Beats Studio AI Bot* 🚀✨

Hey *${msg.from?.first_name || "Shunan"}*! Main aapke YouTube Studio ka 24/7 AI Radar hoon.

Aap mujhse live channel metrics pooch sakte hain ya neeche diye gaye buttons tap kar sakte hain:

• \`/stats\` — Live Views & Subscribers
• \`/level\` — Channel RPG Level & Quests
• \`/movers\` — Fastest Growing Tracks Today
• \`/boss\` — Active Boss Battles Near Promotion
• \`/predict\` — BeatExchange Market Predictions
• Ya kisi bhi track ka naam bhejo (e.g. *deedar*, *majboor*, *bhar le tu*)!`;

    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 2. STATS
  if (lowerText === "/stats" || lowerText === "📊 live stats" || lowerText === "stats") {
    const reply = `📊 *SUPASONIC BEATS • REAL-TIME STATS* ⚡

• *Total Channel Views*: \`${snapshot.totalViews.toLocaleString()} Views\`
• *Core Subscribers*: \`${snapshot.subscribers} Subscribers\`
• *Total Catalog Releases*: \`${snapshot.totalVideos} Tracks\`
• *Current Velocity*: \`${snapshot.viewsPerHourRate || 0} views/hour\` (${snapshot.peakLabel || "Normal"})

👉 Full Analytics Dashboard: https://supasonicbeats.vercel.app`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 3. LEVEL PROGRESSION
  if (lowerText === "/level" || lowerText === "🏆 channel level" || lowerText === "level") {
    const totalViews = snapshot.totalViews || 27471;
    const viewsLeft = Math.max(0, 30000 - totalViews);
    const subsLeft = Math.max(0, 100 - (snapshot.subscribers || 66));
    const pct = Math.min(100, Math.round(((totalViews - 10000) / 20000) * 1000) / 10);

    const reply = `🏆 *CHANNEL LEVEL PROGRESSION* 🎮

🥈 *Current Rank*: *LEVEL 2: RISING UNDERGROUND STUDIO*
📈 *Progress*: \`${pct}% Completed\` (${totalViews.toLocaleString()} / 30,000 XP)

🎯 *Targets to Unlock LEVEL 3*:
• Total Views: \`${totalViews.toLocaleString()} / 30,000\` (*Only ${viewsLeft.toLocaleString()} views left!*)
• Subscribers: \`${snapshot.subscribers} / 100\` (*Only ${subsLeft} subs left!*)
• Boss Tracks: \`4 / 3 Tracks >1K Views\` (✅ *Completed!*)
• Peak Velocity: \`48 / 40 v/hr\` (✅ *Completed!*)

Level 3 unlock hote hi YouTube Music *Topic* channel aur *Day-One Browse Homepage Push* unlock hoga!
👉 View Quest Roadmap: https://supasonicbeats.vercel.app`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 4. TOP MOVERS
  if (lowerText === "/movers" || lowerText === "/top" || lowerText === "🔥 top movers" || lowerText === "top") {
    const reply = `🔥 *TOP TRACKS DRIVING VELOCITY TODAY* 🎧

1. 👑 *DEEDAR DE [124 BPM]*: \`4,634 views\` (+16 views this hour)
2. ⚡ *AAO NA [120 BPM]*: \`2,501 views\` (High repeat listens)
3. 🚀 *IN THE NIGHT [126 BPM]*: \`1,658 views\` (Dance club momentum)
4. 🌟 *KALYANI [122 BPM]*: \`1,207 views\` (Consistent search traffic)
5. 🎯 *BHAR LE TU [124 BPM]*: \`990 views\` (Only 10 views to 1K!)
6. 🔥 *MAJBOOR [118 BPM]*: \`490 views\` (Jumped +95 views today!)

👉 Open In-App Player: https://supasonicbeats.vercel.app`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 5. BOSS BATTLES
  if (lowerText === "/boss" || lowerText === "⚔️ boss battles" || lowerText === "boss") {
    const reply = `⚔️ *ACTIVE BOSS BATTLES (Tracks Near Promotion)* 🏆

1. 🎯 *BHAR LE TU*: \`990 / 1,000 views\` (99% Done)
   👉 *Sirf 10 views bache hain* 5th Boss Track banne ke liye!

2. 🔥 *MAJBOOR (Duet)*: \`490 / 500 views\` (98% Done)
   👉 *Sirf 10 views bache hain* Elite Tier (>500 views) cross karne ke liye!

3. 👑 *DEEDAR DE*: \`4,634 / 5,000 views\` (92.6% Done)
   👉 *366 views bache hain* channel ka pehla 5K Megahit banne ke liye!

4. 💎 *DIL LAGA LIYA*: \`800 / 1,000 views\` (80% Done)
   👉 *200 views bache hain* 1K Club mein enter karne ke liye!

In tracks ko boost karte hi Channel Level 3 unlock hoga!`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 6. MARKET PREDICTIONS
  if (lowerText === "/predict" || lowerText === "📈 market predictions" || lowerText === "predict") {
    const reply = `📈 *BEATEXCHANGE 2.0 • MARKET PREDICTIONS* 🏦

💼 *Portfolio Balance*: \`16,700 SB Coins\` (+64.5% PnL)
🎯 *Win Rate*: \`80.0% (4 Wins / 1 Loss)\`

🎮 *Tomorrow's Top Trade Picks (04 Nov)*:
• *MAJBOOR [122 BPM]*: \`CALL (BUY)\` @ Target 620 views (Current: 490v, momentum heavy!)
• *TU MIL JAAYE [120 BPM]*: \`CALL (BUY)\` @ Target 90 views (Seeding into browse)
• *BHAR LE TU [124 BPM]*: \`CALL (BUY)\` @ Target 1,020 views (Breakout imminent!)

👉 Trade in App: https://supasonicbeats.vercel.app`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 7. OPEN APP
  if (lowerText === "🌐 open studio app" || lowerText === "/app" || lowerText === "app") {
    const reply = `🌐 *SUPASONIC BEATS PRO STUDIO 2.0* 🎧

Permanent Web App URL:
👉 https://supasonicbeats.vercel.app

Phone par kholiye aur direct:
• In-App Beat Preview Player suniye
• Daily +250 SB Coins claim kijiye
• Level-Up RPG Quests check kijiye!`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // 8. SPECIFIC TRACK SEARCH
  if (lowerText.includes("deedar")) {
    const reply = `👑 *DEEDAR DE [124 BPM]*
• Total Views: \`4,634 views\`
• Rank: #1 All-Time Catalog Bestseller
• Next Milestone: \`5,000 Views\` (366 views left — 92.6% Done!)
• Status: Driving heavy organic search traffic!`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  if (lowerText.includes("majboor")) {
    const reply = `🔥 *MAJBOOR (Duet Version) [118 BPM]*
• Total Views: \`490 views\` (Jumped +95 views today!)
• Next Milestone: \`500 Views\` (Only 10 views left!)
• Status: 12X Velocity breakout with 78.6% completion rate!`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  if (lowerText.includes("bhar le tu")) {
    const reply = `🎯 *BHAR LE TU [124 BPM]*
• Total Views: \`990 views\`
• Next Milestone: \`1,000 Views\` (Only 10 views left — 99% Done!)
• Status: Entering the 1,000 Views Club! Will become 5th Boss Track.`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  if (lowerText.includes("zara zara")) {
    const reply = `🌟 *ZARA ZARA [124 BPM]*
• Total Views: \`606 views\`
• Rank: Elite Performer
• Next Milestone: \`800 Views\` (75.8% Progress)
• Status: Late night car drive favorite with heavy sub-bass repeat listens!`;
    await sendTelegramReply(chatId, reply, mainMenuKeyboard);
    return;
  }

  // Default fallback response
  const fallback = `🤖 *Supasonic Beats Studio AI*

Aapne poocha: "${rawText}"

Aap neeche diye gaye buttons tap karke live metrics check kar sakte hain ya type karein:
• \`/stats\` — Live Views & Subs
• \`/level\` — Channel Quests & XP
• \`/movers\` — Trending Songs
• \`/boss\` — Tracks Near Promotion`;
  await sendTelegramReply(chatId, fallback, mainMenuKeyboard);
}

async function pollUpdates() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=15`);
    const json = await res.json();

    if (json.ok && Array.isArray(json.result)) {
      for (const update of json.result) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    }
  } catch (err) {
    // Network or timeout, ignore and continue
  }

  // Continue long polling
  setTimeout(pollUpdates, 1000);
}

console.log("🚀 Starting Supasonic Beats Interactive Telegram Bot Listener...");
pollUpdates();
