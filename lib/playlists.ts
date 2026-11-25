import { FeedPost, getPublicFeedPosts } from "./feedEngine";
import { extractBeatMetadata } from "./youtube";
import { generateSongMetadata } from "./metadataGenerator";

export interface ChannelPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  videoCount: number;
  videoIds: string[];
  tracks: FeedPost[];
  source: "youtube" | "smart";
}

const CHANNEL_ID = "UCM1yIAO_tvDGWOYi3JcyacA";

interface PlaylistRawItem {
  videoId: string;
  title: string;
  publishedAt?: string;
  views?: number;
  duration?: string;
  thumbnail?: string;
}

// In-memory cache to keep /api/playlists fast while syncing automatically every 10 minutes
let cachedChannelPlaylists: {
  expiresAt: number;
  rawPlaylists: Array<{
    id: string;
    title: string;
    thumbnail: string;
    videoCount: number;
    items: PlaylistRawItem[];
  }>;
} | null = null;

function cleanPlaylistTitle(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parsePlaylistCount(overlays: unknown): number {
  try {
    const str = JSON.stringify(overlays || "");
    const m = str.match(/(\d+)\s+videos?/i);
    return m ? parseInt(m[1], 10) : 0;
  } catch {
    return 0;
  }
}

async function fetchPlaylistRssItems(playlistId: string): Promise<PlaylistRawItem[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`,
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const items: PlaylistRawItem[] = [];

    for (const entry of entries) {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
      const viewsMatch = entry.match(/views="(\d+)"/);
      const hrefMatch = entry.match(/<link[^>]+href="([^"]+)"/);

      const videoId = idMatch?.[1]?.trim() || "";
      const title = decodeXmlEntities(titleMatch?.[1]?.trim() || "");
      const href = hrefMatch?.[1] || "";
      const lower = title.toLowerCase();
      const isShort =
        href.includes("/shorts/") ||
        lower.includes("#shorts") ||
        lower.includes("#short") ||
        lower.includes("teaser");

      if (videoId && title && !isShort) {
        items.push({
          videoId,
          title,
          publishedAt: pubMatch?.[1]?.trim() || new Date().toISOString(),
          views: viewsMatch ? parseInt(viewsMatch[1], 10) : 0,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}

async function fetchPlaylistHtmlVideoIds(playlistId: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const html = await res.text();
    let matches = Array.from(
      html.matchAll(/"playlistVideoRenderer":\{"videoId":"([A-Za-z0-9_-]{11})"/g)
    ).map((m) => m[1]);
    if (matches.length === 0) {
      matches = Array.from(
        html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)
      ).map((m) => m[1]);
    }
    return Array.from(new Set(matches));
  } catch {
    return [];
  }
}

async function fetchPublicOEmbedMeta(
  videoId: string
): Promise<{ isPublic: boolean; title?: string; thumbnail?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`,
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    if (!res.ok) return { isPublic: false };
    const data = await res.json();
    return {
      isPublic: true,
      title: typeof data.title === "string" ? data.title : undefined,
      thumbnail: typeof data.thumbnail_url === "string" ? data.thumbnail_url : undefined,
    };
  } catch {
    return { isPublic: false };
  }
}

async function fetchRawChannelPlaylists(): Promise<
  Array<{
    id: string;
    title: string;
    thumbnail: string;
    videoCount: number;
    items: PlaylistRawItem[];
  }>
> {
  if (cachedChannelPlaylists && cachedChannelPlaylists.expiresAt > Date.now()) {
    return cachedChannelPlaylists.rawPlaylists;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://www.youtube.com/channel/${CHANNEL_ID}/playlists`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const html = await res.text();

    const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const extracted: Array<{
      id: string;
      title: string;
      thumbnail: string;
      videoCount: number;
    }> = [];
    const seenIds = new Set<string>();

    const walk = (node: unknown) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        for (const item of node) walk(item);
        return;
      }
      const obj = node as Record<string, any>;
      if (obj.lockupViewModel?.contentId) {
        const vm = obj.lockupViewModel;
        const id: string = vm.contentId;
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          const rawTitle =
            vm.metadata?.lockupMetadataViewModel?.title?.content || "Supasonic Mix";
          const sources =
            vm.contentImage?.collectionThumbnailViewModel?.primaryThumbnail
              ?.thumbnailViewModel?.image?.sources || [];
          const rawImg: string =
            sources[sources.length - 1]?.url ||
            "https://i.ytimg.com/vi/UzLfMApeA-4/hqdefault.jpg";
          const cleanImg = rawImg.split("?")[0];
          const overlays =
            vm.contentImage?.collectionThumbnailViewModel?.primaryThumbnail
              ?.thumbnailViewModel?.overlays;
          extracted.push({
            id,
            title: cleanPlaylistTitle(rawTitle),
            thumbnail: cleanImg,
            videoCount: parsePlaylistCount(overlays),
          });
        }
      }
      for (const val of Object.values(obj)) walk(val);
    };

    walk(data);

    // Pull official RSS + HTML tracks for every playlist in parallel
    const withItems = await Promise.all(
      extracted.map(async (pl) => {
        const [rssItems, htmlIds] = await Promise.all([
          fetchPlaylistRssItems(pl.id),
          fetchPlaylistHtmlVideoIds(pl.id),
        ]);

        const mergedMap = new Map<string, PlaylistRawItem>();
        for (const item of rssItems) mergedMap.set(item.videoId, item);
        for (const vid of htmlIds) {
          if (!mergedMap.has(vid)) {
            mergedMap.set(vid, {
              videoId: vid,
              title: "",
              thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
            });
          }
        }

        return {
          ...pl,
          items: Array.from(mergedMap.values()),
        };
      })
    );

    if (withItems.length > 0) {
      cachedChannelPlaylists = {
        expiresAt: Date.now() + 10 * 60 * 1000,
        rawPlaylists: withItems,
      };
    }

    return withItems;
  } catch (err) {
    console.error("Failed to fetch YouTube channel playlists:", err);
    return [];
  }
}

function synthesizeTrackFromPlaylistItem(
  item: PlaylistRawItem,
  playlistTitle: string
): FeedPost {
  const safeTitle = item.title || `${playlistTitle.split("|")[0].trim()} — Supasonic Beats`;
  const meta = extractBeatMetadata(safeTitle, []);
  const bpm = meta.bpm || 124;
  const key = meta.key || "F Minor";
  const subgenre = meta.genre || "Hindi Afro House";
  const cleanName = safeTitle.split("|")[0].trim();

  return {
    id: item.videoId,
    type: "release",
    videoId: item.videoId,
    title: safeTitle,
    subgenre,
    bpm,
    key,
    mood: "Late Night Drive",
    publishedAt: item.publishedAt || new Date().toISOString(),
    formattedDate: "Playlist Track",
    views: item.views || 450,
    likes: Math.max(15, Math.round((item.views || 450) * 0.05)),
    comments: Math.max(2, Math.round((item.views || 450) * 0.01)),
    duration: item.duration || "3:24",
    thumbnail:
      item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
    audioUrl: "/audio/clover_clip.mp3",
    wavDownloadUrl: "/audio/clover_clip.mp3",
    mp3DownloadUrl: "/audio/clover_clip.mp3",
    coverDownloadUrl:
      item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
    youtubeUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
    caption: `${cleanName} — featured in ${playlistTitle} by SUPASONIC BEATS.`,
    seoData: generateSongMetadata({
      songName: cleanName || "SUPASONIC TRACK",
      subgenre,
      bpm: bpm.toString(),
      key,
      mood: "Late Night Drive",
    }),
  };
}

export async function getChannelPlaylists(): Promise<{
  playlists: ChannelPlaylist[];
  allTracks: FeedPost[];
}> {
  const allPublicPosts = await getPublicFeedPosts();
  const baseTracks = allPublicPosts.filter((p) => p.type === "release" && p.videoId);
  const trackMap = new Map<string, FeedPost>(
    baseTracks.map((t) => [t.videoId!, t])
  );

  const rawPlaylists = await fetchRawChannelPlaylists();

  // Verify & resolve metadata via official YouTube oEmbed for any HTML-only track IDs
  const unverifiedIds = Array.from(
    new Set(
      rawPlaylists
        .flatMap((pl) => pl.items)
        .filter((item) => !trackMap.has(item.videoId) && !item.publishedAt)
        .map((item) => item.videoId)
    )
  ).slice(0, 25);

  const oembedResults = await Promise.all(
    unverifiedIds.map(async (vid) => ({
      vid,
      meta: await fetchPublicOEmbedMeta(vid),
    }))
  );
  const blockedPrivateIds = new Set(
    oembedResults.filter((r) => !r.meta.isPublic).map((r) => r.vid)
  );
  const oembedMetaMap = new Map(
    oembedResults.filter((r) => r.meta.isPublic).map((r) => [r.vid, r.meta])
  );

  const playlists: ChannelPlaylist[] = rawPlaylists.map((raw) => {
    const resolvedTracks: FeedPost[] = [];

    for (const item of raw.items) {
      if (blockedPrivateIds.has(item.videoId)) continue;

      const existing = trackMap.get(item.videoId);
      if (existing) {
        resolvedTracks.push(existing);
      } else {
        const oembedMeta = oembedMetaMap.get(item.videoId);
        const resolvedTitle = item.title || oembedMeta?.title;
        if (resolvedTitle || item.publishedAt) {
          const synthesized = synthesizeTrackFromPlaylistItem(
            {
              ...item,
              title: resolvedTitle || item.title,
              thumbnail: oembedMeta?.thumbnail || item.thumbnail,
            },
            raw.title
          );
          trackMap.set(item.videoId, synthesized);
          resolvedTracks.push(synthesized);
        }
      }
    }

    const fallbackMatches =
      resolvedTracks.length > 0
        ? resolvedTracks
        : baseTracks
            .filter((t) => {
              const titleLower = raw.title.toLowerCase();
              const subLower = (t.subgenre || "").toLowerCase();
              if (titleLower.includes("afro") && subLower.includes("afro")) return true;
              if (titleLower.includes("phonk") && subLower.includes("phonk")) return true;
              if (titleLower.includes("anime") && subLower.includes("anime")) return true;
              if (
                titleLower.includes("indie") &&
                (subLower.includes("indie") || subLower.includes("chill"))
              )
                return true;
              if (
                titleLower.includes("drive") &&
                (t.mood || "").toLowerCase().includes("drive")
              )
                return true;
              return false;
            })
            .slice(0, 12);

    const finalTracks = resolvedTracks.length > 0 ? resolvedTracks : fallbackMatches;

    return {
      id: raw.id,
      title: raw.title,
      description: `Official Supasonic Beats YouTube Playlist • ${finalTracks.length} public tracks`,
      thumbnail: finalTracks[0]?.thumbnail || raw.thumbnail,
      youtubeUrl: `https://www.youtube.com/playlist?list=${raw.id}`,
      videoCount: finalTracks.length || raw.videoCount,
      videoIds: finalTracks.map((t) => t.videoId!),
      tracks: finalTracks,
      source: "youtube",
    };
  });

  if (playlists.length === 0 && baseTracks.length > 0) {
    playlists.push(
      {
        id: "smart-afro-drive",
        title: "Late Night Highway Car Drive | Hindi Afro House",
        description: "Continuous 122–126 BPM 52Hz car sub-bass essentials",
        thumbnail: baseTracks[0].thumbnail,
        youtubeUrl: "https://www.youtube.com/@SupasonicBeatsOfficial/playlists",
        videoCount: Math.min(baseTracks.length, 15),
        videoIds: baseTracks.slice(0, 15).map((t) => t.videoId!),
        tracks: baseTracks.slice(0, 15),
        source: "smart",
      },
      {
        id: "smart-phonk-bass",
        title: "Drift & Gym Sub-Bass Masters",
        description: "High-energy heavy sub-bass club and workout mixes",
        thumbnail: baseTracks[1]?.thumbnail || baseTracks[0].thumbnail,
        youtubeUrl: "https://www.youtube.com/@SupasonicBeatsOfficial/playlists",
        videoCount: Math.min(baseTracks.length, 12),
        videoIds: baseTracks.slice(0, 12).map((t) => t.videoId!),
        tracks: baseTracks.slice(0, 12),
        source: "smart",
      }
    );
  }

  return {
    playlists,
    allTracks: Array.from(trackMap.values()),
  };
}
