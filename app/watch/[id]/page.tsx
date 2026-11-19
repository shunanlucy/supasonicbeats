"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Download,
  Share2,
  ExternalLink,
  Flame,
  Music,
  Check,
  Disc,
  FileAudio,
  Image as ImageIcon,
  Heart,
  Eye,
  ArrowLeft,
  Sparkles,
  Tag,
  Copy,
  Users,
  CheckCircle2,
  Trophy,
  Bell,
  ThumbsUp,
} from "lucide-react";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";

interface WatchTrack {
  id: string;
  type?: string;
  videoId: string;
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
  seoData?: {
    titles: Array<{ type: string; title: string; charCount: number; advantage: string }>;
    tagsString: string;
    tagList: string[];
    totalTagChars: number;
    descriptionTemplate: string;
  };
}

interface CompetitorRecommendation {
  id: string;
  channelName: string;
  title: string;
  views: number;
  viewsFormatted: string;
  bpm: string;
  thumbnail: string;
  tags: string[];
  daysTo1M: number;
  tacticalNote: string;
}

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = (params?.id as string) || "87ndOuq346I";
  const fromShort = searchParams?.get("from");

  const [currentTrack, setCurrentTrack] = useState<WatchTrack | null>(null);
  const [ourRecommendations, setOurRecommendations] = useState<WatchTrack[]>([]);
  const [competitorRecommendations, setCompetitorRecommendations] = useState<CompetitorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/watch/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.track) {
          setCurrentTrack(data.track);
          setLikesCount(data.track.likes || 420);
          setOurRecommendations(data.ourRecommendations || []);
          setCompetitorRecommendations(data.competitorRecommendations || []);
        }
      })
      .catch((e) => console.warn("Failed to load watch track:", e))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = (type: "mp3" | "wav" | "cover") => {
    if (!currentTrack) return;
    const link = document.createElement("a");
    if (type === "mp3") {
      link.href = currentTrack.mp3DownloadUrl || "/audio/clover_clip.mp3";
      link.download = `${currentTrack.title.replace(/[/\\?%*:|"<>]/g, "-")}_320kbps.mp3`;
    } else if (type === "wav") {
      link.href = currentTrack.wavDownloadUrl || "/audio/clover_clip.mp3";
      link.download = `${currentTrack.title.replace(/[/\\?%*:|"<>]/g, "-")}_Studio_Master.wav`;
    } else if (type === "cover") {
      link.href = currentTrack.coverDownloadUrl || currentTrack.thumbnail;
      link.download = `${currentTrack.title.replace(/[/\\?%*:|"<>]/g, "-")}_Cover_4K.jpg`;
      link.target = "_blank";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    if (!currentTrack) return;
    const url = typeof window !== "undefined" ? window.location.href : currentTrack.youtubeUrl || "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTags = () => {
    if (!currentTrack?.seoData?.tagsString) return;
    navigator.clipboard.writeText(currentTrack.seoData.tagsString);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  if (loading && !currentTrack) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 rounded-full border-4 border-[#303030] border-t-[#ff0000] animate-spin" />
        <p className="mt-4 text-xs font-semibold tracking-wider text-[#aaaaaa] uppercase">
          Loading YouTube Cinema Player & Stems...
        </p>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2 text-[#ff0000]">Track Not Found</h2>
        <p className="text-[#aaaaaa] text-sm mb-6">The video you are looking for is not in the active catalog.</p>
        <Link href="/" className="px-5 py-2.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] font-bold text-xs text-white">
          Back to YouTube Channel Hub
        </Link>
      </div>
    );
  }

  // High SEO JSON-LD VideoObject & MusicRecording Schema
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": ["VideoObject", "MusicRecording"],
    "name": currentTrack.title,
    "description": currentTrack.caption || `${currentTrack.title} produced by SUPASONIC BEATS. 124 BPM Hindi Afro House & Desi EDM.`,
    "thumbnailUrl": [currentTrack.thumbnail],
    "uploadDate": currentTrack.publishedAt,
    "duration": "PT3M24S",
    "embedUrl": `https://www.youtube.com/embed/${currentTrack.videoId}`,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": currentTrack.views,
    },
    "byArtist": {
      "@type": "MusicGroup",
      "name": "SUPASONIC BEATS",
      "url": "https://supasonicbeats.com",
    },
    "inLanguage": "hi",
    "isFamilyFriendly": true,
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col">
      {/* High SEO Video Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      {/* 1. YouTube Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#0f0f0f] border-b border-[#282828] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Channel</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-5.5 rounded-md bg-[#ff0000] flex items-center justify-center shadow-md shadow-red-900/30">
              <Play className="w-3 h-3 text-white fill-current translate-x-0.2" />
            </div>
            <span className="text-sm font-black text-[#f1f1f1] tracking-tight group-hover:text-white hidden sm:inline">
              SUPASONIC BEATS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-900/40 active:scale-95 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>SUBSCRIBE</span>
          </a>
        </div>
      </header>

      {/* 2. Main YouTube Watch Layout (Player on Left, Up Next Recommendations on Right) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Column (Player, Title, Channel Bar, Action Bar, Description, Ads) */}
          <section aria-label="Cinema Player & Track Details" className="lg:col-span-8 space-y-4">
            {/* 16:9 Responsive Cinema Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#282828] shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${currentTrack.title} - SUPASONIC BEATS`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Title */}
            <div className="space-y-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#f1f1f1] tracking-tight leading-snug">
                {currentTrack.title}
              </h1>

              {/* YouTube Channel Info Bar & Action Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#282828]">
                {/* Channel Profile + Subscribe */}
                <div className="flex items-center gap-3">
                  <Link href="/" className="w-10 h-10 rounded-full overflow-hidden bg-[#272727] flex-shrink-0 border border-[#303030]">
                    <img
                      src="/channel_avatar.jpg"
                      alt="SUPASONIC BEATS"
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div>
                    <div className="flex items-center gap-1">
                      <Link href="/" className="text-sm font-bold text-[#f1f1f1] hover:text-white transition-colors">
                        SUPASONIC BEATS
                      </Link>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#aaaaaa] text-black flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                    </div>
                    <div className="text-xs text-[#aaaaaa]">47 subscribers • Official Artist Channel</div>
                  </div>

                  <a
                    href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-4 py-2 rounded-full bg-white hover:bg-[#d9d9d9] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Bell className="w-3.5 h-3.5 fill-black" />
                    <span>Subscribe</span>
                  </a>
                </div>

                {/* YouTube Action Bar Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {/* Like Button */}
                  <button
                    onClick={toggleLike}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      liked
                        ? "bg-[#ff0000] text-white"
                        : "bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1]"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
                    <span>{likesCount.toLocaleString()}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied" : "Share"}</span>
                  </button>

                  {/* Download MP3 (320kbps) */}
                  <button
                    onClick={() => handleDownload("mp3")}
                    className="px-3.5 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#3ea6ff] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <FileAudio className="w-3.5 h-3.5" />
                    <span>320k MP3</span>
                  </button>

                  {/* Download WAV Master */}
                  <button
                    onClick={() => handleDownload("wav")}
                    className="px-3.5 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#ff4e45] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Disc className="w-3.5 h-3.5" />
                    <span>Studio WAV</span>
                  </button>

                  {/* Copy Tags */}
                  <button
                    onClick={handleCopyTags}
                    className="px-3.5 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Tag className="w-3.5 h-3.5" />}
                    <span>{copiedTags ? "Tags Copied" : "SEO Tags"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* YouTube Expandable Description Box */}
            <div className="p-4 rounded-2xl bg-[#212121] border border-[#282828] text-xs md:text-sm text-[#f1f1f1] space-y-3">
              {/* Metadata Stats Header */}
              <div className="flex flex-wrap items-center gap-2 font-bold text-xs text-[#f1f1f1]">
                <span>{currentTrack.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{currentTrack.formattedDate}</span>
                <span>•</span>
                <span className="text-[#3ea6ff] font-mono">#HindiAfroHouse</span>
                <span className="text-[#3ea6ff] font-mono">#DesiEDM</span>
                <span className="text-[#3ea6ff] font-mono">#124BPM</span>
              </div>

              {/* Bio & Details */}
              <p className="leading-relaxed text-[#aaaaaa]">
                {currentTrack.caption}
              </p>

              {/* Musical Specifications */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#f1f1f1]">
                  Tempo: <strong>{currentTrack.bpm} BPM</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#f1f1f1]">
                  Key: <strong>{currentTrack.key}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#ff4e45]">
                  Genre: <strong>{currentTrack.subgenre}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-emerald-400">
                  Audio: <strong>320kbps MP3 & 24-bit WAV</strong>
                </span>
              </div>

              {/* Expandable SEO Details & Tag Cloud */}
              {currentTrack.seoData && (
                <div className="pt-2 border-t border-[#282828] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#aaaaaa]">
                    <span>High SEO Sound Tags ({currentTrack.seoData.tagList.length} tags)</span>
                    <button
                      onClick={handleCopyTags}
                      className="text-[#3ea6ff] hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedTags ? "✓ Copied to clipboard" : "Copy All Tags"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-1">
                    {currentTrack.seoData.tagList.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[11px] text-[#aaaaaa] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Google Display Ad Leaderboard Banner */}
            <GoogleStyleAdBanner format="leaderboard" />

            {/* YouTube Subscribe Billboard Poster */}
            <SubscribeAdPoster variant="billboard" />
          </section>

          {/* Right Column: YouTube Up Next Recommendations Sidebar */}
          <aside aria-label="Up Next Recommendations" className="lg:col-span-4 space-y-5">
            {/* 1. Official Releases from SUPASONIC BEATS (Prominently Highlighted) */}
            <div className="p-4 rounded-2xl bg-[#181818] border border-[#ff0000]/40 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#282828] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-ping" />
                  <h2 className="text-xs font-black text-[#f1f1f1] uppercase tracking-wider">
                    ★ Up Next from SUPASONIC BEATS
                  </h2>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#ff0000] text-white shadow-sm">
                  OFFICIAL
                </span>
              </div>

              <div className="space-y-2.5">
                {ourRecommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/watch/${rec.videoId}`}
                    className="flex gap-2.5 p-2 rounded-xl bg-[#212121] hover:bg-[#282828] border border-[#303030] hover:border-[#ff0000]/50 transition-all duration-150 group block"
                  >
                    <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <img
                        src={rec.thumbnail}
                        alt={`${rec.title} - SUPASONIC BEATS`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black/85 px-1 rounded text-white font-bold">
                        {rec.duration || "3:24"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h3 className="text-xs font-bold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-tight">
                        {rec.title}
                      </h3>
                      <div className="text-[10px] text-[#aaaaaa]">
                        <div className="text-[10px] text-[#aaaaaa] flex items-center gap-1">
                          <span>SUPASONIC BEATS</span>
                          <span className="text-[9px]">✓</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#717171] mt-0.5">
                          <span className="text-[#3ea6ff] font-mono">{rec.bpm} BPM</span>
                          <span>•</span>
                          <span>{rec.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Google Display Ad 300x250 Medium Rectangle (YouTube Sidebar Standard) */}
            <GoogleStyleAdBanner format="rectangle" />

            {/* 3. Related Competitor Benchmark Tracks (With Exact Keywords & Tags) */}
            <div className="p-4 rounded-2xl bg-[#181818] border border-[#282828] space-y-3">
              <div className="flex items-center justify-between border-b border-[#282828] pb-2">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <h3 className="text-xs font-bold text-[#aaaaaa] uppercase tracking-wider">
                    Competitor Niche Benchmarks
                  </h3>
                </div>
                <span className="text-[10px] text-[#717171]">Industry Top</span>
              </div>

              <div className="space-y-2.5">
                {competitorRecommendations.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-[#212121] border border-[#282828] space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-[#aaaaaa]">
                          {comp.channelName}
                        </div>
                        <h4 className="text-xs font-medium text-[#f1f1f1] line-clamp-2 leading-tight mt-0.5">
                          {comp.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono flex-shrink-0">
                        {comp.viewsFormatted}
                      </span>
                    </div>

                    {/* Tags Used by Competitor */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {comp.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[9px] bg-[#181818] text-[#717171] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] text-[#717171] italic">
                      💡 {comp.tacticalNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Compact YouTube Subscribe Ad Poster */}
            <div className="sticky top-16">
              <SubscribeAdPoster variant="compact" />
            </div>
          </aside>
        </div>

        {/* Global Social Hub Island at Bottom */}
        <div className="mt-10">
          <SocialLinksIsland />
        </div>
      </main>

      {/* Google Display AdSense Sticky Bottom Anchor Ad */}
      <GoogleStyleAdBanner format="anchor" />
    </div>
  );
}
