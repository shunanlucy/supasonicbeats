import { NextRequest, NextResponse } from "next/server";
import { getCompetitorLeaderboard } from "@/lib/competitorRanking";

export async function GET(req: NextRequest) {
  try {
    const data = getCompetitorLeaderboard();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error("Competitors API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
