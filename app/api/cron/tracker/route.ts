import { NextResponse } from "next/server";
import { fetchChannelData } from "@/lib/youtube";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  try {
    const data = await fetchChannelData();
    if (!data?.overview) {
      return NextResponse.json({ ok: false, error: "No channel data" });
    }

    const currentViews = parseInt(data.overview.statistics?.viewCount || "27471", 10);
    const currentSubs = parseInt(data.overview.statistics?.subscriberCount || "66", 10);
    const recentBeats = (data as any).beatVideos || (data as any).recentBeats || [];

    // Check for Bhar Le Tu milestone
    const bharLeTu = recentBeats.find((b: any) => b.id === "lQl3dRGivOI" || b.title.includes("BHAR LE TU"));
    if (bharLeTu && bharLeTu.views >= 1000) {
      await sendTelegramMessage(
        `👑 *BOSS BATTLE WON • BHAR LE TU HIT 1,000 VIEWS!* 🏆\n\nBhar Le Tu is now your 5th Boss Track!\n👉 Check App: https://supasonicbeats.vercel.app`
      );
    }

    // Check for Majboor 500 milestone
    const majboor = recentBeats.find((b: any) => b.id === "h7sJw_li4F0" || b.title.includes("MAJBOOR"));
    if (majboor && majboor.views >= 500) {
      await sendTelegramMessage(
        `🥇 *ELITE TIER REACHED • MAJBOOR HIT 500 VIEWS!* 🚀\n\nMajboor crossed 500 views! Algorithm expansion underway.\n👉 Check App: https://supasonicbeats.vercel.app`
      );
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      views: currentViews,
      subs: currentSubs,
      status: "Cloud Tracker Cron Executed Successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
