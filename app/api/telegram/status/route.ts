import { NextResponse } from "next/server";
import { getActiveChatId, sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  const chatId = await getActiveChatId();
  return NextResponse.json({
    connected: !!chatId,
    chatId: chatId ? `${chatId.slice(0, 3)}***${chatId.slice(-3)}` : null,
    botUsername: "@SupasonicBeatsBot",
    instruction: "Send /start or any message to @SupasonicBeatsBot on Telegram to activate alerts.",
  });
}

export async function POST() {
  const chatId = await getActiveChatId();
  if (!chatId) {
    return NextResponse.json({
      success: false,
      error: "No active chat found. Please open @SupasonicBeatsBot on Telegram and tap 'Start' first!",
    });
  }

  const success = await sendTelegramMessage(
    `🎧 *Supasonic Beats Studio Bot Connected!* 🚀✨\n\nAapka Telegram bot successfully active ho chuka hai.\n\nRozana night-peak velocity (>40 views/hr) aur Boss track milestones (1K, 5K views) ka alert direct yahan aayega!`
  );

  return NextResponse.json({ success });
}
