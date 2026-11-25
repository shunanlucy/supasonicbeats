"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Share2,
  Check,
  Disc,
  FileAudio,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Bell,
  ThumbsUp,
  Sliders,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";
import SubscribeUnlockModal from "@/components/SubscribeUnlockModal";

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

export default function WatchPage() {
  const params = useParams();
  const idParam = params?.id as string;

  const [currentTrack, setCurrentTrack] = useState<WatchTrack | null>(null);
  const [unavailableError, setUnavailableError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ourRecommendations, setOurRecommendations] = useState<WatchTrack[]>([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [upNextFilter, setUpNextFilter] = useState<"all" | "same_bpm">("all");
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    if (!idParam) return;
    let active = true;
    setLoading(true);
    setUnavailableError(null);

    fetch(`/api/watch/${idParam}`)
      .then(async (res) => {
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.success && data.track) {
          setCurrentTrack(data.track);
          setLikesCount(data.track.likes || 480);
          setOurRecommendations(data.ourRecommendations || []);
        } else {
          setCurrentTrack(null);
          setUnavailableError(data.error || "Track is private or unavailable.");
        }
      })
      .catch((e) => {
        console.error("Error loading watch track:", e);
        if (active) setUnavailableError("Unable to load track.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [idParam]);

  const openDownloadFunnel = (type: "mp3" | "wav") => {
    if (!currentTrack) return;
    const cleanName = currentTrack.title
      .split("|")[0]
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "_");
    setUnlockModal({
      isOpen: true,
      trackTitle: currentTrack.title.split("|")[0].trim(),
      formatLabel: type === "wav" ? "Studio 48kHz Master WAV" : "320 kbps Stereo MP3",
      downloadUrl:
        (type === "wav" ? currentTrack.wavDownloadUrl : currentTrack.mp3DownloadUrl) ||
        currentTrack.audioUrl ||
        "/audio/clover_clip.mp3",
      filename: `${cleanName}_${type === "wav" ? "StudioMaster.wav" : "320kbps.mp3"}`,
    });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTags = () => {
    if (!currentTrack) return;
    const tags =
      currentTrack.seoData?.tagsString ||
      `${currentTrack.subgenre}, ${currentTrack.bpm} BPM, ${currentTrack.key}, Supasonic Beats, 52Hz car sub bass, Indian Afro House`;
    navigator.clipboard.writeText(tags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleToggleLike = () => {
    setLiked((prev) => {
      setLikesCount((c) => (prev ? Math.max(0, c - 1) : c + 1));
      return !prev;
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const filteredUpNext =
    upNextFilter === "same_bpm" && currentTrack
      ? ourRecommendations.filter(
          (r) => Math.abs((r.bpm || 124) - (currentTrack.bpm || 124)) <= 6
        )
      : ourRecommendations;

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f] flex flex-col">
      {/* ================================================================ */}
      {/* YOUTUBE WATCH TOP HEADER (56px Sticky Frosted Bar)               */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-40 h-14 yt-frosted-bar border-b border-black/[0.06] px-3 sm:px-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="p-2 -ml-1 rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] transition-colors flex-shrink-0"
            aria-label="Back to channel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="w-8 h-[22px] rounded-[6px] bg-[#ff0033] flex items-center justify-center group-hover:bg-[#d9002b] transition-colors">
              <svg className="w-3.5 h-3.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0f0f0f]">
              Supasonic
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/studio"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[13px] font-medium text-[#0f0f0f] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio</span>
          </Link>

          <a
            href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0f0f0f] hover:bg-[#272727] text-white text-[12px] sm:text-[13px] font-semibold transition-colors"
          >
            <Bell className="w-3.5 h-3.5 hidden sm:block" />
            <span>Subscribe</span>
          </a>
        </div>
      </header>

      {/* ================================================================ */}
      {/* LOADING SKELETON                                                 */}
      {/* ================================================================ */}
      {loading && (
        <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-8 space-y-4">
            <div className="w-full aspect-video rounded-xl bg-[#f2f2f2]" />
            <div className="h-6 bg-[#f2f2f2] rounded w-3/4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2f2f2]" />
                <div className="h-4 w-36 bg-[#f2f2f2] rounded" />
              </div>
              <div className="h-9 w-48 bg-[#f2f2f2] rounded-full" />
            </div>
            <div className="h-28 bg-[#f2f2f2] rounded-xl" />
          </div>
          <div className="lg:col-span-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2.5">
                <div className="w-40 aspect-video rounded-lg bg-[#f2f2f2] flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-[#f2f2f2] rounded w-full" />
                  <div className="h-3 bg-[#f2f2f2] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PRIVATE / NOT FOUND GUARD                                        */}
      {/* ================================================================ */}
      {!loading && !currentTrack && (
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full rounded-2xl bg-[#f2f2f2] p-6 sm:p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-5 h-5 text-[#606060]" />
            </div>
            <h1 className="text-lg font-bold text-[#0f0f0f]">
              Track Not Public Yet
            </h1>
            <p className="text-sm text-[#606060]">
              {unavailableError ||
                "This release is currently private or scheduled. It will appear automatically as soon as it is published on YouTube."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0f0f0f] hover:bg-[#272727] text-white text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Public Catalog</span>
            </Link>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* YOUTUBE WATCH VIEWPORT                                           */}
      {/* ================================================================ */}
      {!loading && currentTrack && (
        <main className="max-w-[1600px] w-full mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-5 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: PLAYER + METADATA + DESCRIPTION (8 cols) */}
            <div className="lg:col-span-8 min-w-0">
              {/* Ambient Glow + 16:9 YouTube Player */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute -inset-4 rounded-3xl opacity-25 blur-3xl pointer-events-none"
                  style={{
                    backgroundImage: `url(${
                      currentTrack.thumbnail ||
                      `https://i.ytimg.com/vi/${currentTrack.videoId}/hqdefault.jpg`
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="relative w-full aspect-video sm:rounded-xl overflow-hidden bg-black shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentTrack.videoId}?rel=0&modestbranding=1`}
                    title={currentTrack.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>

              {/* Title, Channel & Action Pills */}
              <div className="px-3 sm:px-0 mt-3 sm:mt-4">
                <h1 className="text-base sm:text-[20px] font-bold text-[#0f0f0f] leading-snug">
                  {currentTrack.title}
                </h1>

                {/* Channel & Action Pill Row */}
                <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Channel Identity + Subscribe */}
                  <div className="flex items-center justify-between md:justify-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="/channel_avatar.jpg"
                        alt="Supasonic Beats"
                        className="w-10 h-10 rounded-full object-cover border border-black/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[15px] font-bold text-[#0f0f0f] truncate">
                            Supasonic Beats
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#606060] flex-shrink-0" />
                        </div>
                        <p className="text-xs text-[#606060] truncate">
                          @SupasonicBeatsOfficial
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#0f0f0f] hover:bg-[#272727] text-white text-[13px] font-semibold flex-shrink-0 transition-colors"
                    >
                      Subscribe
                    </a>
                  </div>

                  {/* YouTube Scrollable Action Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {/* Combined Like + Share pill */}
                    <div className="inline-flex items-center rounded-full bg-[#f2f2f2] divide-x divide-black/10 flex-shrink-0">
                      <button
                        onClick={handleToggleLike}
                        className={`inline-flex items-center gap-1.5 pl-3.5 pr-3 py-2 text-[13px] font-medium rounded-l-full hover:bg-[#e5e5e5] transition-colors ${
                          liked ? "text-[#ff0033] font-semibold" : "text-[#0f0f0f]"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                        />
                        <span>{likesCount.toLocaleString()}</span>
                      </button>

                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 pl-3 pr-3.5 py-2 text-[13px] font-medium rounded-r-full hover:bg-[#e5e5e5] text-[#0f0f0f] transition-colors"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => openDownloadFunnel("mp3")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[13px] font-medium text-[#0f0f0f] flex-shrink-0 transition-colors"
                    >
                      <Disc className="w-4 h-4 text-[#0f0f0f]" />
                      <span>320k MP3</span>
                    </button>

                    <button
                      onClick={() => openDownloadFunnel("wav")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ff0033] hover:bg-[#d9002b] text-white text-[13px] font-semibold flex-shrink-0 transition-colors"
                    >
                      <FileAudio className="w-4 h-4" />
                      <span>Studio WAV</span>
                    </button>

                    <button
                      onClick={handleCopyTags}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[13px] font-medium text-[#0f0f0f] flex-shrink-0 transition-colors"
                    >
                      {copiedTags ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Tags Copied</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-4 h-4" />
                          <span>Tags</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* YouTube Expandable Description & Audio Spec Box */}
                <div className="mt-3 rounded-xl bg-[#f2f2f2] p-3.5 sm:p-4 text-[13px] text-[#0f0f0f]">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold mb-1.5">
                    <span>{formatViews(currentTrack.views || 0)}</span>
                    <span>{currentTrack.formattedDate}</span>
                    <span className="text-[#065fd4]">
                      #{currentTrack.subgenre.replace(/\s+/g, "")}
                    </span>
                    <span className="text-[#606060] font-medium">
                      {currentTrack.bpm} BPM • {currentTrack.key} • {currentTrack.duration}
                    </span>
                  </div>

                  <p
                    className={`text-[#0f0f0f] whitespace-pre-line leading-relaxed ${
                      descExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {currentTrack.caption}
                  </p>

                  {descExpanded && (
                    <div className="mt-3 pt-3 border-t border-black/[0.08] space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="rounded-lg bg-white px-3 py-2">
                          <span className="block text-[10px] font-semibold uppercase text-[#606060]">
                            Tempo
                          </span>
                          <span className="text-xs font-bold">{currentTrack.bpm} BPM</span>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <span className="block text-[10px] font-semibold uppercase text-[#606060]">
                            Musical Key
                          </span>
                          <span className="text-xs font-bold">{currentTrack.key}</span>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <span className="block text-[10px] font-semibold uppercase text-[#606060]">
                            Mood
                          </span>
                          <span className="text-xs font-bold truncate block">
                            {currentTrack.mood}
                          </span>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2">
                          <span className="block text-[10px] font-semibold uppercase text-[#606060]">
                            Mastering
                          </span>
                          <span className="text-xs font-bold">52Hz Car Sub</span>
                        </div>
                      </div>

                      {currentTrack.seoData?.tagList &&
                        currentTrack.seoData.tagList.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#606060]">
                                Creator & Search Tags
                              </span>
                              <button
                                onClick={handleCopyTags}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#065fd4] hover:underline"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy all tags</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {currentTrack.seoData.tagList.slice(0, 12).map((t) => (
                                <span
                                  key={t}
                                  className="px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-[#0f0f0f]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={
                            currentTrack.youtubeUrl ||
                            `https://www.youtube.com/watch?v=${currentTrack.videoId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff0033] hover:underline"
                        >
                          <span>Watch directly on YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setDescExpanded((prev) => !prev)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0f0f0f] hover:underline"
                  >
                    {descExpanded ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>...more</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Below-Player Clean Showcase & Subscribe Banner */}
                <div className="mt-6 space-y-5">
                  <GoogleStyleAdBanner
                    format="leaderboard"
                    releases={ourRecommendations.slice(0, 6).map((r) => ({
                      id: r.id,
                      videoId: r.videoId,
                      title: r.title,
                      bpm: r.bpm,
                      key: r.key,
                      subgenre: r.subgenre,
                      thumbnail: r.thumbnail,
                    }))}
                  />
                  <SubscribeAdPoster />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AUTHENTIC YOUTUBE "UP NEXT" LIST (4 cols) */}
            <aside className="lg:col-span-4 px-3 sm:px-0 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                <button
                  onClick={() => setUpNextFilter("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap flex-shrink-0 ${
                    upNextFilter === "all" ? "yt-chip-active" : "yt-chip"
                  }`}
                >
                  All from Supasonic
                </button>
                <button
                  onClick={() => setUpNextFilter("same_bpm")}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap flex-shrink-0 ${
                    upNextFilter === "same_bpm" ? "yt-chip-active" : "yt-chip"
                  }`}
                >
                  Matching {currentTrack.bpm} BPM
                </button>
              </div>

              <div className="space-y-2.5">
                {filteredUpNext.length === 0 ? (
                  <div className="rounded-xl bg-[#f2f2f2] p-4 text-center space-y-2">
                    <p className="text-xs text-[#606060]">
                      No tracks found near {currentTrack.bpm} BPM in the current queue.
                    </p>
                    <button
                      onClick={() => setUpNextFilter("all")}
                      className="px-3.5 py-1.5 rounded-lg yt-chip-active text-xs font-medium"
                    >
                      Show all releases
                    </button>
                  </div>
                ) : (
                  filteredUpNext.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/watch/${rec.videoId}`}
                      className="flex gap-2.5 group items-start rounded-xl hover:bg-[#f2f2f2]/80 p-1.5 -mx-1.5 transition-colors"
                    >
                    {/* Locked 16:9 Mini Thumbnail (Zero overlay clutter) */}
                    <div className="relative w-40 sm:w-44 aspect-video rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={
                          rec.thumbnail ||
                          `https://i.ytimg.com/vi/${rec.videoId}/hqdefault.jpg`
                        }
                        alt={rec.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
                        {rec.duration || "3:20"}
                      </span>
                    </div>

                    {/* Clean 2-Line Metadata */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#0f0f0f] line-clamp-2 leading-snug group-hover:text-[#065fd4] transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-[12px] text-[#606060] mt-1 flex items-center gap-1 truncate">
                        <span>Supasonic Beats</span>
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      </p>
                      <p className="text-[12px] text-[#606060] truncate">
                        {formatViews(rec.views || 0)} • {rec.bpm} BPM • {rec.key}
                      </p>
                    </div>
                  </Link>
                )))}
              </div>
            </aside>
          </div>
        </main>
      )}

      <SocialLinksIsland />

      {unlockModal && (
        <SubscribeUnlockModal
          isOpen={unlockModal.isOpen}
          trackTitle={unlockModal.trackTitle}
          formatLabel={unlockModal.formatLabel}
          downloadUrl={unlockModal.downloadUrl}
          filename={unlockModal.filename}
          onClose={() => setUnlockModal(null)}
        />
      )}
    </div>
  );
}
