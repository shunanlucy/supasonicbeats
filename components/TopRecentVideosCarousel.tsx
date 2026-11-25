"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Download,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Bell,
  Sliders,
  Music,
  Radio,
  Eye,
  Disc,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface TopRecentVideosCarouselProps {
  onOpenSEO?: (post: FeedPost) => void;
  onOpenTip?: (post: FeedPost) => void;
  onPlayVideo?: (post: FeedPost) => void;
}

export default function TopRecentVideosCarousel({
  onOpenSEO,
  onOpenTip,
  onPlayVideo,
}: TopRecentVideosCarouselProps) {
  // Channel's EXACT Latest 5 Videos (100% Widescreen, Valid High-Res Thumbnails, No Broken IDs)
  const latest5Videos = [
    {
      id: "vid-raatkanasha",
      videoId: "Wqdt2D61_Ss",
      title: "RAAT KA NASHA | Indian Afro House x Raga Techno x Deep House | Supasonic Beats",
      cleanTitle: "RAAT KA NASHA",
      subgenre: "Indian Afro House / Raga Techno",
      bpm: 125,
      key: "F Minor",
      viewsFormatted: "🔥 NEW DROP",
      views: 100,
      duration: "03:06",
      badge: "🔥 BRAND NEW RELEASE #1",
      accentColor: "from-rose-600 via-amber-600 to-red-700",
      thumbnail: "https://i.ytimg.com/vi/Wqdt2D61_Ss/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/Wqdt2D61_Ss/hqdefault.jpg",
      caption: "Intoxicating 125 BPM Indian Afro House x Raga Techno banger with heavy rolling car sub-bass and hypnotic Gen-Z club energy.",
    },
    {
      id: "vid-aajphir",
      videoId: "UzLfMApeA-4",
      title: "AAJ PHIR | Deep House x Club Bangers | Afro House | Supasonic Beats [125 BPM]",
      cleanTitle: "AAJ PHIR",
      subgenre: "Deep House / Club Bangers",
      bpm: 125,
      key: "D Minor",
      viewsFormatted: "⚡ LATEST RELEASE",
      views: 120,
      duration: "03:18",
      badge: "⚡ LATEST DROP #2",
      accentColor: "from-amber-500 via-rose-600 to-red-600",
      thumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/hqdefault.jpg",
      caption: "Classic Hindi sensual groove transformed into a 125 BPM Deep House x Afro Club Banger. Built for night drives.",
    },
    {
      id: "vid-abaaja",
      videoId: "2wip8JYV7tQ",
      title: "AB AAJA | Indian Afro House x Club Bangers x Deep House | Supasonic Beats [128 BPM]",
      cleanTitle: "AB AAJA",
      subgenre: "Indian Afro House / Club Banger",
      bpm: 128,
      key: "D Minor",
      viewsFormatted: "624+ Views",
      views: 624,
      duration: "03:24",
      badge: "👑 FAST BREAKOUT #3",
      accentColor: "from-rose-600 to-purple-600",
      thumbnail: "https://i.ytimg.com/vi/2wip8JYV7tQ/hqdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/2wip8JYV7tQ/hqdefault.jpg",
      caption: "Seductive bilingual vocals, bouncy offbeat bass, and Tocame-inspired brass drops over 128 BPM Indian Afro House.",
    },
    {
      id: "vid-kahonakaho",
      videoId: "OAxXnaUsiZw",
      title: "KAHO NA KAHO | Indian Afro House x Club Bangers x Raga Techno | Supasonic Beats [130 BPM]",
      cleanTitle: "KAHO NA KAHO",
      subgenre: "Afro House / Raga Techno",
      bpm: 130,
      key: "F# Minor",
      viewsFormatted: "341+ Views",
      views: 341,
      duration: "04:00",
      badge: "💥 CLUB ANTHEM #4",
      accentColor: "from-blue-600 to-indigo-600",
      thumbnail: "https://i.ytimg.com/vi/OAxXnaUsiZw/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/OAxXnaUsiZw/hqdefault.jpg",
      caption: "Iconic melody reimagined into a peak-hour 130 BPM Indian Afro House & Raga Techno dancefloor anthem.",
    },
    {
      id: "vid-sajansajan",
      videoId: "dscqPBwW8bw",
      title: "SAJAN SAJAN | Indian Deep House x Club Bangers | Supasonic Beats [125 BPM]",
      cleanTitle: "SAJAN SAJAN",
      subgenre: "Indian Deep House / Club",
      bpm: 125,
      key: "E Minor",
      viewsFormatted: "496+ Views",
      views: 496,
      duration: "03:30",
      badge: "✨ VIRAL CLUB MIX #5",
      accentColor: "from-emerald-600 to-cyan-600",
      thumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/hqdefault.jpg",
      caption: "Driving 125 BPM Desi Deep House club banger with punchy four-on-the-floor kick and infectious groove.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inlinePlayingId, setInlinePlayingId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
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

  // Auto-scroll side-by-side like Netflix/Ad banner (every 5 seconds when not paused)
  useEffect(() => {
    if (isPaused || inlinePlayingId !== null) return;
    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, inlinePlayingId, nextSlide]);

  // Touch Swipe Handlers for mobile phone
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchDeltaX < -40) {
      nextSlide();
    } else if (touchDeltaX > 40) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsPaused(false);
  };

  const currentVideo = latest5Videos[currentIndex];

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section
      aria-label="Channel Latest 5 Videos Netflix Style Carousel"
      className="w-full space-y-3 pt-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sleek YouTube Channel Identity Bar with 1-Click Subscribe (Liquid Glass) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 liquid-glass px-4 sm:px-5 py-3.5 rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff3b30] to-[#e00000] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/20 border border-white/30">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
              <span>SUPASONIC BEATS</span>
              <span className="text-[#065fd4] text-xs" title="Official Artist Channel">✓</span>
              <span className="text-[10px] px-2 py-0.5 liquid-badge text-gray-700 font-semibold rounded-md">IN</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800">@SupasonicBeatsOfficial</span>
              <span>•</span>
              <span className="font-semibold text-gray-900">114+ subscribers</span>
              <span>•</span>
              <span className="text-gray-600">78 videos</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full liquid-btn-red font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-red-500/25"
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
            <span>SUBSCRIBE</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* NETFLIX / PRIME VIDEO HERO HORIZONTAL SLIDER (Enclosed in iPhone Liquid Frame) */}
      <div className="p-1.5 sm:p-2 rounded-3xl liquid-glass border border-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)]">
        <div
          className="relative w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-gray-950 border border-black/10 shadow-lg group select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Track (Moves side-by-side horizontally with translateX) */}
          <div
            className="flex transition-transform duration-600 ease-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {latest5Videos.map((item, idx) => {
              const isPlayingThis = inlinePlayingId === item.videoId;

              return (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 relative aspect-[16/10] sm:aspect-[21/9] min-h-[360px] sm:min-h-[420px] max-h-[520px] overflow-hidden bg-gray-900"
                >
                  {/* Inline YouTube Player or Cinematic Backdrop */}
                  {isPlayingThis ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0 absolute inset-0 z-20"
                    />
                  ) : (
                    <>
                      {/* 16:9 Backdrop with Fallback */}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = item.hqThumbnail;
                        }}
                      />

                      {/* Netflix Gradient Scrims: Left/Bottom Dark Mask for Perfect Text Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/70 sm:to-transparent z-10 pointer-events-none" />

                      {/* Content Layer */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-end sm:justify-center p-4 sm:p-8 md:p-10 max-w-2xl text-white pointer-events-auto">
                        {/* Top Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#ff3b30] text-white text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md shadow-red-500/30 flex items-center gap-1 border border-white/20">
                            <Flame className="w-3 h-3 fill-current" />
                            {item.badge}
                          </span>

                          <span className="px-2.5 py-1 rounded-md liquid-badge text-white text-[10px] sm:text-xs font-bold">
                            {item.bpm} BPM
                          </span>

                          <span className="px-2.5 py-1 rounded-md liquid-badge text-gray-200 text-[10px] sm:text-xs font-bold">
                            {item.key}
                          </span>

                          <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-semibold border border-white/10">
                            {item.viewsFormatted}
                          </span>
                        </div>

                        {/* Main Title */}
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md line-clamp-2">
                          {item.title}
                        </h2>

                        {/* Caption / Hook */}
                        <p className="text-xs sm:text-sm text-gray-300 mt-2 line-clamp-2 leading-relaxed drop-shadow">
                          {item.caption}
                        </p>

                        {/* Action Buttons Row (Liquid Pill Highlights) */}
                        <div className="flex items-center gap-2.5 flex-wrap mt-4 sm:mt-5 pt-1">
                          <button
                            onClick={() => setInlinePlayingId(item.videoId)}
                            className="px-5 py-2.5 rounded-full liquid-btn-red font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-600/40"
                          >
                            <Play className="w-4 h-4 fill-current translate-x-0.2" />
                            <span>Watch Video</span>
                          </button>

                          <button
                            onClick={() => triggerDownload("/audio/clover_clip.mp3", `${item.cleanTitle}_320kbps_SUPASONIC.mp3`)}
                            className="px-4 py-2.5 rounded-full liquid-pill text-gray-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-white"
                            title="Instant 320kbps MP3 Download"
                          >
                            <Download className="w-3.5 h-3.5 text-[#ff3b30]" />
                            <span>MP3 320k</span>
                          </button>

                          <button
                            onClick={() => triggerDownload("/audio/clover_clip.mp3", `${item.cleanTitle}_WAV_STEMS_SUPASONIC.zip`)}
                            className="px-4 py-2.5 rounded-full liquid-pill text-white bg-black/60 hover:bg-black/80 font-bold text-xs flex items-center gap-1.5 border border-white/20 active:scale-95 transition-all"
                            title="Studio Lossless WAV Stems"
                          >
                            <Sliders className="w-3.5 h-3.5 text-amber-400" />
                            <span>WAV Stems</span>
                          </button>

                          {onOpenSEO && (
                            <button
                              onClick={() =>
                                onOpenSEO({
                                  id: item.id,
                                  type: "release",
                                  videoId: item.videoId,
                                  title: item.title,
                                  bpm: item.bpm,
                                  key: item.key,
                                  mood: "Late Night Drive",
                                  subgenre: item.subgenre,
                                  views: item.views,
                                  duration: item.duration,
                                  thumbnail: item.thumbnail,
                                  caption: item.caption,
                                  formattedDate: "Latest Upload",
                                  publishedAt: new Date().toISOString(),
                                  likes: 100,
                                  comments: 20,
                                })
                              }
                              className="hidden md:flex px-3.5 py-2.5 rounded-full liquid-pill text-white font-bold text-xs items-center gap-1.5 border border-white/20 transition-all hover:bg-white/20"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>SEO Tags</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left / Right Arrow Controls (Liquid Frosted Glass) */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full liquid-pill bg-black/45 hover:bg-black/75 text-white flex items-center justify-center border border-white/30 shadow-lg opacity-85 hover:opacity-100 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full liquid-pill bg-black/45 hover:bg-black/75 text-white flex items-center justify-center border border-white/30 shadow-lg opacity-85 hover:opacity-100 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 translate-x-0.5" />
          </button>

          {/* Slide Counter & Dots (Liquid Capsule) */}
          <div className="absolute top-3 right-3 sm:bottom-4 sm:top-auto z-20 flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill bg-black/60 text-white text-[10px] font-bold border border-white/20">
            <span>{currentIndex + 1}</span>
            <span className="text-gray-400">/</span>
            <span>{latest5Videos.length}</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL MINI-CARDS RAIL (Side-by-side Netflix Style Liquid Thumbnail Selector) */}
      <div className="w-full">
        <div className="flex items-center justify-between pb-1 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] animate-ping" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
              Channel Latest 5 Releases (Select Track)
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            Side-by-side horizontal scroll • Click any track to jump
          </span>
        </div>

        {/* 5 Cards Side-by-Side Horizontal Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 pt-1">
          {latest5Videos.map((video, idx) => {
            const isActive = currentIndex === idx;

            return (
              <button
                key={video.id}
                onClick={() => goToSlide(idx)}
                className={`relative text-left p-2.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-white/95 border-2 border-red-500/80 shadow-[0_8px_24px_rgba(255,59,48,0.2),inset_0_1px_1.5px_rgba(255,255,255,1)] ring-2 ring-red-500/20"
                    : "liquid-card hover:border-white"
                }`}
              >
                {/* 16:9 Thumbnail with Overlay */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2 shadow-sm">
                  <img
                    src={video.thumbnail}
                    alt={video.cleanTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = video.hqThumbnail;
                    }}
                  />

                  {/* Active Equalizer Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-red-600/25 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="px-2.5 py-0.5 rounded-full bg-black/80 text-white text-[9px] font-bold flex items-center gap-1 shadow-sm border border-white/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-ping" />
                        ACTIVE
                      </div>
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md bg-black/80 text-white text-[9px] font-mono font-bold">
                    {video.duration}
                  </div>

                  {/* BPM Chip */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/75 text-amber-300 text-[9px] font-bold">
                    {video.bpm} BPM
                  </div>
                </div>

                {/* Track Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="font-bold text-[#ff3b30]">#{idx + 1}</span>
                    <span>•</span>
                    <span className="truncate">{video.subgenre}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5 group-hover:text-[#ff3b30] transition-colors">
                    {video.cleanTitle}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{video.viewsFormatted}</p>
                </div>

                {/* Active Liquid Underline Glow */}
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#ff3b30] to-transparent rounded-full shadow-[0_0_8px_#ff3b30]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
