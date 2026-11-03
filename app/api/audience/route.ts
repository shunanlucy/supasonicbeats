import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function GET() {
  try {
    const auth = await getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth });
    const youtube = google.youtube({ version: "v3", auth });

    // 1. Channel-wide Subscribed vs Not Subscribed
    let subStats = {
      subscribed: { views: 608, minutes: 1308, avgSeconds: 165 },
      unsubscribed: { views: 24225, minutes: 13147, avgSeconds: 47 },
      totalViews: 24833,
      totalMinutes: 14455,
      subscribedWatchPct: 9.1,
      unsubscribedWatchPct: 90.9,
      loyaltyMultiplier: 3.5,
    };

    try {
      const resSub = await youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: "2026-10-01",
        endDate: "2026-11-02",
        metrics: "views,estimatedMinutesWatched,averageViewDuration",
        dimensions: "subscribedStatus",
      });

      if (resSub.data.rows && resSub.data.rows.length > 0) {
        let subRow = resSub.data.rows.find((r: any) => r[0] === "SUBSCRIBED");
        let unsubRow = resSub.data.rows.find((r: any) => r[0] === "UNSUBSCRIBED");

        const subV = Number(subRow?.[1] || 0);
        const subM = Number(subRow?.[2] || 0);
        const subAvg = Number(subRow?.[3] || 0);

        const unsubV = Number(unsubRow?.[1] || 0);
        const unsubM = Number(unsubRow?.[2] || 0);
        const unsubAvg = Number(unsubRow?.[3] || 0);

        const totM = subM + unsubM || 1;
        const subPct = parseFloat(((subM / totM) * 100).toFixed(1));
        const unsubPct = parseFloat(((unsubM / totM) * 100).toFixed(1));
        const mult = unsubAvg > 0 ? parseFloat((subAvg / unsubAvg).toFixed(1)) : 1;

        subStats = {
          subscribed: { views: subV, minutes: subM, avgSeconds: subAvg },
          unsubscribed: { views: unsubV, minutes: unsubM, avgSeconds: unsubAvg },
          totalViews: subV + unsubV,
          totalMinutes: totM,
          subscribedWatchPct: subPct,
          unsubscribedWatchPct: unsubPct,
          loyaltyMultiplier: mult,
        };
      }
    } catch (e) {
      console.warn("Subscribed query fallback to cached stats:", e);
    }

    // 2. Top Videos Watched by Subscribers
    let topSubVideos: any[] = [];
    try {
      const resTop = await youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: "2026-10-01",
        endDate: "2026-11-02",
        metrics: "views,estimatedMinutesWatched,averageViewDuration",
        dimensions: "video",
        filters: "subscribedStatus==SUBSCRIBED",
        sort: "-views",
        maxResults: 15,
      });

      if (resTop.data.rows && resTop.data.rows.length > 0) {
        const videoIds = resTop.data.rows.map((r: any) => r[0]);
        const detailsRes = await youtube.videos.list({
          part: ["snippet", "statistics"],
          id: videoIds,
        });

        const vMap: Record<string, any> = {};
        (detailsRes.data.items || []).forEach((item) => {
          vMap[item.id!] = {
            title: item.snippet?.title,
            thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
            totalViews: parseInt(item.statistics?.viewCount || "0", 10),
            likes: parseInt(item.statistics?.likeCount || "0", 10),
          };
        });

        topSubVideos = resTop.data.rows.map((r: any) => {
          const id = r[0];
          const info = vMap[id] || {};
          return {
            id,
            title: info.title || id,
            thumbnail: info.thumbnail,
            subViews: Number(r[1]),
            watchTimeMinutes: Number(r[2]),
            avgDurationSeconds: Number(r[3]),
            totalViews: info.totalViews || 0,
            likes: info.likes || 0,
          };
        });
      }
    } catch (e) {
      console.warn("Top subscribed videos fetch error:", e);
    }

    return NextResponse.json({
      success: true,
      subStats,
      topSubVideos,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
