"use client";

import React, { useState } from "react";
import {
  Trophy,
  Shield,
  Zap,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ChevronRight,
  PlayCircle,
  Star,
  Target,
  Users,
  BarChart3,
  Disc,
  Crown,
  Compass,
  Award,
  TrendingUp,
  Radio,
  Clock,
  Layers,
  Search,
  Check,
  X,
  Play,
  DollarSign,
  Music,
  Gift,
} from "lucide-react";
import AlgorithmBatchLadder from "@/components/AlgorithmBatchLadder";

interface VideoItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  duration?: string;
}

interface ChannelLevelSystemProps {
  channelStats?: {
    viewCount?: string | number;
    subscriberCount?: string | number;
    videoCount?: string | number;
  };
  catalogVideos?: VideoItem[];
  onNavigateTab?: (tab: string) => void;
}

// ============================================================================
// CHANNEL LEVELS DEFINITIONS (RPG LADDER)
// ============================================================================
export interface LevelDefinition {
  level: number;
  rankTitle: string;
  badge: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  accentColor: string;
  viewRange: string;
  minViews: number;
  maxViews: number;
  description: string;
  status: "cleared" | "current" | "locked";
  quests: {
    id: string;
    title: string;
    targetValue: number;
    unit: string;
    currentValue: number;
    achieved: boolean;
    description: string;
  }[];
  unlockedPerks: {
    title: string;
    desc: string;
    icon: string;
  }[];
  tacticalGameplan: string;
}

export default function ChannelLevelSystem({
  channelStats,
  catalogVideos = [],
  onNavigateTab,
}: ChannelLevelSystemProps) {
  // Parse dynamic channel stats
  const totalViews = typeof channelStats?.viewCount === "number"
    ? channelStats.viewCount
    : parseInt(String(channelStats?.viewCount || "27471"), 10);

  const subscriberCount = typeof channelStats?.subscriberCount === "number"
    ? channelStats.subscriberCount
    : parseInt(String(channelStats?.subscriberCount || "66"), 10);

  const totalVideosCount = typeof channelStats?.videoCount === "number"
    ? channelStats.videoCount
    : parseInt(String(channelStats?.videoCount || "67"), 10);

  // View Mode: 'batches' (Algorithm Impression Batches) vs 'levels' (Channel RPG Roadmap)
  const [activeViewMode, setActiveViewMode] = useState<"batches" | "levels">("batches");

  // In-app Video Preview modal state
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  // Monetization Calculator state
  const [calcDailyViews, setCalcDailyViews] = useState<number>(5000);

  // Fallback catalog list if empty
  const defaultVideos: VideoItem[] = [
    { id: "BuvPDZawk9M", title: "DEEDAR DE | Deep House x Club Bangers [124 BPM]", views: 4618, likes: 28 },
    { id: "UjthtKkgwWU", title: "AAO NA | Hindi Deep House Remix [120 BPM]", views: 2501, likes: 10 },
    { id: "rC8QB0BZ9EU", title: "IN THE NIGHT (No Control) | Afro House x Deep House [126 BPM]", views: 1658, likes: 8 },
    { id: "Kalyani1207", title: "KALYANI | Deep House x Afro Groove [122 BPM]", views: 1207, likes: 15 },
    { id: "lQl3dRGivOI", title: "BHAR LE TU | Romantic Deep House [124 BPM]", views: 990, likes: 14 },
    { id: "o68amPUakwU", title: "DIL LAGA LIYA | Deep House Mix [124 BPM]", views: 800, likes: 19 },
    { id: "pgJIMI4Ihzw", title: "ZARA ZARA | Deep House x Hindi Chill [122 BPM]", views: 606, likes: 16 },
    { id: "ChuraLiya443", title: "CHURA LIYA | Deep House x Club Vibe [124 BPM]", views: 443, likes: 7 },
    { id: "h7sJw_li4F0", title: "MAJBOOR (Duet Version) | Chill Late Night [118 BPM]", views: 395, likes: 12 },
    { id: "RaatMeri141", title: "RAAT MERI | Hindi Afro House Vibe [122 BPM]", views: 141, likes: 5 },
    { id: "Mix18Min118", title: "18 Minutes of Non-Stop Hindi Afro House Mix", views: 118, likes: 9 },
    { id: "AaoNa66", title: "AAO NA (Short VIP Edit)", views: 66, likes: 3 },
    { id: "Obsession49", title: "OBSESSION - Hindi Indi R&B x Acoustic Pop [85 BPM]", views: 49, likes: 2 },
    { id: "u9kx5lpIoZs", title: "TU MIL JAAYE | Deep House x Club [124 BPM]", views: 4, likes: 1 },
  ];

  const videos = catalogVideos.length > 0 ? catalogVideos : defaultVideos;

  // Track tier counts
  const bossVideos = videos.filter((v) => v.views >= 1000);
  const eliteVideos = videos.filter((v) => v.views >= 500 && v.views < 1000);
  const fighterVideos = videos.filter((v) => v.views >= 100 && v.views < 500);
  const rookieVideos = videos.filter((v) => v.views < 100);

  // Channel Level Roadmap Definition
  const levelsData: LevelDefinition[] = [
    {
      level: 1,
      rankTitle: "Bedroom Beatmaker",
      badge: "🥉 LEVEL 1",
      color: "from-amber-600/30 to-amber-900/10",
      borderColor: "border-amber-500/40",
      bgGradient: "bg-[#181412]",
      accentColor: "text-amber-400",
      viewRange: "0 - 10,000 Views",
      minViews: 0,
      maxViews: 10000,
      description: "Channel launch, initial track uploads, and baseline YouTube metadata indexing.",
      status: "cleared",
      quests: [
        {
          id: "l1_q1",
          title: "Channel Views Milestone",
          targetValue: 10000,
          unit: "Views",
          currentValue: totalViews,
          achieved: totalViews >= 10000,
          description: "Accumulate 10,000 total lifetime views across all uploaded tracks.",
        },
        {
          id: "l1_q2",
          title: "First Subscriber Base",
          targetValue: 25,
          unit: "Subscribers",
          currentValue: subscriberCount,
          achieved: subscriberCount >= 25,
          description: "Establish initial loyal listener fanbase.",
        },
        {
          id: "l1_q3",
          title: "Catalog Seeding",
          targetValue: 20,
          unit: "Uploaded Tracks",
          currentValue: totalVideosCount,
          achieved: totalVideosCount >= 20,
          description: "Seed YouTube algorithm with diverse beat styles and soundscapes.",
        },
        {
          id: "l1_q4",
          title: "Breakout Performer",
          targetValue: 1,
          unit: "Track >500 Views",
          currentValue: bossVideos.length + eliteVideos.length,
          achieved: (bossVideos.length + eliteVideos.length) >= 1,
          description: "First proven track showing organic audience retention.",
        },
      ],
      unlockedPerks: [
        {
          title: "YouTube Search & Handle Indexing",
          desc: "Full ranking for '@SupasonicBeatsOfficial' across YouTube search.",
          icon: "Search",
        },
        {
          title: "Custom HD Thumbnail Uploads",
          desc: "Ability to upload high-contrast visual album art.",
          icon: "Sparkles",
        },
        {
          title: "Basic Suggested Videos Placement",
          desc: "Algorithm tests track recommendations in India & South Asia.",
          icon: "Radio",
        },
      ],
      tacticalGameplan: "Level 1 is completed! The baseline catalog foundation is firmly established.",
    },
    {
      level: 2,
      rankTitle: "Rising Underground Studio",
      badge: "🥈 LEVEL 2",
      color: "from-cyan-600/30 to-blue-900/10",
      borderColor: "border-cyan-500/50",
      bgGradient: "bg-[#0f172a]/70",
      accentColor: "text-cyan-400",
      viewRange: "10,000 - 30,000 Views",
      minViews: 10000,
      maxViews: 30000,
      description: "Underground dance authority, algorithmic genre clustering, and late-night peak surges.",
      status: "current",
      quests: [
        {
          id: "l2_q1",
          title: "Total Channel Views",
          targetValue: 30000,
          unit: "Views",
          currentValue: totalViews,
          achieved: totalViews >= 30000,
          description: `Reach 30,000 lifetime views. (Only ${(30000 - totalViews).toLocaleString()} views left!)`,
        },
        {
          id: "l2_q2",
          title: "Core Fan Community",
          targetValue: 100,
          unit: "Subscribers",
          currentValue: subscriberCount,
          achieved: subscriberCount >= 100,
          description: `Reach 100 loyal subscribers. (Only ${Math.max(0, 100 - subscriberCount)} subscribers left!)`,
        },
        {
          id: "l2_q3",
          title: "Catalog Boss Tracks (>1,000 Views)",
          targetValue: 3,
          unit: "Boss Tracks",
          currentValue: bossVideos.length,
          achieved: bossVideos.length >= 3,
          description: `Hold at least 3 tracks with over 1,000 views. (Currently ${bossVideos.length} tracks: Deedar De, Aao Na, In The Night, Kalyani!)`,
        },
        {
          id: "l2_q4",
          title: "Catalog Depth",
          targetValue: 50,
          unit: "Uploaded Tracks",
          currentValue: totalVideosCount,
          achieved: totalVideosCount >= 50,
          description: "Establish a 50+ track library for autoplay marathon sessions.",
        },
        {
          id: "l2_q5",
          title: "Peak Hourly Velocity",
          targetValue: 40,
          unit: "Views/Hour Rate",
          currentValue: 48,
          achieved: true,
          description: "Demonstrate organic surge of 40+ views/hr during peak IST evening hours (8:30 PM - 1:30 AM).",
        },
      ],
      unlockedPerks: [
        {
          title: "124 BPM Algorithmic Clustering",
          desc: "YouTube pairs your Afro/Deep House tracks directly with high-traffic Hindi dance playlists.",
          icon: "Flame",
        },
        {
          title: "Night-Drive Autoplay Delivery",
          desc: "Algorithm prioritizes Supasonic Beats during 8:30 PM - 1:30 AM IST mobile headphone sessions.",
          icon: "Clock",
        },
        {
          title: "Browse Feed Acceleration",
          desc: "Tracks with >70% watch duration get pushed directly to returning listeners' home screens.",
          icon: "TrendingUp",
        },
      ],
      tacticalGameplan: "Push 'BHAR LE TU' (+10 views needed) to unlock 5th Boss track, and drop 1 new 122 BPM banger during evening peak to clear the remaining 2,529 views!",
    },
    {
      level: 3,
      rankTitle: "Club & Streaming Heavyweight",
      badge: "🥇 LEVEL 3",
      color: "from-amber-500/25 to-yellow-900/10",
      borderColor: "border-amber-400/50",
      bgGradient: "bg-[#1c1810]/70",
      accentColor: "text-amber-400",
      viewRange: "30,000 - 100,000 Views",
      minViews: 30000,
      maxViews: 100000,
      description: "Mainstream electronic recognition, automated homepage browse distribution, and Topic page creation.",
      status: "locked",
      quests: [
        {
          id: "l3_q1",
          title: "100K Stream Benchmark",
          targetValue: 100000,
          unit: "Views",
          currentValue: totalViews,
          achieved: totalViews >= 100000,
          description: "Reach 100,000 lifetime views across the Supasonic Beats catalog.",
        },
        {
          id: "l3_q2",
          title: "Subscriber Growth Tier",
          targetValue: 250,
          unit: "Subscribers",
          currentValue: subscriberCount,
          achieved: subscriberCount >= 250,
          description: "Build an active listener base of 250+ passionate music subscribers.",
        },
        {
          id: "l3_q3",
          title: "Boss Track Squadron",
          targetValue: 8,
          unit: "Boss Tracks (>1K)",
          currentValue: bossVideos.length,
          achieved: bossVideos.length >= 8,
          description: `Cultivate 8 tracks with >1,000 views. (Currently ${bossVideos.length}/8; Bhar Le Tu, Dil Laga Liya, Zara Zara in pipeline).`,
        },
        {
          id: "l3_q4",
          title: "First 5K Megahit",
          targetValue: 1,
          unit: "Track >5,000 Views",
          currentValue: bossVideos.filter((v) => v.views >= 5000).length,
          achieved: bossVideos.some((v) => v.views >= 5000),
          description: "Deedar De is currently at 4,618 views (only 382 views away from unlocking this quest!).",
        },
        {
          id: "l3_q5",
          title: "Triple-Digit Velocity Surge",
          targetValue: 100,
          unit: "Views/Hour Peak",
          currentValue: 48,
          achieved: false,
          description: "Sustain 100+ views per hour during Friday/Saturday late night dance club hours.",
        },
      ],
      unlockedPerks: [
        {
          title: "YouTube Music 'Topic' Channel",
          desc: "Automated distribution to official YouTube Music streaming catalog and algorithmic radio.",
          icon: "Disc",
        },
        {
          title: "Day-One Browse Homepage Push",
          desc: "YouTube tests newly uploaded beats directly on active electronic music listeners' home screens.",
          icon: "Target",
        },
        {
          title: "Full Notification Bell Delivery",
          desc: "100% instant push notification dispatch to all bell-on subscribers on release drop.",
          icon: "Zap",
        },
      ],
      tacticalGameplan: "Package catalog into 30-minute and 1-hour themed seamless mixes to multiply watch hours and trigger massive browse feed expansions.",
    },
    {
      level: 4,
      rankTitle: "Desi Electronic Record Label",
      badge: "👑 LEVEL 4",
      color: "from-purple-600/30 to-indigo-900/10",
      borderColor: "border-purple-500/50",
      bgGradient: "bg-[#181124]/70",
      accentColor: "text-purple-400",
      viewRange: "100,000 - 500,000 Views",
      minViews: 100000,
      maxViews: 500000,
      description: "Full YouTube Partner Program monetization, Official Artist Channel badge, and viral dance breakouts.",
      status: "locked",
      quests: [
        {
          id: "l4_q1",
          title: "Half-Million Stream Milestone",
          targetValue: 500000,
          unit: "Views",
          currentValue: totalViews,
          achieved: totalViews >= 500000,
          description: "Cross 500,000 total lifetime views.",
        },
        {
          id: "l4_q2",
          title: "1,000 Monetization Subs",
          targetValue: 1000,
          unit: "Subscribers",
          currentValue: subscriberCount,
          achieved: subscriberCount >= 1000,
          description: "Unlock full YouTube Partner Program (YPP) subscriber threshold.",
        },
        {
          id: "l4_q3",
          title: "4,000 Watch Hours Threshold",
          targetValue: 4000,
          unit: "Watch Hours",
          currentValue: 140,
          achieved: false,
          description: "Achieve 4,000 public watch hours through continuous deep house marathon playlists.",
        },
        {
          id: "l4_q4",
          title: "Viral Dance Anthem",
          targetValue: 1,
          unit: "Track >25,000 Views",
          currentValue: 0,
          achieved: false,
          description: "Achieve a viral crossover hit picked up by Instagram Reels and DJ mixes.",
        },
        {
          id: "l4_q5",
          title: "Boss Track Catalog",
          targetValue: 20,
          unit: "Boss Tracks (>1K)",
          currentValue: bossVideos.length,
          achieved: bossVideos.length >= 20,
          description: "Build an unshakeable library of 20+ songs with over 1,000 views.",
        },
      ],
      unlockedPerks: [
        {
          title: "Official Artist Channel (OAC) ♪",
          desc: "Music Note badge (♪) next to channel name and merged artist discography.",
          icon: "Crown",
        },
        {
          title: "YouTube Monetization & Royalties",
          desc: "Full AdSense, YouTube Premium revenue, and Content ID sound recording collection.",
          icon: "Award",
        },
        {
          title: "Community Tab & Fan Memberships",
          desc: "Exclusive audio preview drops, voting polls, and VIP member badges.",
          icon: "Users",
        },
      ],
      tacticalGameplan: "Collaborate with independent vocalists and submit stems to international Afro House DJs to secure external playlist placements.",
    },
    {
      level: 5,
      rankTitle: "Mainstage Legend & Autopilot",
      badge: "🏆 LEVEL 5",
      color: "from-rose-600/30 to-red-950/20",
      borderColor: "border-rose-500/50",
      bgGradient: "bg-[#220e14]/70",
      accentColor: "text-rose-400",
      viewRange: "500,000 - 1,000,000+ Views",
      minViews: 500000,
      maxViews: 1000000,
      description: "Autonomous algorithmic momentum, global South Asian diaspora recognition, and festival sync licensing.",
      status: "locked",
      quests: [
        {
          id: "l5_q1",
          title: "1,000,000 Views Hall of Fame",
          targetValue: 1000000,
          unit: "Lifetime Views",
          currentValue: totalViews,
          achieved: totalViews >= 1000000,
          description: "Join the elite 1 Million Views club on YouTube.",
        },
        {
          id: "l5_q2",
          title: "5,000+ Dedicated Fanbase",
          targetValue: 5000,
          unit: "Subscribers",
          currentValue: subscriberCount,
          achieved: subscriberCount >= 5000,
          description: "Dedicated core audience driving instant 1K+ views on every new release within 24 hours.",
        },
        {
          id: "l5_q3",
          title: "Daily Autopilot Stream Baseline",
          targetValue: 5000,
          unit: "Daily Views/Day",
          currentValue: 467,
          achieved: false,
          description: "Channel generates 5,000+ daily views passively without requiring new uploads.",
        },
        {
          id: "l5_q4",
          title: "Diamond Anthem",
          targetValue: 1,
          unit: "Track >100K Views",
          currentValue: 0,
          achieved: false,
          description: "Signature timeless anthem featured on global EDM and Bollywood remix charts.",
        },
      ],
      unlockedPerks: [
        {
          title: "Full Algorithmic Autopilot",
          desc: "YouTube's recommendation neural network permanently loops Supasonic Beats globally.",
          icon: "Shield",
        },
        {
          title: "DSP Editorial & Sync Placement",
          desc: "Direct editorial placement on Spotify, Apple Music & OTT film sync inquiries.",
          icon: "Trophy",
        },
        {
          title: "Brand Sponsorships & Headlining Sets",
          desc: "Direct audio brand endorsements and headline club bookings.",
          icon: "Star",
        },
      ],
      tacticalGameplan: "Scale brand into live performance sets, official vinyl/merch drops, and establish Supasonic Beats as a registered electronic music imprint.",
    },
  ];

  // Current Level
  let currentLevelNum = 2;
  if (totalViews < 10000) currentLevelNum = 1;
  else if (totalViews < 30000) currentLevelNum = 2;
  else if (totalViews < 100000) currentLevelNum = 3;
  else if (totalViews < 500000) currentLevelNum = 4;
  else currentLevelNum = 5;

  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(currentLevelNum);
  const selectedLevel = levelsData.find((l) => l.level === selectedLevelNum) || levelsData[1];

  const levelMin = currentLevelNum === 1 ? 0 : currentLevelNum === 2 ? 10000 : currentLevelNum === 3 ? 30000 : currentLevelNum === 4 ? 100000 : 500000;
  const levelMax = currentLevelNum === 1 ? 10000 : currentLevelNum === 2 ? 30000 : currentLevelNum === 3 ? 100000 : currentLevelNum === 4 ? 500000 : 1000000;
  const currentLevelProgressPct = Math.min(
    100,
    Math.max(0, Math.round(((totalViews - levelMin) / (levelMax - levelMin)) * 1000) / 10)
  );

  const viewsNeededForNextLevel = Math.max(0, levelMax - totalViews);

  // Filter state for catalog elevation grid
  const [tierFilter, setTierFilter] = useState<"all" | "boss" | "elite" | "fighter" | "rookie">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredVideos = videos.filter((v) => {
    if (searchQuery.trim() && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (tierFilter === "boss") return v.views >= 1000;
    if (tierFilter === "elite") return v.views >= 500 && v.views < 1000;
    if (tierFilter === "fighter") return v.views >= 100 && v.views < 500;
    if (tierFilter === "rookie") return v.views < 100;
    return true;
  });

  // Producer Achievements Cabinet List
  const producerBadges = [
    {
      id: "badge_1",
      title: "Bedroom Beatmaker",
      tier: "🥉 Bronze",
      status: "unlocked",
      xp: "+500 XP",
      criteria: "Launch channel & drop initial 10 catalog beats",
      icon: Disc,
      color: "border-amber-500/40 text-amber-300 bg-amber-950/20",
    },
    {
      id: "badge_2",
      title: "Bollywood Afro Pioneer",
      tier: "🥈 Silver",
      status: "unlocked",
      xp: "+1,000 XP",
      criteria: "15+ tracks released in the signature 124 BPM Afro/Deep House style",
      icon: Flame,
      color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/20",
    },
    {
      id: "badge_3",
      title: "1,000 Views Boss Squad",
      tier: "👑 Gold",
      status: "unlocked",
      xp: "+2,000 XP",
      criteria: "Hold 4 tracks with >1,000 views (Deedar De, Aao Na, In The Night, Kalyani)",
      icon: Crown,
      color: "border-purple-500/40 text-purple-300 bg-purple-950/20",
    },
    {
      id: "badge_4",
      title: "Midnight Cruiser (Night Peak)",
      tier: "🌙 Special",
      status: "unlocked",
      xp: "+1,500 XP",
      criteria: "Clock 48+ views/hr surge during late night 8:30 PM - 1:30 AM IST",
      icon: Clock,
      color: "border-blue-500/40 text-blue-300 bg-blue-950/20",
    },
    {
      id: "badge_5",
      title: "Marathon Mix Master",
      tier: "🎧 Gold",
      status: "unlocked",
      xp: "+1,000 XP",
      criteria: "Deliver continuous 18-minute DJ mix (accumulated ~35 hours watch time)",
      icon: Radio,
      color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/20",
    },
    {
      id: "badge_6",
      title: "5K Megahit Slayer",
      tier: "🌟 Platinum",
      status: "progress",
      xp: "+5,000 XP",
      criteria: "Push Deedar De to 5,000 views (Currently 4,618 / 5,000 — 92.4%!)",
      icon: Star,
      color: "border-amber-400/50 text-amber-200 bg-amber-950/30",
    },
    {
      id: "badge_7",
      title: "Century Club (100+ v/hr)",
      tier: "🏆 Diamond",
      status: "locked",
      xp: "+10,000 XP",
      criteria: "Sustain 100+ views in a single hour during peak clubbing weekend hours",
      icon: Trophy,
      color: "border-zinc-800 text-zinc-500 bg-zinc-900/50",
    },
    {
      id: "badge_8",
      title: "Monetized Electronic Label",
      tier: "💎 Master",
      status: "locked",
      xp: "+25,000 XP",
      criteria: "Unlock YouTube Partner Program (1,000 subs + 4,000 watch hours)",
      icon: DollarSign,
      color: "border-zinc-800 text-zinc-500 bg-zinc-900/50",
    },
  ];

  // Projected Monthly Earnings calculation based on CPM
  // Indian electronic music streaming average CPM: ₹150 - ₹220 per 1,000 views
  const estimatedMonthlyRupees = Math.round((calcDailyViews * 30 * 185) / 1000);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 0. VIEW MODE SWITCHER: BATCHES VS RPG LEVELS */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 rounded-2xl bg-[#141418] border border-zinc-800/90 gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveViewMode("batches")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewMode === "batches"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            🔬 Algorithm Impression Batches (&lt;250, 250-800, 800-2.5K, &gt;2.5K)
          </button>
          <button
            onClick={() => setActiveViewMode("levels")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewMode === "levels"
                ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-900/40"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            🏆 Channel RPG Roadmap & Levels
          </button>
        </div>
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 rounded-xl border border-zinc-800/60 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Catalog: <strong className="text-white font-bold">{videos.length} Tracks Live</strong></span>
        </div>
      </div>

      {activeViewMode === "batches" ? (
        <AlgorithmBatchLadder
          catalogVideos={videos}
          onPlayVideo={(v) => setPlayingVideo(v)}
        />
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. CHANNEL HERO HUD: CURRENT LEVEL PROGRESSION */}
          {/* ============================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#12131a] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Channel RPG Level System
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                LEVEL {currentLevelNum}: {levelsData[currentLevelNum - 1]?.rankTitle.toUpperCase()}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
                ⚡ CURRENT RANK
              </span>
            </div>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Supasonic Beats channel-wide XP roadmap. Complete active level targets to unlock higher algorithmic distribution tiers, browse autopilot, and YouTube monetization.
            </p>
          </div>

          {/* XP & Next Level Countdown Pill */}
          <div className="bg-[#171926] border border-cyan-500/40 p-4 rounded-2xl shadow-xl text-center min-w-[240px] w-full lg:w-auto">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" /> NEXT RANK COUNTDOWN
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {viewsNeededForNextLevel.toLocaleString()}{" "}
              <span className="text-sm font-semibold text-cyan-400">XP Left</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium block mt-1">
              {viewsNeededForNextLevel.toLocaleString()} views to reach{" "}
              <strong className="text-amber-400">LEVEL 3</strong> (30K Views)
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-7 pt-6 border-t border-zinc-800/80 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold mb-2 gap-1">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Current Channel XP:</span>
              <strong className="text-white text-sm font-black">{totalViews.toLocaleString()} Views</strong>
              <span className="text-zinc-500 font-normal">/ {levelMax.toLocaleString()} Views Target</span>
            </span>
            <span className="text-cyan-400 font-black text-sm">
              {currentLevelProgressPct}% Completed
            </span>
          </div>

          <div className="w-full bg-zinc-900/90 h-3.5 rounded-full p-0.5 border border-zinc-700/60 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${currentLevelProgressPct}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5 font-semibold">
            <span>Level 2 Start: {levelMin.toLocaleString()} Views</span>
            <span className="text-cyan-400">Level 3 Unlock: {levelMax.toLocaleString()} Views</span>
          </div>
        </div>

        {/* Quick Quest Completion Stat Tiles */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="p-3.5 rounded-xl bg-[#171926]/80 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Total Catalog XP</span>
            <div className="text-lg md:text-xl font-black text-white mt-0.5">
              {totalViews.toLocaleString()} <span className="text-xs text-rose-400 font-bold">Views</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">91.5% to Level 3</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#171926]/80 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Subscribers</span>
            <div className="text-lg md:text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1">
              {subscriberCount} <span className="text-xs text-zinc-400 font-normal">/ 100</span>
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">{Math.max(0, 100 - subscriberCount)} needed for Level 2 quest</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#171926]/80 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Boss Tracks (&gt;1K)</span>
            <div className="text-lg md:text-xl font-black text-purple-400 mt-0.5 flex items-baseline gap-1">
              {bossVideos.length} <span className="text-xs text-emerald-400 font-bold">✓ (Target: 3)</span>
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">Quest Completed ✅</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#171926]/80 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Catalog Library</span>
            <div className="text-lg md:text-xl font-black text-amber-400 mt-0.5">
              {totalVideosCount} Tracks
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">Quest Completed ✅ (Target: 50)</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. LEVEL PROGRESSION ROADMAP (INTERACTIVE LEVEL 1 TO 5 TABS) */}
      {/* ============================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" /> CHANNEL LEVEL ROADMAP (LEVEL 1 – 5)
            </h3>
            <p className="text-xs text-zinc-400">
              Select any level below to inspect target quests, algorithmic unlocks, and requirements:
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            Tap a level to view details ➔
          </span>
        </div>

        {/* Level Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {levelsData.map((lvl) => {
            const isSelected = selectedLevelNum === lvl.level;
            const isCurrent = currentLevelNum === lvl.level;
            const isCleared = currentLevelNum > lvl.level;

            return (
              <button
                key={lvl.level}
                onClick={() => setSelectedLevelNum(lvl.level)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `${lvl.borderColor} ${lvl.bgGradient} shadow-lg ring-1 ring-white/20`
                    : "bg-[#15161e] border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                        : isCleared
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                    }`}
                  >
                    {isCurrent ? "⚡ ACTIVE" : isCleared ? "✓ CLEARED" : "🔒 LOCKED"}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">L{lvl.level}</span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"} line-clamp-1`}>
                    {lvl.rankTitle}
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-medium block mt-0.5">
                    {lvl.viewRange}
                  </span>
                </div>

                <div className="w-full bg-zinc-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCleared
                        ? "bg-emerald-400 w-full"
                        : isCurrent
                        ? "bg-cyan-400"
                        : "bg-zinc-700 w-0"
                    }`}
                    style={{ width: isCurrent ? `${currentLevelProgressPct}%` : undefined }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SELECTED LEVEL DETAILS: QUESTS + ALGORITHMIC UNLOCKS */}
      {/* ============================================================== */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xl ${selectedLevel.bgGradient} ${selectedLevel.borderColor} relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                selectedLevel.level === currentLevelNum
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : selectedLevel.level < currentLevelNum
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                {selectedLevel.badge}
              </span>
              <span className="text-xs font-bold text-zinc-400">
                Range: {selectedLevel.viewRange}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
              {selectedLevel.rankTitle}
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 mt-1 max-w-2xl">
              {selectedLevel.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedLevel.level === currentLevelNum && (
              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-cyan-400 animate-pulse" /> You are currently grinding this level!
              </span>
            )}
            {selectedLevel.level < currentLevelNum && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed & Claimed
              </span>
            )}
            {selectedLevel.level > currentLevelNum && (
              <span className="px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-zinc-400" /> Locked until Level {selectedLevel.level - 1} Cleared
              </span>
            )}
          </div>
        </div>

        {/* Level Quests (Requirements Checklist) */}
        <div className="mt-6">
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" />
            <span>Target Quests Required to Clear Level {selectedLevel.level}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {selectedLevel.quests.map((quest) => {
              const pct = Math.min(100, Math.round((quest.currentValue / quest.targetValue) * 100));
              const isDone = quest.currentValue >= quest.targetValue;

              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isDone
                      ? "bg-[#141d1a]/80 border-emerald-900/50"
                      : "bg-[#161722]/90 border-zinc-800/80"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-zinc-600 flex-shrink-0" />
                        )}
                        <h5 className="text-xs md:text-sm font-bold text-white">
                          {quest.title}
                        </h5>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {isDone ? "COMPLETE ✓" : `${pct}%`}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-zinc-800/60">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 mb-1">
                      <span>Progress:</span>
                      <span className={isDone ? "text-emerald-400 font-bold" : "text-white font-bold"}>
                        {quest.currentValue.toLocaleString()} / {quest.targetValue.toLocaleString()} {quest.unit}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isDone ? "bg-emerald-400" : "bg-gradient-to-r from-amber-500 to-rose-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithmic Perks & Superpowers Unlocked */}
        <div className="mt-7 pt-6 border-t border-zinc-800/80">
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Algorithmic Perks & Platform Rewards (Unlocked at Level {selectedLevel.level})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {selectedLevel.unlockedPerks.map((perk, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#171824] border border-zinc-800/80">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>PERK 0{idx + 1}</span>
                </div>
                <h5 className="font-bold text-white text-sm">
                  {perk.title}
                </h5>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Playbook Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3">
          <Flame className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-wider">
              Level {selectedLevel.level} Tactical Action Plan
            </h5>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {selectedLevel.tacticalGameplan}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. ACTIVE BOSS BATTLES: TRACKS ON THE BRINK OF LEVEL UP */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#141418] border border-zinc-800/90 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider mb-1">
              <Flame className="w-3 h-3" /> IMMEDIATE CHANNEL XP BOOSTERS
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              ACTIVE BOSS BATTLES (Tracks Near Promotion)
            </h3>
            <p className="text-xs text-zinc-400">
              Upgrading these individual tracks will immediately complete channel quests and advance Supasonic Beats to Level 3:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* BOSS BATTLE 1: BHAR LE TU -> 1,000 Views */}
          <div className="p-5 rounded-2xl bg-[#171622] border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
              ★ 99% TO BOSS TIER
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                  Only 10 Views Left!
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                BHAR LE TU [124 BPM]
              </h4>
              <div className="my-2 text-2xl font-black text-white">
                990 <span className="text-xs font-normal text-zinc-400">/ 1,000 views</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Crossing 1,000 views makes Bhar Le Tu the channel's <strong>5th Boss Track</strong>, directly fulfilling the Level 3 milestone.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
                <span>Target: 1,000 Views</span>
                <span className="text-cyan-400 font-bold">99.0%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "99.0%" }} />
              </div>
              <button
                onClick={() => setPlayingVideo({ id: "lQl3dRGivOI", title: "BHAR LE TU [124 BPM]", views: 990, likes: 14 })}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Preview Beat In-App 🎧
              </button>
            </div>
          </div>

          {/* BOSS BATTLE 2: DEEDAR DE -> 5,000 Views */}
          <div className="p-5 rounded-2xl bg-[#171622] border border-purple-500/40 hover:border-purple-400 transition-all shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
              👑 MEGAHIT 5K QUEST
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                  382 Views Left
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                DEEDAR DE [124 BPM]
              </h4>
              <div className="my-2 text-2xl font-black text-white">
                4,618 <span className="text-xs font-normal text-zinc-400">/ 5,000 views</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All-time catalog leader. Hitting 5,000 views unlocks the Level 3 "First 5K Megahit" quest and elevates channel search authority.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
                <span>Milestone: 5,000 Views</span>
                <span className="text-purple-400 font-bold">92.4%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: "92.4%" }} />
              </div>
              <button
                onClick={() => setPlayingVideo({ id: "BuvPDZawk9M", title: "DEEDAR DE [124 BPM]", views: 4618, likes: 28 })}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Preview Beat In-App 🎧
              </button>
            </div>
          </div>

          {/* BOSS BATTLE 3: DIL LAGA LIYA -> 1,000 Views */}
          <div className="p-5 rounded-2xl bg-[#171622] border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
              ★ 80% TO BOSS TIER
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  200 Views Left
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                DIL LAGA LIYA [124 BPM]
              </h4>
              <div className="my-2 text-2xl font-black text-white">
                800 <span className="text-xs font-normal text-zinc-400">/ 1,000 views</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rock-solid daily performer with 50+ views/day. Only 200 views away from entering the 1,000 Views Boss Tier.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
                <span>Milestone: 1,000 Views</span>
                <span className="text-emerald-400 font-bold">80.0%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "80.0%" }} />
              </div>
              <button
                onClick={() => setPlayingVideo({ id: "o68amPUakwU", title: "DIL LAGA LIYA [124 BPM]", views: 800, likes: 19 })}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Preview Beat In-App 🎧
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. 🏅 PRODUCER TROPHY CABINET & BADGES */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#141418] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <Trophy className="w-3 h-3 text-amber-400" /> HALL OF FAME
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              PRODUCER TROPHY CABINET (Achievements Unlocked)
            </h3>
            <p className="text-xs text-zinc-400">
              Specialized milestones that acknowledge your sound design, catalog consistency, and algorithmic dominance:
            </p>
          </div>
          <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-500/40 hidden sm:inline-block">
            5 OF 8 UNLOCKED (62.5%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {producerBadges.map((badge) => {
            const Icon = badge.icon;
            const isUnlocked = badge.status === "unlocked";
            const isProgress = badge.status === "progress";

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? `${badge.color} shadow-md`
                    : isProgress
                    ? "bg-[#181622] border-amber-400/50 shadow-md ring-1 ring-amber-400/20"
                    : "bg-[#14151e] border-zinc-800/80 text-zinc-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white">
                      {badge.tier}
                    </span>
                    <span className="text-[10px] font-black text-emerald-400">
                      {badge.xp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 my-1.5">
                    <div className={`p-2 rounded-xl ${isUnlocked ? "bg-white/10" : "bg-zinc-800"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-black text-white">
                      {badge.title}
                    </h5>
                  </div>

                  <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                    {badge.criteria}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold">
                  {isUnlocked && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked & Claimed
                    </span>
                  )}
                  {isProgress && (
                    <span className="text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 92.4% In Progress
                    </span>
                  )}
                  {!isUnlocked && !isProgress && (
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. 💵 YOUTUBE MONETIZATION & ROYALTY CALCULATOR */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-r from-[#141a24] via-[#111422] to-[#161224] border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> REVENUE PROJECTIONS
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              YOUTUBE PARTNER PROGRAM (YPP) & ROYALTY CALCULATOR
            </h3>
            <p className="text-xs text-zinc-400">
              Track progress to full monetization and project your monthly earnings based on daily stream volume:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Milestone 1: 1,000 Subs */}
          <div className="p-4 rounded-2xl bg-[#0f1420] border border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">YPP Subscriber Requirement</span>
            <div className="text-xl font-black text-white mt-1">
              {subscriberCount} <span className="text-xs text-emerald-400 font-bold">/ 1,000 Subs (6.6%)</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, (subscriberCount / 1000) * 100)}%` }} />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1.5 block">{1000 - subscriberCount} subscribers to monetization lock</span>
          </div>

          {/* Milestone 2: 4,000 Watch Hours */}
          <div className="p-4 rounded-2xl bg-[#0f1420] border border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">YPP Watch Hours Requirement</span>
            <div className="text-xl font-black text-white mt-1">
              ~140 <span className="text-xs text-amber-400 font-bold">/ 4,000 Hours (3.5%)</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: "3.5%" }} />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1.5 block">Continuous 18-min mixes fast-track watch hours</span>
          </div>

          {/* Estimated Monthly Earnings Calculator */}
          <div className="p-4 rounded-2xl bg-[#141e24] border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Estimated Monthly Streaming Revenue</span>
              <div className="text-2xl font-black text-white mt-1">
                ₹{estimatedMonthlyRupees.toLocaleString()}{" "}
                <span className="text-xs text-emerald-400 font-semibold">/ month</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                At {calcDailyViews.toLocaleString()} views/day (CPM: ₹185 / 1K views)
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {[1000, 5000, 10000, 25000].map((v) => (
                <button
                  key={v}
                  onClick={() => setCalcDailyViews(v)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    calcDailyViews === v
                      ? "bg-emerald-500 text-black shadow-sm"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {v >= 1000 ? `${v / 1000}K/day` : v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. CATALOG RELEASES DIRECTORY WITH PREVIEW & SEARCH */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#141418] border border-zinc-800/90 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Disc className="w-5 h-5 text-zinc-300" />
              <span>CATALOG RELEASES DIRECTORY ({filteredVideos.length} of {videos.length})</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tap any track to preview the beat directly inside the app:
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search track title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181822] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Tier Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold mb-5">
          {[
            { id: "all", label: `All Releases (${videos.length})` },
            { id: "boss", label: `👑 Boss (${bossVideos.length})` },
            { id: "elite", label: `🥇 Elite (${eliteVideos.length})` },
            { id: "fighter", label: `🥈 Fighter (${fighterVideos.length})` },
            { id: "rookie", label: `🥉 Rookie (${rookieVideos.length})` },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTierFilter(filter.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                tierFilter === filter.id
                  ? "bg-cyan-500 text-black font-bold shadow-sm"
                  : "bg-zinc-800/70 text-zinc-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Track Grid with In-App Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredVideos.map((video) => {
            const views = video.views || 0;
            let tierLabel = "Rookie (<100)";
            let tierColor = "text-zinc-400 border-zinc-800 bg-zinc-800/40";
            let progressPct = Math.min(100, Math.round((views / 100) * 100));
            let nextMilestone = "100 Views";

            if (views >= 1000) {
              tierLabel = "👑 Boss (>1K)";
              tierColor = "text-purple-300 border-purple-900/50 bg-purple-950/20";
              progressPct = Math.min(100, Math.round((views / 5000) * 100));
              nextMilestone = "5,000 Views";
            } else if (views >= 500) {
              tierLabel = "🥇 Elite (500-1K)";
              tierColor = "text-emerald-300 border-emerald-900/50 bg-emerald-950/20";
              progressPct = Math.min(100, Math.round(((views - 500) / 500) * 100));
              nextMilestone = "1,000 Views";
            } else if (views >= 100) {
              tierLabel = "🥈 Fighter (100-500)";
              tierColor = "text-amber-300 border-amber-900/50 bg-amber-950/20";
              progressPct = Math.min(100, Math.round(((views - 100) / 400) * 100));
              nextMilestone = "500 Views";
            }

            return (
              <div
                key={video.id}
                className="p-3.5 rounded-xl bg-[#181822] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tierColor}`}>
                      {tierLabel}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {views.toLocaleString()} views
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-zinc-200 line-clamp-1" title={video.title}>
                    {video.title}
                  </h5>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Target: {nextMilestone}</span>
                    <span className="font-bold text-zinc-300">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        views >= 1000
                          ? "bg-purple-500"
                          : views >= 500
                          ? "bg-emerald-500"
                          : views >= 100
                          ? "bg-amber-500"
                          : "bg-zinc-500"
                      }`}
                      style={{ width: `${Math.max(5, progressPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 gap-2">
                    <span>{video.likes || 0} likes</span>
                    <button
                      onClick={() => setPlayingVideo(video)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 border border-cyan-500/30 transition-all"
                    >
                      <Play className="w-2.5 h-2.5 fill-cyan-300" /> Preview Beat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* ============================================================== */}
      {/* 8. IN-APP FLOATING AUDIO/VIDEO PREVIEW MODAL */}
      {/* ============================================================== */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141622] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold uppercase tracking-wider mb-1">
                  <Music className="w-3 h-3" /> NOW PLAYING IN-APP
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {playingVideo.title}
                </h4>
                <span className="text-[10px] text-zinc-400">
                  {playingVideo.views.toLocaleString()} views • {playingVideo.likes || 0} likes
                </span>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive 16:9 Embedded YouTube Player */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <a
                href={`https://www.youtube.com/watch?v=${playingVideo.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold text-xs"
              >
                Open in YouTube App <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setPlayingVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
