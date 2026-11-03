import { NextRequest, NextResponse } from "next/server";
import { fetchChannelData, fetchAnalyticsData } from "@/lib/youtube";
import { generateTrendRecommendations } from "@/lib/trendEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "28", 10);

    const [channelData, analytics] = await Promise.all([
      fetchChannelData(),
      fetchAnalyticsData(days),
    ]);

    // Subgenre performance analysis
    const genreStats: Record<string, { totalViews: number; count: number; avgViews: number }> = {};
    channelData.beatVideos.forEach((v) => {
      const g = v.genre || "Hindi Electronic";
      if (!genreStats[g]) {
        genreStats[g] = { totalViews: 0, count: 0, avgViews: 0 };
      }
      genreStats[g].totalViews += v.views;
      genreStats[g].count += 1;
    });

    Object.keys(genreStats).forEach((g) => {
      genreStats[g].avgViews = Math.round(genreStats[g].totalViews / genreStats[g].count);
    });

    const genreLeaderboard = Object.entries(genreStats)
      .map(([genre, stats]) => ({
        genre,
        ...stats,
      }))
      .sort((a, b) => b.avgViews - a.avgViews);

    const topBeats = [...channelData.beatVideos].sort((a, b) => b.views - a.views).slice(0, 8);
    const topEngagedBeats = [...channelData.beatVideos].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 5);
    const trends = generateTrendRecommendations(channelData.beatVideos);

    return NextResponse.json({
      success: true,
      channel: channelData.overview,
      beats: channelData.beatVideos,
      analytics,
      genreLeaderboard,
      trends,
      insights: {
        topBeats,
        topEngagedBeats,
        bestPerformingGenre: genreLeaderboard[0]?.genre || "Hindi Afro House",
        totalUploadsAnalyzed: channelData.beatVideos.length,
      },
    });
  } catch (error: any) {
    console.error("API analytics error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics" },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
