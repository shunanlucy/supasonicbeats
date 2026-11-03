import { NextResponse } from "next/server";
import { fetchChannelData } from "@/lib/youtube";
import { auditVideoCatalog } from "@/lib/catalogAudit";
import { calculateVelocityRadar } from "@/lib/velocityTracker";

export async function GET() {
  try {
    const channelData = await fetchChannelData();
    const audit = auditVideoCatalog(channelData.beatVideos);
    const velocity = calculateVelocityRadar(channelData.beatVideos);

    return NextResponse.json({
      success: true,
      channel: channelData.overview,
      audit,
      velocity,
    });
  } catch (error: any) {
    console.error("Catalog audit API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
