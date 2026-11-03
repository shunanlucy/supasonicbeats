import { google } from "googleapis";
import { getAuthenticatedClient } from "./googleAuth";

export interface ChannelOverview {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: any;
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  bannerUrl?: string | null;
}

export interface BeatVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  bpm?: number | null;
  key?: string | null;
  genre?: string | null;
  engagementScore: number;
}

export interface DailyStat {
  date: string;
  views: number;
  watchTimeHours: number;
  subsNet: number;
}

export interface TrafficSource {
  source: string;
  views: number;
  percentage: number;
}

export interface GeoStat {
  country: string;
  views: number;
  watchTimeHours: number;
}

// Helper to format ISO 8601 duration (PT3M25S -> 3:25)
export function parseDuration(durationStr: string): string {
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Music / Beat extractor tailored for Supasonic Beats musical universe
export function extractBeatMetadata(title: string, tags: string[] = []) {
  // Extract BPM (e.g., "124 BPM", "140bpm", "@ 124 bpm", "[125 BPM]")
  const bpmMatch = title.match(/(\d{2,3})\s*(?:bpm|BPM)/i) || 
    tags.find(t => /\b\d{2,3}\s*bpm\b/i.test(t))?.match(/(\d{2,3})/);
  const bpm = bpmMatch ? parseInt(bpmMatch[1], 10) : null;

  // Extract Key (e.g., "C Minor", "D# Maj", "F#min", "A Min", "F Minor")
  const keyMatch = title.match(/\b([A-G][#b]?(?:\s*(?:min(?:or)?|maj(?:or)?|m)))\b/i);
  const key = keyMatch ? keyMatch[1].toUpperCase() : null;

  // Specific Subgenres for Supasonic Beats
  const lowerTitle = title.toLowerCase();
  let genre = "Hindi Electronic";

  if (lowerTitle.includes("afro house") || lowerTitle.includes("afro beats")) {
    genre = "Hindi Afro House";
  } else if (lowerTitle.includes("deep house")) {
    genre = "Deep House";
  } else if (lowerTitle.includes("club banger") || lowerTitle.includes("club bangers")) {
    genre = "Club Bangers";
  } else if (lowerTitle.includes("late night") || lowerTitle.includes("drive mix") || lowerTitle.includes("drive")) {
    genre = "Late Night Drive";
  } else if (lowerTitle.includes("dance pop") || lowerTitle.includes("party rap")) {
    genre = "Dance Pop";
  } else if (lowerTitle.includes("phonk") || lowerTitle.includes("trance")) {
    genre = "Dark Phonk / Trance";
  } else if (lowerTitle.includes("romantic") || lowerTitle.includes("acoustic") || lowerTitle.includes("indie")) {
    genre = "Romantic / Acoustic";
  } else if (lowerTitle.includes("jukebox") || lowerTitle.includes("mix") || lowerTitle.includes("vol.")) {
    genre = "Jukebox / Mix";
  } else if (lowerTitle.includes("pov:") || lowerTitle.includes("wait for the drop") || lowerTitle.includes("#shorts")) {
    genre = "Shorts / Teaser";
  }

  return { bpm, key, genre };
}

export async function fetchChannelData() {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const youtube = google.youtube({ version: "v3", auth });

  // 1. Fetch channel snippet, statistics, branding
  const channelRes = await youtube.channels.list({
    part: ["snippet", "statistics", "contentDetails", "brandingSettings"],
    mine: true,
  });

  const channel = channelRes.data.items?.[0];
  if (!channel) throw new Error("Channel not found");

  const overview: ChannelOverview = {
    id: channel.id || "",
    title: channel.snippet?.title || "SUPASONIC BEATS",
    description: channel.snippet?.description || "",
    customUrl: channel.snippet?.customUrl || "",
    publishedAt: channel.snippet?.publishedAt || "",
    thumbnails: channel.snippet?.thumbnails,
    statistics: {
      viewCount: channel.statistics?.viewCount || "0",
      subscriberCount: channel.statistics?.subscriberCount || "0",
      hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || false,
      videoCount: channel.statistics?.videoCount || "0",
    },
    bannerUrl: channel.brandingSettings?.image?.bannerExternalUrl,
  };

  // 2. Fetch Recent Videos / Beats
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  let beatVideos: BeatVideo[] = [];

  if (uploadsPlaylistId) {
    const playlistRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
    });

    const videoIds = playlistRes.data.items
      ?.map((item) => item.contentDetails?.videoId)
      .filter(Boolean) as string[];

    if (videoIds.length > 0) {
      const videosRes = await youtube.videos.list({
        part: ["snippet", "statistics", "contentDetails"],
        id: videoIds,
      });

      beatVideos = (videosRes.data.items || []).map((v) => {
        const views = parseInt(v.statistics?.viewCount || "0", 10);
        const likes = parseInt(v.statistics?.likeCount || "0", 10);
        const comments = parseInt(v.statistics?.commentCount || "0", 10);
        const tags = v.snippet?.tags || [];
        const title = v.snippet?.title || "";
        const meta = extractBeatMetadata(title, tags);

        // Engagement score: (likes * 10 + comments * 20) / views * 100
        const engagementScore = views > 0 ? parseFloat((((likes * 10 + comments * 20) / views) * 10).toFixed(2)) : 0;

        return {
          id: v.id || "",
          title,
          description: v.snippet?.description || "",
          publishedAt: v.snippet?.publishedAt || "",
          thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || "",
          duration: parseDuration(v.contentDetails?.duration || "PT0S"),
          views,
          likes,
          comments,
          tags,
          bpm: meta.bpm,
          key: meta.key,
          genre: meta.genre,
          engagementScore,
        };
      });
    }
  }

  return { overview, beatVideos };
}

export async function fetchAnalyticsData(days: number = 28) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth });

  const endDateObj = new Date();
  const startDateObj = new Date();
  startDateObj.setDate(endDateObj.getDate() - days);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const startDate = formatDate(startDateObj);
  const endDate = formatDate(endDateObj);

  let summary = {
    views: 0,
    watchTimeHours: 0,
    averageViewDurationSeconds: 0,
    subscribersGained: 0,
    subscribersLost: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    estimatedRevenue: 0,
  };

  let dailyStats: DailyStat[] = [];
  let trafficSources: TrafficSource[] = [];
  let geoStats: GeoStat[] = [];

  try {
    // 1. Overall Summary Report
    const summaryRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      metrics: "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares",
    });

    const row = summaryRes.data.rows?.[0];
    if (row) {
      const views = Number(row[0]) || 0;
      const minutesWatched = Number(row[1]) || 0;
      summary = {
        views,
        watchTimeHours: parseFloat((minutesWatched / 60).toFixed(1)),
        averageViewDurationSeconds: Math.round(Number(row[2]) || 0),
        subscribersGained: Number(row[3]) || 0,
        subscribersLost: Number(row[4]) || 0,
        likes: Number(row[5]) || 0,
        comments: Number(row[6]) || 0,
        shares: Number(row[7]) || 0,
        estimatedRevenue: 0,
      };
    }
  } catch (err: any) {
    console.warn("Analytics summary query error:", err.message);
  }

  try {
    // 2. Daily Timeline
    const dailyRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "day",
      sort: "day",
      metrics: "views,estimatedMinutesWatched,subscribersGained,subscribersLost",
    });

    if (dailyRes.data.rows) {
      dailyStats = dailyRes.data.rows.map((r: any) => ({
        date: r[0],
        views: Number(r[1]) || 0,
        watchTimeHours: parseFloat(((Number(r[2]) || 0) / 60).toFixed(2)),
        subsNet: (Number(r[3]) || 0) - (Number(r[4]) || 0),
      }));
    }
  } catch (err: any) {
    console.warn("Daily analytics query error:", err.message);
  }

  try {
    // 3. Traffic Sources
    const trafficRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "insightTrafficSourceType",
      sort: "-views",
      metrics: "views",
    });

    if (trafficRes.data.rows) {
      const totalViews = trafficRes.data.rows.reduce((acc: number, r: any) => acc + (Number(r[1]) || 0), 0);
      const friendlyLabels: Record<string, string> = {
        YT_SEARCH: "YouTube Search",
        RELATED_VIDEO: "Suggested / Up Next",
        SUBSCRIBER: "Subscription Feed",
        YT_CHANNEL: "Channel Page",
        YT_OTHER_PAGE: "YouTube Features / Playlists",
        EXTERNAL: "External (BeatStars/Insta/Web)",
        NO_LINK_EMBEDDED: "Direct / Embedded Player",
        SHORTS: "YouTube Shorts Feed",
      };

      trafficSources = trafficRes.data.rows.map((r: any) => {
        const rawKey = String(r[0]);
        const views = Number(r[1]) || 0;
        return {
          source: friendlyLabels[rawKey] || rawKey,
          views,
          percentage: totalViews > 0 ? parseFloat(((views / totalViews) * 100).toFixed(1)) : 0,
        };
      });
    }
  } catch (err: any) {
    console.warn("Traffic sources query error:", err.message);
  }

  try {
    // 4. Geography
    const geoRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "country",
      sort: "-views",
      metrics: "views,estimatedMinutesWatched",
      maxResults: 10,
    });

    if (geoRes.data.rows) {
      geoStats = geoRes.data.rows.map((r: any) => ({
        country: String(r[0]),
        views: Number(r[1]) || 0,
        watchTimeHours: parseFloat(((Number(r[2]) || 0) / 60).toFixed(1)),
      }));
    }
  } catch (err: any) {
    console.warn("Geo analytics query error:", err.message);
  }

  return {
    period: `${days} Days`,
    startDate,
    endDate,
    summary,
    dailyStats,
    trafficSources,
    geoStats,
  };
}

export async function fetchLivePulse() {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const youtube = google.youtube({ version: "v3", auth });

  const channelRes = await youtube.channels.list({
    part: ["statistics", "contentDetails"],
    mine: true,
  });

  const channel = channelRes.data.items?.[0];
  if (!channel) throw new Error("Channel not found");

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  let recentLiveBeats: any[] = [];

  if (uploadsPlaylistId) {
    const playlistRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 15,
    });

    const videoIds = playlistRes.data.items
      ?.map((item) => item.contentDetails?.videoId)
      .filter(Boolean) as string[];

    if (videoIds.length > 0) {
      const videosRes = await youtube.videos.list({
        part: ["snippet", "statistics"],
        id: videoIds,
      });

      recentLiveBeats = (videosRes.data.items || []).map((v) => ({
        id: v.id,
        title: v.snippet?.title,
        thumbnail: v.snippet?.thumbnails?.medium?.url,
        views: parseInt(v.statistics?.viewCount || "0", 10),
        likes: parseInt(v.statistics?.likeCount || "0", 10),
        comments: parseInt(v.statistics?.commentCount || "0", 10),
        publishedAt: v.snippet?.publishedAt,
      }));
    }
  }

  return {
    timestamp: new Date().toISOString(),
    liveViews: parseInt(channel.statistics?.viewCount || "0", 10),
    liveSubs: parseInt(channel.statistics?.subscriberCount || "0", 10),
    liveVideos: parseInt(channel.statistics?.videoCount || "0", 10),
    recentLiveBeats,
  };
}
