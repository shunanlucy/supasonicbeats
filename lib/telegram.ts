import fs from "fs";
import path from "path";

const CHAT_FILE = path.join(process.cwd(), "data", "telegram_chat.json");
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "9149806319:AAF1BKIZwOJIeYEZaM7YZKXhohC0sdGUJSo";

/**
 * Reads or discovers the active chat ID of the user.
 */
export async function getActiveChatId(): Promise<string | null> {
  // 1. Check local cache file
  if (fs.existsSync(CHAT_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CHAT_FILE, "utf-8"));
      if (data.chatId) return String(data.chatId);
    } catch (e) {}
  }

  // 2. Poll Telegram getUpdates to auto-discover user who messaged the bot
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const json = await res.json();
    if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
      // Find the last message with a chat id
      const lastUpdate = json.result[json.result.length - 1];
      const chatId =
        lastUpdate.message?.chat?.id || lastUpdate.channel_post?.chat?.id;
      if (chatId) {
        // Save to cache
        fs.writeFileSync(
          CHAT_FILE,
          JSON.stringify({ chatId: String(chatId), lastUpdated: new Date().toISOString() }, null, 2),
          "utf-8"
        );
        return String(chatId);
      }
    }
  } catch (err: any) {
    console.warn("Could not discover Telegram chat ID:", err.message);
  }

  return null;
}

/**
 * Sends a message via Telegram Bot.
 */
export async function sendTelegramMessage(message: string, explicitChatId?: string): Promise<boolean> {
  const chatId = explicitChatId || (await getActiveChatId());
  if (!chatId) {
    console.log("No Telegram chat ID registered yet. Waiting for user to send /start to bot.");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    return !!data.ok;
  } catch (error: any) {
    console.error("Failed to send Telegram message:", error.message);
    return false;
  }
}

/**
 * Sends an urgent Velocity Peak surge alert
 */
export async function sendVelocitySurgeAlert(ratePerHour: number, deltaViews: number, topTrack: string) {
  const text = `🚨 *SUPASONIC BEATS • VELOCITY SURGE DETECTED!* 🎧🔥

⚡ *Surge Rate*: \`${ratePerHour.toFixed(1)} views/hour\`
📈 *Recent Delta*: \`+${deltaViews} views\`
🔥 *Top Mover*: *${topTrack}*

Raat ka night-drive peak active hai! Algorithm circulation badha raha hai.
👉 View Live Radar: https://supasonicbeats.vercel.app`;

  return sendTelegramMessage(text);
}

/**
 * Sends a Boss Milestone alert
 */
export async function sendBossMilestoneAlert(trackTitle: string, currentViews: number, milestoneName: string) {
  const text = `👑 *BOSS BATTLE WON • MILESTONE UNLOCKED!* 🏆✨

Track: *${trackTitle}*
Views: \`${currentViews.toLocaleString()} views\`
Milestone: *${milestoneName}*

Level 3 Boss Quest progress updated! Channel XP badh gaya hai.
👉 View Progression: https://supasonicbeats.vercel.app`;

  return sendTelegramMessage(text);
}
