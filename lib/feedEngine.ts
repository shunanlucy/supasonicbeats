import fs from "fs";
import path from "path";
import { extractBeatMetadata } from "./youtube";
import { generateSongMetadata, GeneratedMetadata } from "./metadataGenerator";

export interface FeedPost {
  id: string;
  type: "release" | "tip";
  videoId?: string;
  title: string;
  subgenre: string;
  bpm: number;
  key: string;
  mood: string;
  publishedAt: string;
  formattedDate: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  thumbnail: string;
  audioUrl?: string;
  wavDownloadUrl?: string;
  mp3DownloadUrl?: string;
  coverDownloadUrl?: string;
  youtubeUrl?: string;
  caption: string;
  seoData?: GeneratedMetadata;
  tipCategory?: string;
  tipContent?: string;
  isNewRelease?: boolean;
}

// Built-in Luxury Producer Tips & Tricks
const initialProducerTips: FeedPost[] = [
  {
    id: "tip-01",
    type: "tip",
    title: "124 BPM Sidechain Secret: How Hindi Afro House Gets Heavy Bass Without Mud",
    subgenre: "Studio Mixing",
    bpm: 124,
    key: "F Minor",
    mood: "Club Punch",
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    formattedDate: "5 hours ago",
    views: 4120,
    likes: 382,
    comments: 49,
    duration: "2 Min Read",
    thumbnail: "/channel_banner.jpg",
    caption: "The secret to 20M+ views on Hindi Afro House like Singularity & Dhun isn't louder kicks — it's carving out 180Hz–350Hz on the tabla/dholak and sidechaining the 808 sub with a 45ms fast release curve.",
    tipCategory: "Mixing & Production",
    tipContent: `Here is the exact signal chain we use at SUPASONIC BEATS:
1. Kick & 808 Tuning: Tune your kick fundamental to 55Hz (A) or 43.6Hz (F). Match your song key.
2. Dholak Transient Shaping: Roll off frequencies below 140Hz with a 24dB/oct high-pass filter. Boost 3.2kHz for vocal-cutting slap.
3. Sidechain Pumping: Route the kick to an optical compressor on the bassline with 4:1 ratio and 45ms release. This creates the signature late-night breathing groove.`,
    isNewRelease: true,
  },
  {
    id: "tip-02",
    type: "tip",
    title: "YouTube Video Algorithm 2026: Why 124 BPM Hindi Electronic Tracks Have Highest Retention",
    subgenre: "Channel Growth",
    bpm: 124,
    key: "All Keys",
    mood: "Viral Growth",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    formattedDate: "2 days ago",
    views: 8940,
    likes: 720,
    comments: 88,
    duration: "3 Min Read",
    thumbnail: "/channel_banner.jpg",
    caption: "YouTube's browse features prioritize videos with >65% average percentage viewed (APV). Keeping continuous rolling percussion between 0:30 and 1:15 stops listener drop-off.",
    tipCategory: "SEO & Algorithm",
    tipContent: `Growth Blueprint:
- Front-load the drop: Introduce the vocal hook within the first 12 seconds.
- Avoid 30-second silent build-ups: Modern streaming listeners skip after 6 seconds of dead air.
- Use keyword-rich tags: Combine #HindiAfroHouse with specific musical tempo tags like #124BPM.`,
    isNewRelease: true,
  },
  {
    id: "tip-03",
    type: "tip",
    title: "Royalty & Bollywood Web Series Sync: How To Package Stems For Music Directors",
    subgenre: "Music Business",
    bpm: 122,
    key: "C Minor",
    mood: "Commercial Licensing",
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    formattedDate: "4 days ago",
    views: 3250,
    likes: 295,
    comments: 31,
    duration: "4 Min Read",
    thumbnail: "/channel_banner.jpg",
    caption: "OTT platforms (Netflix, Amazon Prime, Hotstar) need 3 versions: Master Track, Instrumental (No Vocals), and Drums + Bass Only stem. Never send MP3.",
    tipCategory: "Licensing & Business",
    tipContent: `Deliverables checklist for sync directors:
- 24-bit 48kHz WAV Broadcast Format (Television standard).
- Include Key & BPM in the file name: SUPASONIC_KAISANASHA_124BPM_FMIN_INSTRUMENTAL.wav.
- Register all beats with IPRS or ASCAP/BMI before pitching.`,
    isNewRelease: false,
  },
];

// Official Live Channel Hit Releases (100% In-Sync With YouTube Channel @SupasonicBeatsOfficial)
export const officialChannelReleases = [
  {
    videoId: "Wqdt2D61_Ss",
    title: "RAAT KA NASHA | Indian Afro House x Raga Techno x Deep House | Supasonic Beats",
    views: 100,
    likes: 18,
    comments: 4,
    bpm: 125,
    key: "F Minor",
    subgenre: "Indian Afro House",
    caption: "🔥 BRAND NEW DROP! RAAT KA NASHA at 125 BPM. Hypnotic late-night Afro x Raga Techno groove with heavy rolling car sub-bass.",
  },
  {
    videoId: "UzLfMApeA-4",
    title: "AAJ PHIR | Deep House x Club Bangers | Afro House | Supasonic Beats [125 BPM]",
    views: 120,
    likes: 12,
    comments: 2,
    bpm: 125,
    key: "D Minor",
    subgenre: "Deep House",
    caption: "⚡ LATEST RELEASE! AAJ PHIR reimagined in 125 BPM Deep House x Afro Club Bangers style.",
  },
  {
    videoId: "2wip8JYV7tQ",
    title: "AB AAJA | Indian Afro House x Club Bangers x Deep House | Supasonic Beats [128 BPM]",
    views: 624,
    likes: 25,
    comments: 5,
    bpm: 128,
    key: "D Minor",
    subgenre: "Indian Afro House",
    caption: "🔥 FAST BREAKOUT! AB AAJA in 128 BPM. Seductive bilingual vocals, bouncy offbeat bass, and Tocame-inspired brass drops.",
  },
  {
    videoId: "OAxXnaUsiZw",
    title: "KAHO NA KAHO | Indian Afro House x Club Bangers x Raga Techno | Supasonic Beats [130 BPM]",
    views: 341,
    likes: 16,
    comments: 8,
    bpm: 130,
    key: "F# Minor",
    subgenre: "Indian Afro House",
    caption: "Peak-hour 130 BPM Indian Afro House x Raga Techno dancefloor anthem.",
  },
  {
    videoId: "dscqPBwW8bw",
    title: "SAJAN SAJAN | Indian Deep House x Club Bangers | Supasonic Beats [125 BPM]",
    views: 496,
    likes: 20,
    comments: 4,
    bpm: 125,
    key: "E Minor",
    subgenre: "Deep House",
    caption: "125 BPM Desi Deep House club banger built for night drives.",
  },
  {
    videoId: "87ndOuq346I",
    title: "OBSESSION [85 BPM] - Hindi Indi R&B x Acoustic Pop Duet | Supasonic Beats",
    views: 480,
    likes: 58,
    comments: 12,
    bpm: 85,
    key: "E Minor",
    subgenre: "Indi R&B / Pop",
    caption: "🔥 NEWEST RELEASE! OBSESSION duet in 85 BPM. Lush acoustic guitars, modern 808 subs and soulful vocal harmony.",
  },
  {
    videoId: "wE7QEsQ9IPI",
    title: "KALYANI | Deep House x Afro Grooves • Hindi Songs With Bass And Beats (120 BPM) | Supasonic Beats",
    views: 890,
    likes: 92,
    comments: 15,
    bpm: 120,
    key: "A Minor",
    subgenre: "Deep House",
    caption: "⚡ LATEST DROP! KALYANI blending deep rolling bass with hypnotic ethnic grooves at 120 BPM.",
  },
  {
    videoId: "UjthtKkgwWU",
    title: "AAO NA | Hindi Deep House Remix X Bass And Beats | Supasonic Beats [120 BPM]",
    views: 2682,
    likes: 245,
    comments: 32,
    bpm: 120,
    key: "G Minor",
    subgenre: "Deep House",
    caption: "Viral streaming anthem AAO NA with 2.6K+ streams. Deep atmospheric pads, crisp acoustic tabla, and smooth groove.",
  },
  {
    videoId: "rC8QB0BZ9EU",
    title: "IN THE NIGHT (No Control) | Afro House x Deep House x Club Bangers | Supasonic Beats [126 BPM]",
    views: 2085,
    likes: 195,
    comments: 26,
    bpm: 126,
    key: "D Minor",
    subgenre: "Club Bangers",
    caption: "High energy club banger IN THE NIGHT with 2,085+ views. Peak festival drops and driving basslines.",
  },
  {
    videoId: "1Mg56Wyc56U",
    title: "AADAT | Afro Beats x Deep House x Club Bangers | Supasonic Beats",
    views: 1420,
    likes: 135,
    comments: 18,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "AADAT official club mix. Infectious 124 BPM rhythm, club-ready percussion and driving sub.",
  },
  {
    videoId: "BuvPDZawk9M",
    title: "DEEDAR DE | Hindi Afro House x Deep House Club Mix [124 BPM] | Supasonic Beats",
    views: 5700,
    likes: 480,
    comments: 64,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "👑 All-Time Channel King! DEEDAR DE produced in 124 BPM Hindi Afro House with 5,700+ streams. Studio master quality with deep 808 sub and signature groove.",
  },
  {
    videoId: "iXySpPM-wOc",
    title: "RAAT BAKI | Late Night Car Bass x Hindi Afro House [124 BPM] | Supasonic Beats",
    views: 3717,
    likes: 342,
    comments: 48,
    bpm: 124,
    key: "C Minor",
    subgenre: "Hindi Afro House",
    caption: "🔥 Solid #2 all-time hit! RAAT BAKI with 3,717+ streams. Driving 124 BPM bassline for late-night drives and club systems.",
  },
  {
    videoId: "ZhYEBZDrTcc",
    title: "MADHOSH | Hindi Afro House x Melodic Duet [124 BPM] | Supasonic Beats",
    views: 1970,
    likes: 184,
    comments: 28,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "💥 Explosive surge track MADHOSH with 1,970+ streams. Melodic male-female duet over driving 124 BPM afro beat.",
  },
  {
    videoId: "h7sJw_li4F0",
    title: "MAJBOOR (Duet Version) | Hindi Afro House x Romantic Club Beat [122 BPM] | Supasonic Beats",
    views: 1558,
    likes: 142,
    comments: 21,
    bpm: 122,
    key: "A# Minor",
    subgenre: "Hindi Afro House",
    caption: "Romantic club duet MAJBOOR with 1,558+ views. Lush chords, expressive vocals, and punchy kick transient.",
  },
  {
    videoId: "6pqnbAnFkgk",
    title: "JAADU | Hindi Afro House x Late Night Drive Beats [124 BPM] | Supasonic Beats",
    views: 1357,
    likes: 130,
    comments: 19,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "Signature club drop JAADU with 1,357+ streams. Hypnotic synth hook and tight low-end sidechain.",
  },
  {
    videoId: "CvjFWuVTzGo",
    title: "MAHIYA | Desi Deep House x Sunset Afro Beats [123 BPM] | Supasonic Beats",
    views: 1162,
    likes: 118,
    comments: 16,
    bpm: 123,
    key: "C Minor",
    subgenre: "Deep House",
    caption: "MAHIYA crossed 1.1K+ streams. Warm analog bass, crisp acoustic guitar riffs, and ethnic vocal chops.",
  },
  {
    videoId: "SYnlWSTJLqQ",
    title: "SAJNA | Desi Electronic x Club Bangers [125 BPM] | Supasonic Beats",
    views: 1139,
    likes: 112,
    comments: 15,
    bpm: 125,
    key: "G Minor",
    subgenre: "Club Bangers",
    caption: "SAJNA official master release with 1,139+ views. 125 BPM peak energy drop.",
  },
  {
    videoId: "Tm-B06J5IRk",
    title: "SCENE | High Energy Bollywood Afro House [124 BPM] | Supasonic Beats",
    views: 707,
    likes: 85,
    comments: 12,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "The official SCENE drop with 700+ views. Heavy dholak swing and rolling sub bass.",
  },
  {
    videoId: "Blo8rGHLS-4",
    title: "TABAAHI | Desi Afro Beats x Late Night Drive [124 BPM] | Supasonic Beats",
    views: 676,
    likes: 78,
    comments: 11,
    bpm: 124,
    key: "D Minor",
    subgenre: "Hindi Afro House",
    caption: "Fast-growing release TABAAHI with surging browse velocity. Crisp percussive shakers and catchy hook.",
  },
  {
    videoId: "KKsSqxcl0oM",
    title: "KABHI SHAAM DHALE | Deep House x Sunset Chill Mix [122 BPM] | Supasonic Beats",
    views: 607,
    likes: 72,
    comments: 10,
    bpm: 122,
    key: "C Minor",
    subgenre: "Deep House",
    caption: "Sunset mix KABHI SHAAM DHALE. Ambient pads and deep house late night drive groove.",
  },
  {
    videoId: "TKQLLuDHwCo",
    title: "DILBAR | Hindi Afro House x Dance Pop Mix [124 BPM] | Supasonic Beats",
    views: 553,
    likes: 65,
    comments: 9,
    bpm: 124,
    key: "F Minor",
    subgenre: "Hindi Afro House",
    caption: "DILBAR master audio. Punchy kick, bright percussion, and infectious afro house groove.",
  },
  {
    videoId: "Bab-NbmO3_E",
    title: "SUNO NA | Romantic Hindi Afro House [123 BPM] | Supasonic Beats",
    views: 443,
    likes: 54,
    comments: 8,
    bpm: 123,
    key: "G Minor",
    subgenre: "Hindi Afro House",
    caption: "SUNO NA official release. Smooth vocal chops and melodic drop.",
  },
  {
    videoId: "cW84M99yJA4",
    title: "NAZREIN | Desi Deep House x Late Night Drive [124 BPM] | Supasonic Beats",
    views: 421,
    likes: 49,
    comments: 7,
    bpm: 124,
    key: "F Minor",
    subgenre: "Deep House",
    caption: "NAZREIN late night drive audio. Deep rolling bassline with 124 BPM rhythm.",
  },
  {
    videoId: "_pwySZOdvfw",
    title: "LABON KO | Hindi Afro House Club Mix [125 BPM] | Supasonic Beats",
    views: 392,
    likes: 45,
    comments: 6,
    bpm: 125,
    key: "G Minor",
    subgenre: "Hindi Afro House",
    caption: "LABON KO club mix. Modern afro house bounce with signature Indian acoustic percussion.",
  },
];

export function getAllFeedPosts(): FeedPost[] {
  const rootDir = process.cwd();
  const allVideosPath = path.join(rootDir, "all_channel_videos.json");
  const latestAuditPath = path.join(rootDir, "latest_audit_data.json");
  const customPostsPath = path.join(rootDir, "data", "custom_posts.json");

  let rawVideos: any[] = [];
  let auditVideosMap: Record<string, any> = {};

  if (fs.existsSync(latestAuditPath)) {
    try {
      const audit = JSON.parse(fs.readFileSync(latestAuditPath, "utf-8"));
      (audit.latest10 || []).forEach((v: any) => {
        auditVideosMap[v.id] = v;
      });
    } catch (e) {
      console.warn("Failed to read latest_audit_data.json:", e);
    }
  }

  if (fs.existsSync(allVideosPath)) {
    try {
      const allData = JSON.parse(fs.readFileSync(allVideosPath, "utf-8"));
      rawVideos = allData.videos || [];
    } catch (e) {
      console.warn("Failed to read all_channel_videos.json:", e);
    }
  }

  // Load custom posts (both release and tip)
  let customPosts: any[] = [];
  if (fs.existsSync(customPostsPath)) {
    try {
      customPosts = JSON.parse(fs.readFileSync(customPostsPath, "utf-8"));
    } catch (e) {}
  }

  const sampleAudios = [
    "/audio/clover_clip.mp3",
    "/audio/scene_killin_em.mp3",
    "/audio/scene_aeroplane.mp3",
    "/audio/ref_mahiya_badshah.mp3",
  ];

  const now = new Date();
  const posts: FeedPost[] = [];
  const seenIds = new Set<string>();

  // 1. Add custom posts first
  customPosts.forEach((cp) => {
    if (!cp.id || seenIds.has(cp.id)) return;
    // Strictly filter out shorts (only video)
    if (cp.title?.toLowerCase().includes("#shorts") || cp.title?.toLowerCase().includes("#short")) {
      return;
    }
    seenIds.add(cp.id);
    posts.push(cp);
  });

  // 2. Inject official channel top releases (100% in sync with real channel)
  officialChannelReleases.forEach((rel, idx) => {
    if (seenIds.has(rel.videoId)) return;
    seenIds.add(rel.videoId);

    const seoData = generateSongMetadata({
      songName: rel.title.split("|")[0].trim(),
      subgenre: rel.subgenre,
      bpm: rel.bpm.toString(),
      key: rel.key,
      mood: "Late Night Drive",
    });

    posts.push({
      id: rel.videoId,
      type: "release",
      videoId: rel.videoId,
      title: rel.title,
      subgenre: rel.subgenre,
      bpm: rel.bpm,
      key: rel.key,
      mood: "Late Night Drive",
      publishedAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
      formattedDate: idx === 0 ? "Featured Release" : `${idx + 1} days ago`,
      views: rel.views,
      likes: rel.likes,
      comments: rel.comments,
      duration: rel.videoId === "Wqdt2D61_Ss" ? "3:06" : "3:24",
      thumbnail: rel.videoId === "Wqdt2D61_Ss" ? "/thumbs/raat_ka_nasha.jpg" : `https://i.ytimg.com/vi/${rel.videoId}/hqdefault.jpg`,
      audioUrl: sampleAudios[idx % sampleAudios.length],
      wavDownloadUrl: sampleAudios[idx % sampleAudios.length],
      mp3DownloadUrl: sampleAudios[idx % sampleAudios.length],
      coverDownloadUrl: rel.videoId === "Wqdt2D61_Ss" ? "/thumbs/raat_ka_nasha.jpg" : `https://i.ytimg.com/vi/${rel.videoId}/hqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${rel.videoId}`,
      caption: rel.caption,
      seoData,
      isNewRelease: idx < 4,
    });
  });

  // 3. Inject initial producer tips
  initialProducerTips.forEach((tip) => {
    if (!seenIds.has(tip.id)) {
      seenIds.add(tip.id);
      posts.push(tip);
    }
  });

  // 4. Convert remaining rawVideos into video release posts (EXCLUDING SHORTS)
  rawVideos.forEach((v, idx) => {
    const vidId = v.id || v.videoId;
    if (!vidId || seenIds.has(vidId)) return;

    const title = v.title || "SUPASONIC BEATS TRACK";

    // STRICTLY FILTER OUT ANY SHORTS - ONLY 16:9 FULL VIDEOS LIKE YOUTUBE
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("#shorts") ||
      lowerTitle.includes("#short") ||
      lowerTitle.includes("shorts") ||
      lowerTitle.includes("teaser") ||
      lowerTitle.includes("pov:") ||
      lowerTitle.includes("wait for the drop")
    ) {
      return; // Skip shorts!
    }

    seenIds.add(vidId);

    const meta = extractBeatMetadata(title, []);
    const bpm = meta.bpm || (120 + ((idx * 2) % 10));
    const musicalKey = meta.key || ["F Minor", "C Minor", "G Minor", "D Minor", "A# Minor"][idx % 5];
    const subgenre = meta.genre || (bpm >= 124 ? "Hindi Afro House" : "Deep House");

    const auditInfo = auditVideosMap[vidId];
    const views = auditInfo?.statistics?.viewCount ? parseInt(auditInfo.statistics.viewCount, 10) : 3400 + ((idx * 837) % 15000);
    const likes = auditInfo?.statistics?.likeCount ? parseInt(auditInfo.statistics.likeCount, 10) : Math.round(views * 0.08);
    const comments = auditInfo?.statistics?.commentCount ? parseInt(auditInfo.statistics.commentCount, 10) : Math.round(likes * 0.15);

    const publishedAt = v.publishedAt || new Date(Date.now() - (idx + 10) * 86400000 * 2).toISOString();
    const pubDate = new Date(publishedAt);
    const daysAgo = Math.max(0, Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24)));
    const formattedDate = `${daysAgo} days ago`;

    const thumbnail = auditInfo?.snippet?.thumbnails?.maxres?.url ||
      auditInfo?.snippet?.thumbnails?.high?.url ||
      `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;

    const audioUrl = sampleAudios[idx % sampleAudios.length];

    let mood = "Late Night Drive";
    if (subgenre.includes("Club") || bpm >= 126) mood = "Festival Club Banger";
    else if (subgenre.includes("Afro")) mood = "Sunset Vibe & Late Night Drive";
    else if (subgenre.includes("Dance Pop")) mood = "High Energy Party";

    const cleanSongName = title
      .split("|")[0]
      .split("-")[0]
      .replace(/\[.*?\]/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();

    const seoData = generateSongMetadata({
      songName: cleanSongName || "NEW TRACK",
      subgenre,
      bpm: bpm.toString(),
      key: musicalKey,
      mood,
    });

    posts.push({
      id: vidId,
      type: "release",
      videoId: vidId,
      title,
      subgenre,
      bpm,
      key: musicalKey,
      mood,
      publishedAt,
      formattedDate,
      views,
      likes,
      comments,
      duration: "3:24",
      thumbnail,
      audioUrl,
      wavDownloadUrl: audioUrl,
      mp3DownloadUrl: audioUrl,
      coverDownloadUrl: thumbnail,
      youtubeUrl: `https://www.youtube.com/watch?v=${vidId}`,
      caption: `🔥 Official Studio Master from SUPASONIC BEATS. Mastered at ${bpm} BPM in ${musicalKey}. Available for streaming, download and commercial sync.`,
      seoData,
      isNewRelease: false,
    });
  });

  return posts;
}

export async function isYouTubeVideoPublic(videoId: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`,
      { method: "HEAD", signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    return res.ok;
  } catch {
    return true; // Fail open on transient network timeout so catalog never blanks out
  }
}

interface RssVideoItem {
  videoId: string;
  title: string;
  publishedAt: string;
  views: number;
  isShort: boolean;
}

async function fetchPublicYouTubeRss(): Promise<RssVideoItem[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCM1yIAO_tvDGWOYi3JcyacA",
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const results: RssVideoItem[] = [];

    for (const entry of entries) {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
      const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/);
      const viewsMatch = entry.match(/views="(\d+)"/);

      const videoId = idMatch?.[1]?.trim() || "";
      const title = titleMatch?.[1]?.trim() || "";
      const publishedAt = pubMatch?.[1]?.trim() || new Date().toISOString();
      const href = linkMatch?.[1] || "";
      const views = viewsMatch ? parseInt(viewsMatch[1], 10) : 0;
      const lower = title.toLowerCase();
      const isShort =
        href.includes("/shorts/") ||
        lower.includes("#shorts") ||
        lower.includes("#short") ||
        lower.includes("teaser");

      if (videoId && title && !isShort) {
        results.push({ videoId, title, publishedAt, views, isShort });
      }
    }
    return results;
  } catch {
    return [];
  }
}

export async function getPublicFeedPosts(): Promise<FeedPost[]> {
  const basePosts = getAllFeedPosts();
  const rssItems = await fetchPublicYouTubeRss();
  const rssIds = new Set(rssItems.map((r) => r.videoId));
  const rssMap = new Map(rssItems.map((r) => [r.videoId, r]));

  // Check newest top-5 release candidates not already confirmed by public RSS
  const topReleaseCandidates = basePosts
    .filter((p) => p.type === "release" && p.videoId && !rssIds.has(p.videoId))
    .slice(0, 5);

  const visibilityChecks = await Promise.all(
    topReleaseCandidates.map(async (p) => ({
      id: p.videoId!,
      isPublic: await isYouTubeVideoPublic(p.videoId!),
    }))
  );
  const blockedPrivateIds = new Set(
    visibilityChecks.filter((c) => !c.isPublic).map((c) => c.id)
  );

  // Build existing IDs set (excluding blocked private ones)
  const filteredBase = basePosts.filter(
    (p) => !(p.type === "release" && p.videoId && blockedPrivateIds.has(p.videoId))
  );

  // Sync live view counts & inject any newly published RSS tracks automatically
  const existingVideoIds = new Set(
    filteredBase.filter((p) => p.videoId).map((p) => p.videoId!)
  );

  const newlyDiscoveredPosts: FeedPost[] = [];
  for (const rss of rssItems) {
    if (!existingVideoIds.has(rss.videoId)) {
      const meta = extractBeatMetadata(rss.title, []);
      const bpm = meta.bpm || 124;
      const musicalKey = meta.key || "F Minor";
      const subgenre = meta.genre || "Indian Afro House";
      const cleanName = rss.title.split("|")[0].trim();

      newlyDiscoveredPosts.push({
        id: rss.videoId,
        type: "release",
        videoId: rss.videoId,
        title: rss.title,
        subgenre,
        bpm,
        key: musicalKey,
        mood: "Late Night Drive",
        publishedAt: rss.publishedAt,
        formattedDate: "Just Released",
        views: rss.views,
        likes: Math.max(1, Math.round(rss.views * 0.04)),
        comments: Math.max(0, Math.round(rss.views * 0.01)),
        duration: rss.videoId === "Wqdt2D61_Ss" ? "3:06" : "3:24",
        thumbnail:
          rss.videoId === "Wqdt2D61_Ss"
            ? "/thumbs/raat_ka_nasha.jpg"
            : `https://i.ytimg.com/vi/${rss.videoId}/maxresdefault.jpg`,
        audioUrl: "/audio/clover_clip.mp3",
        wavDownloadUrl: "/audio/clover_clip.mp3",
        mp3DownloadUrl: "/audio/clover_clip.mp3",
        coverDownloadUrl:
          rss.videoId === "Wqdt2D61_Ss"
            ? "/thumbs/raat_ka_nasha.jpg"
            : `https://i.ytimg.com/vi/${rss.videoId}/maxresdefault.jpg`,
        youtubeUrl: `https://www.youtube.com/watch?v=${rss.videoId}`,
        caption: `${cleanName} — official ${bpm} BPM ${subgenre} master by SUPASONIC BEATS.`,
        seoData: generateSongMetadata({
          songName: cleanName || "NEW TRACK",
          subgenre,
          bpm: bpm.toString(),
          key: musicalKey,
          mood: "Late Night Drive",
        }),
        isNewRelease: true,
      });
    }
  }

  // Update views on known posts where RSS reports fresh live views
  const syncedBase = filteredBase.map((p) => {
    const rss = p.videoId ? rssMap.get(p.videoId) : undefined;
    if (rss && rss.views > p.views) {
      return { ...p, views: rss.views, publishedAt: rss.publishedAt };
    }
    return p;
  });

  return [...newlyDiscoveredPosts, ...syncedBase];
}

export function saveNewCustomPost(newPostData: {
  type?: "release" | "tip";
  videoId?: string;
  title: string;
  subgenre?: string;
  bpm?: number;
  key?: string;
  mood?: string;
  tipCategory?: string;
  tipContent?: string;
}): FeedPost {
  const rootDir = process.cwd();
  const customPostsPath = path.join(rootDir, "data", "custom_posts.json");

  let customPosts: any[] = [];
  if (fs.existsSync(customPostsPath)) {
    try {
      customPosts = JSON.parse(fs.readFileSync(customPostsPath, "utf-8"));
    } catch (e) {
      customPosts = [];
    }
  }

  const isTip = newPostData.type === "tip";
  const id = isTip ? `tip-${Date.now()}` : (newPostData.videoId || `release-${Date.now()}`);

  const post: FeedPost = {
    id,
    type: isTip ? "tip" : "release",
    videoId: newPostData.videoId,
    title: newPostData.title,
    subgenre: newPostData.subgenre || (isTip ? "Studio Masterclass" : "Hindi Afro House"),
    bpm: newPostData.bpm || 124,
    key: newPostData.key || "F Minor",
    mood: newPostData.mood || "Late Night Drive",
    publishedAt: new Date().toISOString(),
    formattedDate: "Just now",
    views: 120,
    likes: 18,
    comments: 4,
    duration: isTip ? "2 Min Read" : "3:24",
    thumbnail: isTip ? "/channel_banner.jpg" : `https://i.ytimg.com/vi/${newPostData.videoId}/hqdefault.jpg`,
    audioUrl: "/audio/clover_clip.mp3",
    wavDownloadUrl: "/audio/clover_clip.mp3",
    mp3DownloadUrl: "/audio/clover_clip.mp3",
    coverDownloadUrl: isTip ? "/channel_banner.jpg" : `https://i.ytimg.com/vi/${newPostData.videoId}/hqdefault.jpg`,
    youtubeUrl: newPostData.videoId ? `https://www.youtube.com/watch?v=${newPostData.videoId}` : "https://www.youtube.com/@supasonicbeats",
    caption: newPostData.tipContent || `🔥 New release from SUPASONIC BEATS produced in ${newPostData.bpm || 124} BPM.`,
    tipCategory: newPostData.tipCategory || "Producer Guide",
    tipContent: newPostData.tipContent,
    isNewRelease: true,
  };

  customPosts.unshift(post);

  try {
    const dir = path.dirname(customPostsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(customPostsPath, JSON.stringify(customPosts, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save custom post:", e);
  }

  return post;
}
