"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bell,
  Sliders,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";
import SubscribeUnlockModal from "./SubscribeUnlockModal";

interface TopRecentVideosCarouselProps {
  releases?: FeedPost[];
  activeTab?: string;
  onSelectTab?: (tab: "home" | "releases" | "vault" | "license") => void;
  onOpenSEO?: (post: FeedPost) => void;
  onOpenTip?: (post: FeedPost) => void;
  onPlayVideo?: (post: FeedPost) => void;
  subscriberCount?: string;
  videoCount?: string;
}

export default function TopRecentVideosCarousel({
  releases = [],
  activeTab = "home",
  onSelectTab,
  subscriberCount = "141+",
  videoCount = "98",
}: TopRecentVideosCarouselProps) {
  const fallbackPublic5 = [
    {
      id: "vid-aajphir",
      videoId: "UzLfMApeA-4",
      title: "AAJ PHIR",
      subtitle: "Deep House x Club Bangers x Afro House",
      subgenre: "Deep House",
      bpm: 125,
      key: "D Minor",
      viewsFormatted: "353+ views",
      views: 353,
      duration: "3:18",
      badge: "Latest Upload",
      thumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/hqdefault.jpg",
      caption:
        "Classic Hindi sensual groove transformed into a 125 BPM Deep House club mix crafted for late-night highway drives.",
    },
    {
      id: "vid-abaaja",
      videoId: "2wip8JYV7tQ",
      title: "AB AAJA",
      subtitle: "Indian Afro House x Club Bangers",
      subgenre: "VIP Club Bounce",
      bpm: 128,
      key: "D Minor",
      viewsFormatted: "724+ views",
      views: 724,
      duration: "3:24",
      badge: "Trending",
      thumbnail: "https://i.ytimg.com/vi/2wip8JYV7tQ/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/2wip8JYV7tQ/hqdefault.jpg",
      caption:
        "Bilingual VIP club bounce featuring sharp brass stabs, tight four-on-the-floor kick, and bouncy offbeat sub-bass.",
    },
    {
      id: "vid-kahonakaho",
      videoId: "OAxXnaUsiZw",
      title: "KAHO NA KAHO",
      subtitle: "Indian Afro House x Raga Techno",
      subgenre: "Raga Techno",
      bpm: 130,
      key: "F# Minor",
      viewsFormatted: "356+ views",
      views: 356,
      duration: "4:00",
      badge: "Club Edition",
      thumbnail: "https://i.ytimg.com/vi/OAxXnaUsiZw/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/OAxXnaUsiZw/hqdefault.jpg",
      caption:
        "Iconic Middle-Eastern Spanish melody fused with peak-hour 130 BPM tribal drums and crisp Raga Techno synths.",
    },
    {
      id: "vid-sajansajan",
      videoId: "dscqPBwW8bw",
      title: "SAJAN SAJAN",
      subtitle: "Indian Deep House x Club Bangers",
      subgenre: "Desi Deep House",
      bpm: 125,
      key: "E Minor",
      viewsFormatted: "510+ views",
      views: 510,
      duration: "3:30",
      badge: "Popular",
      thumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/hqdefault.jpg",
      caption:
        "Nostalgic Bollywood hook paired with driving 125 BPM deep house basslines and wide club reverb.",
    },
    {
      id: "vid-saheba",
      videoId: "cOTpVBWmL3U",
      title: "SAHEBA (Extended)",
      subtitle: "Indian Afro House x Deep House",
      subgenre: "Extended Club Mix",
      bpm: 124,
      key: "F Minor",
      viewsFormatted: "508+ views",
      views: 508,
      duration: "6:57",
      badge: "Extended Mix",
      thumbnail: "https://i.ytimg.com/vi/cOTpVBWmL3U/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/cOTpVBWmL3U/hqdefault.jpg",
      caption:
        "Smooth extended club mix built for uninterrupted late-night drives and warm car bass systems.",
    },
  ];

  const latest5Videos =
    releases && releases.length > 0
      ? releases.slice(0, 5).map((r, i) => {
          const parts = r.title.split("|").map((s) => s.trim());
          const cleanName = parts[0].replace(/\[.*?\]/g, "").trim();
          const subTitle =
            parts
              .slice(1)
              .filter((p) => !p.toLowerCase().includes("supasonic"))
              .join(" · ") || r.subgenre;
          const badges = ["Latest Upload", "Trending", "Club Mix", "Popular", "Extended"];
          const vidId = r.videoId || r.id;
          return {
            id: r.id,
            videoId: vidId,
            title: cleanName,
            subtitle: subTitle,
            subgenre: r.subgenre,
            bpm: r.bpm,
            key: r.key,
            viewsFormatted: `${r.views.toLocaleString()} views`,
            views: r.views,
            duration: r.duration || "3:24",
            badge: badges[i] || "Release",
            thumbnail:
              vidId === "Wqdt2D61_Ss"
                ? "/thumbs/raat_ka_nasha.jpg"
                : `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`,
            hqThumbnail:
              vidId === "Wqdt2D61_Ss"
                ? "/thumbs/raat_ka_nasha.jpg"
                : `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
            caption: r.caption,
          };
        })
      : fallbackPublic5;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inlinePlayingId, setInlinePlayingId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    filename: string;
  } | null>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  const nextSlide = useCallback(() => {
    setInlinePlayingId(null);
    setCurrentIndex((prev) => (prev + 1) % latest5Videos.length);
  }, [latest5Videos.length]);

  const prevSlide = useCallback(() => {
    setInlinePlayingId(null);
    setCurrentIndex((prev) => (prev - 1 + latest5Videos.length) % latest5Videos.length);
  }, [latest5Videos.length]);

  const goToSlide = (idx: number) => {
    setInlinePlayingId(null);
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused || inlinePlayingId !== null) return;
    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, inlinePlayingId, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchDeltaX < -40) nextSlide();
    else if (touchDeltaX > 40) prevSlide();
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsPaused(false);
  };

  const activeItem = latest5Videos[currentIndex] || latest5Videos[0];

  return (
    <section
      aria-label="YouTube Channel Showcase and Featured Releases"
      className="w-full space-y-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. AUTHENTIC YOUTUBE CHANNEL HEADER (Banner + Profile Row + Channel Tabs) */}
      <div className="space-y-4">
        {/* Clean Rounded Widescreen Channel Banner (Matching YouTube Desktop/App) */}
        <div className="relative w-full h-24 sm:h-36 md:h-44 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900">
          <img
            src="/channel_banner.jpg"
            alt="Supasonic Beats Channel Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* YouTube Channel Avatar + Metadata + Subscribe Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-1">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-[#f2f2f2] flex-shrink-0 border border-black/10">
              <img
                src="/channel_avatar.jpg"
                alt="SUPASONIC BEATS"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#0f0f0f] tracking-tight truncate">
                  SUPASONIC BEATS
                </h1>
                <CheckCircle2 className="w-4 h-4 text-[#606060] flex-shrink-0" />
              </div>

              <div className="text-xs sm:text-sm text-[#606060] flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="font-medium text-[#0f0f0f]">@SupasonicBeatsOfficial</span>
                <span>•</span>
                <span>{subscriberCount} subscribers</span>
                <span>•</span>
                <span>{videoCount} videos</span>
              </div>

              <p className="text-xs text-[#606060] line-clamp-1 max-w-xl hidden sm:block">
                Official studio portal for 124–128 BPM Hindi Afro House, Deep House &amp; Car Audio Masters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full yt-btn-dark font-medium text-xs sm:text-sm flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Subscribe</span>
            </a>

            <a
              href="https://www.youtube.com/@SupasonicBeatsOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full yt-chip font-medium text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#606060]" />
            </a>
          </div>
        </div>

        {/* Authentic YouTube Channel Navigation Underline Tabs */}
        {onSelectTab && (
          <div className="flex items-center gap-6 border-b border-black/10 overflow-x-auto no-scrollbar px-1">
            {[
              { id: "home", label: "Home" },
              { id: "releases", label: "Videos" },
              { id: "vault", label: "Studio Vault" },
              { id: "license", label: "Creators & Stems" },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTab(t.id as any)}
                  className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-[#0f0f0f] text-[#0f0f0f] font-semibold"
                      : "border-transparent text-[#606060] hover:text-[#0f0f0f]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. YOUTUBE CHANNEL SPOTLIGHT ("For You" / Ambient Split Carousel Player) */}
      <div
        className="relative rounded-2xl bg-[#f9f9f9] border border-black/[0.06] p-3 sm:p-4 space-y-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle YouTube Ambient Glow matched to active video */}
        <div className="pointer-events-none absolute -top-24 left-10 w-80 h-60 rounded-full bg-rose-500/[0.06] blur-3xl animate-water-pulse" />

        <div className="relative z-10 overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {latest5Videos.map((item) => {
              const isPlayingThis = inlinePlayingId === item.videoId;

              return (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center"
                >
                  {/* Unobstructed 16:9 YouTube Player / Artwork Frame */}
                  <div className="lg:col-span-6 xl:col-span-5 relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                    {isPlayingThis ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0 absolute inset-0"
                      />
                    ) : (
                      <div
                        onClick={() => setInlinePlayingId(item.videoId)}
                        className="absolute inset-0 w-full h-full cursor-pointer group/art"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/art:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.hqThumbnail;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity bg-black/25">
                          <div className="w-12 h-12 rounded-full bg-black/80 text-white flex items-center justify-center">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[11px] font-medium">
                          {item.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* YouTube Channel Trailer / Featured Details Column */}
                  <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#606060]">
                        <span className="px-2 py-0.5 rounded bg-[#ff0033]/10 text-[#ff0033] font-semibold text-[11px]">
                          {item.badge}
                        </span>
                        <span>•</span>
                        <span>{item.viewsFormatted}</span>
                        <span>•</span>
                        <span className="font-mono">{item.bpm} BPM</span>
                      </div>

                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0f0f0f] leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-xs text-[#606060] font-medium">{item.subtitle}</p>

                      <p className="text-xs sm:text-sm text-[#606060] leading-relaxed line-clamp-2 pt-1 max-w-2xl">
                        {item.caption}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setInlinePlayingId(item.videoId)}
                        className="px-4 py-2 rounded-full liquid-btn-red font-medium text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </button>

                      <Link
                        href={`/watch/${item.videoId}`}
                        className="px-4 py-2 rounded-full yt-chip font-medium text-xs sm:text-sm flex items-center gap-1"
                      >
                        <span>Watch Page</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#606060]" />
                      </Link>

                      <button
                        onClick={() =>
                          setUnlockModal({
                            isOpen: true,
                            trackTitle: item.title,
                            formatLabel: "320 kbps Stereo MP3",
                            filename: `${item.title.replace(/\s+/g, "_")}_320kbps_SUPASONIC.mp3`,
                          })
                        }
                        className="px-3.5 py-2 rounded-full yt-chip font-medium text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#ff0033]" />
                        <span>MP3</span>
                      </button>

                      <button
                        onClick={() =>
                          setUnlockModal({
                            isOpen: true,
                            trackTitle: item.title,
                            formatLabel: "Studio 48kHz Master WAV",
                            filename: `${item.title.replace(/\s+/g, "_")}_StudioMaster_SUPASONIC.wav`,
                          })
                        }
                        className="px-3.5 py-2 rounded-full yt-chip font-medium text-xs flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#606060]" />
                        <span>WAV</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom YouTube Shelf Track Selector (Locked 16:9 Ratios, No Vertical Stretching) */}
        <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0f0f0f]">
              Recent Releases ({currentIndex + 1} / {latest5Videos.length})
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Previous video"
                className="p-1.5 rounded-full yt-chip text-[#0f0f0f]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next video"
                className="p-1.5 rounded-full yt-chip text-[#0f0f0f]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start md:grid md:grid-cols-5 gap-3 overflow-x-auto no-scrollbar pb-1">
            {latest5Videos.map((video, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={video.id}
                  onClick={() => goToSlide(idx)}
                  className={`flex flex-col items-stretch justify-start w-[152px] sm:w-[175px] md:w-full h-auto text-left rounded-xl p-1.5 transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-white ring-1 ring-[#0f0f0f] shadow-sm"
                      : "hover:bg-white/80 opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-1.5 flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = video.hqThumbnail;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white font-mono text-[10px]">
                      {video.duration}
                    </span>
                  </div>
                  <div className="w-full px-0.5 space-y-0.5">
                    <div className="text-xs font-semibold text-[#0f0f0f] truncate">
                      {video.title}
                    </div>
                    <div className="text-[11px] text-[#606060] truncate">
                      {video.viewsFormatted} • {video.bpm} BPM
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {unlockModal && (
        <SubscribeUnlockModal
          isOpen={unlockModal.isOpen}
          trackTitle={unlockModal.trackTitle}
          formatLabel={unlockModal.formatLabel}
          downloadUrl="/audio/clover_clip.mp3"
          filename={unlockModal.filename}
          onClose={() => setUnlockModal(null)}
        />
      )}
    </section>
  );
}
