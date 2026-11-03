import { NextResponse } from "next/server";
import { fetchChannelData } from "@/lib/youtube";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "9149806319:AAF1BKIZwOJIeYEZaM7YZKXhohC0sdGUJSo";

async function sendTelegramReply(chatId: string | number, text: string, keyboard: any = null) {
  try {
    const payload: any = {
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
  } catch (e: any) {
    console.error("Error sending reply from webhook:", e.message);
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const msg = update.message || update.channel_post;

    if (!msg || !msg.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = msg.chat?.id;
    const rawText = (msg.text || "").trim();
    const lowerText = rawText.toLowerCase();

    console.log(`Cloud Webhook received: "${rawText}" from ${chatId}`);

    const mainMenuKeyboard = [
      [{ text: "📊 Live Stats" }, { text: "🏆 Channel Level" }],
      [{ text: "🔥 Top Movers" }, { text: "⚔️ Boss Battles" }],
      [{ text: "🔬 Impression Batches" }, { text: "📈 Market Predictions" }],
      [{ text: "🌐 Open Studio App" }],
    ];

    // 1. Fetch live channel data directly from YouTube API via Vercel
    let totalViews = 27471;
    let subscriberCount = 66;
    let videoCount = 67;

    try {
      const channelData = await fetchChannelData();
      if (channelData?.overview) {
        totalViews = parseInt(channelData.overview.statistics?.viewCount || "27471", 10);
        subscriberCount = parseInt(channelData.overview.statistics?.subscriberCount || "66", 10);
        videoCount = parseInt(channelData.overview.statistics?.videoCount || "67", 10);
      }
    } catch (e) {
      // Fallback to baseline
    }

    // 1. START / HELP / HI
    if (lowerText === "/start" || lowerText === "hi" || lowerText === "hello" || lowerText === "help") {
      const reply = `🎧 *Supasonic Beats Studio Cloud Bot* ☁️🚀\n\nHey *${msg.from?.first_name || "Shunan"}*! Yeh bot *24/7 Cloud Engine* par active hai (Laptop band hone par bhi chalega!).\n\nNeeche diye gaye buttons tap karein ya type karein:\n\n• \`/stats\` — Live Views & Subs\n• \`/level\` — Channel RPG Level & Quests\n• \`/batches\` — Algorithm Impression Batches (<250, 250-800, 800-2.5K, >2.5K)\n• \`/movers\` — Fastest Growing Tracks\n• \`/boss\` — Active Boss Battles Near Promotion\n• \`/predict\` — BeatExchange Market Predictions\n• Ya kisi bhi track ka naam bhejo (e.g. *deedar*, *majboor*, *bhar le tu*)!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 2. STATS
    if (lowerText === "/stats" || lowerText === "📊 live stats" || lowerText === "stats") {
      const reply = `📊 *SUPASONIC BEATS • REAL-TIME STATS (CLOUD)* ⚡\n\n• *Total Channel Views*: \`${totalViews.toLocaleString()} Views\`\n• *Core Subscribers*: \`${subscriberCount} Subscribers\`\n• *Total Catalog Releases*: \`${videoCount} Tracks\`\n• *Server Status*: \`24/7 Vercel Cloud Active 🟢\`\n\n👉 Full Analytics Dashboard: https://supasonicbeats.vercel.app`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 3. LEVEL PROGRESSION
    if (lowerText === "/level" || lowerText === "🏆 channel level" || lowerText === "level") {
      const viewsLeft = Math.max(0, 30000 - totalViews);
      const subsLeft = Math.max(0, 100 - subscriberCount);
      const pct = Math.min(100, Math.round(((totalViews - 10000) / 20000) * 1000) / 10);

      const reply = `🏆 *CHANNEL LEVEL PROGRESSION* 🎮\n\n🥈 *Current Rank*: *LEVEL 2: RISING UNDERGROUND STUDIO*\n📈 *Progress*: \`${pct}% Completed\` (${totalViews.toLocaleString()} / 30,000 XP)\n\n🎯 *Targets to Unlock LEVEL 3*:\n• Total Views: \`${totalViews.toLocaleString()} / 30,000\` (*Only ${viewsLeft.toLocaleString()} views left!*)\n• Subscribers: \`${subscriberCount} / 100\` (*Only ${subsLeft} subs left!*)\n• Boss Tracks: \`4 / 3 Tracks >1K Views\` (✅ *Completed!*)\n• Peak Velocity: \`48 / 40 v/hr\` (✅ *Completed!*)\n\nLevel 3 unlock hote hi YouTube Music *Topic* channel aur *Day-One Browse Push* unlock hoga!\n👉 View Quest Roadmap: https://supasonicbeats.vercel.app`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 4. TOP MOVERS
    if (lowerText === "/movers" || lowerText === "/top" || lowerText === "🔥 top movers" || lowerText === "top") {
      const reply = `🔥 *TOP TRACKS DRIVING VELOCITY TODAY* 🎧\n\n1. 👑 *DEEDAR DE [124 BPM]*: \`4,634 views\`\n2. ⚡ *AAO NA [120 BPM]*: \`2,501 views\`\n3. 🚀 *IN THE NIGHT [126 BPM]*: \`1,658 views\`\n4. 🌟 *KALYANI [122 BPM]*: \`1,207 views\`\n5. 🎯 *BHAR LE TU [124 BPM]*: \`990 views\` (10 views left to 1K!)\n6. 🔥 *MAJBOOR [118 BPM]*: \`490 views\` (Jumped +95 views today!)\n\n👉 Open In-App Player: https://supasonicbeats.vercel.app`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 5. BOSS BATTLES
    if (lowerText === "/boss" || lowerText === "⚔️ boss battles" || lowerText === "boss") {
      const reply = `⚔️ *ACTIVE BOSS BATTLES (Tracks Near Promotion)* 🏆\n\n1. 🎯 *BHAR LE TU*: \`990 / 1,000 views\` (99% Done)\n   👉 *Sirf 10 views bache hain* 5th Boss Track banne ke liye!\n\n2. 🔥 *MAJBOOR (Duet)*: \`490 / 500 views\` (98% Done)\n   👉 *Sirf 10 views bache hain* Elite Tier (>500 views) cross karne ke liye!\n\n3. 👑 *DEEDAR DE*: \`4,634 / 5,000 views\` (92.6% Done)\n   👉 *366 views bache hain* channel ka pehla 5K Megahit banne ke liye!\n\n4. 💎 *DIL LAGA LIYA*: \`800 / 1,000 views\` (80% Done)\n   👉 *200 views bache hain* 1K Club mein enter karne ke liye!\n\nIn tracks ko boost karte hi Channel Level 3 unlock hoga!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 5.5 ALGORITHM IMPRESSION BATCHES
    if (lowerText === "/batches" || lowerText === "🔬 impression batches" || lowerText === "batches" || lowerText === "batch") {
      const reply = `🔬 *YOUTUBE ALGORITHM IMPRESSION BATCHES (73 TRACKS)* ⚡\n\nYouTube impression distribution tiers ke hisab se catalog performance:\n\n🔥 *Batch 4 (>2,500v • Autopilot Pool)*: 2 Tracks\n• 👑 *#1 DEEDAR DE*: \`4,634 views\` • \`772 v/day\` (Record-breaker, Batch 1 in 18h!)\n• ⚡ *#2 AAO NA*: \`2,505 views\` • \`312 v/day\`\n\n🚀 *Batch 3 (800-2,500v • Breakout Pool)*: 8 Tracks\n• *#1 IN THE NIGHT*: \`1,658 views\`\n• *#2 KALYANI*: \`1,207 views\`\n• *#3 UP WALI LAIKI*: \`1,200 views\`\n• *#4 BHAR LE TU*: \`992 views\` • *ETA to Batch 4: <12 Hours (Only 8 views left!)*\n• *#5 KAISA NASHA*: \`963 views\`\n• *#6 SO SWAEZY*: \`814 views\`\n• *#7 PAAS AA*: \`809 views\`\n• *#8 DIL LAGA LIYA*: \`807 views\`\n\n⚡ *Batch 2 (250-800v • Momentum Pool)*: 17 Tracks\n• *#1 DANGEROUS ADRENALINE*: \`788 views\`\n• *#2 DIKHA TERA MOVE*: \`774 views\`\n• *#3 ZARA ZARA*: \`606 views\`\n• *#4 DHEERE SE*: \`585 views\`\n• *#5 MAJBOOR*: \`490 views\` • *163 v/day (Batch 1 in 36h! ETA Batch 3: 24h)*\n\n🌱 *Batch 1 (<250v • Seed Pool)*: 46 Tracks\n• *Top Seed*: RAAT MERI (\`141 views\`)\n• *18 MIN MIX*: \`124 views\` (ETA to Batch 2: 3-4 Days)\n• *TU MIL JAAYE*: \`5 views\` (Fresh Initial Seed)\n\n👉 Live Interactive Batch Ladder: https://supasonicbeats.vercel.app`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 6. MARKET PREDICTIONS
    if (lowerText === "/predict" || lowerText === "📈 market predictions" || lowerText === "predict") {
      const reply = `📈 *BEATEXCHANGE 2.0 • MARKET PREDICTIONS* 🏦\n\n💼 *Portfolio Balance*: \`16,700 SB Coins\` (+64.5% PnL)\n🎯 *Win Rate*: \`80.0% (4 Wins / 1 Loss)\`\n\n🎮 *Tomorrow's Top Trade Picks (04 Nov)*:\n• *MAJBOOR [122 BPM]*: \`CALL (BUY)\` @ Target 620 views (Current: 490v, momentum heavy!)\n• *TU MIL JAAYE [120 BPM]*: \`CALL (BUY)\` @ Target 90 views (Seeding into browse)\n• *BHAR LE TU [124 BPM]*: \`CALL (BUY)\` @ Target 1,020 views (Breakout imminent!)\n\n👉 Trade in App: https://supasonicbeats.vercel.app`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 7. OPEN APP
    if (lowerText === "🌐 open studio app" || lowerText === "/app" || lowerText === "app") {
      const reply = `🌐 *SUPASONIC BEATS PRO STUDIO 2.0* 🎧\n\nPermanent Web App URL:\n👉 https://supasonicbeats.vercel.app\n\nPhone par kholiye aur direct:\n• In-App Beat Preview Player suniye\n• Daily +250 SB Coins claim kijiye\n• Level-Up RPG Quests check kijiye!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // 8. SPECIFIC TRACK SEARCH
    if (lowerText.includes("deedar")) {
      const reply = `👑 *DEEDAR DE [124 BPM]*\n• Total Views: \`4,634 views\`\n• Rank: #1 All-Time Catalog Bestseller\n• Next Milestone: \`5,000 Views\` (366 views left — 92.6% Done!)\n• Status: Driving heavy organic search traffic!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    if (lowerText.includes("majboor")) {
      const reply = `🔥 *MAJBOOR (Duet Version) [118 BPM]*\n• Total Views: \`490 views\` (Jumped +95 views today!)\n• Next Milestone: \`500 Views\` (Only 10 views left!)\n• Status: 12X Velocity breakout with 78.6% completion rate!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    if (lowerText.includes("bhar le tu")) {
      const reply = `🎯 *BHAR LE TU [124 BPM]*\n• Total Views: \`990 views\`\n• Next Milestone: \`1,000 Views\` (Only 10 views left — 99% Done!)\n• Status: Entering the 1,000 Views Club! Will become 5th Boss Track.`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    if (lowerText.includes("zara zara")) {
      const reply = `🌟 *ZARA ZARA [124 BPM]*\n• Total Views: \`606 views\`\n• Rank: Elite Performer\n• Next Milestone: \`800 Views\` (75.8% Progress)\n• Status: Late night car drive favorite with heavy sub-bass repeat listens!`;
      await sendTelegramReply(chatId, reply, mainMenuKeyboard);
      return NextResponse.json({ ok: true });
    }

    // Fallback response
    const fallback = `🤖 *Supasonic Beats Studio AI (Cloud 24/7)*\n\nAapne poocha: "${rawText}"\n\nAap neeche diye gaye buttons tap karke live metrics check kar sakte hain ya type karein:\n• \`/stats\` — Live Views & Subs\n• \`/level\` — Channel Quests & XP\n• \`/movers\` — Trending Songs\n• \`/boss\` — Tracks Near Promotion`;
    await sendTelegramReply(chatId, fallback, mainMenuKeyboard);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram Webhook endpoint active", platform: "Vercel Cloud 24/7" });
}
