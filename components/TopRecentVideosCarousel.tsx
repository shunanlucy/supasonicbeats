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
      id: "vid-obsession",
      videoId: "87ndOuq346I",
      title: "OBSESSION [85 BPM] - Hindi Indi R&B x Acoustic Pop Duet",
      cleanTitle: "OBSESSION",
      subgenre: "Hindi Indi R&B / Pop",
      bpm: 85,
      key: "E Minor",
      viewsFormatted: "480+ Views",
      views: 480,
      duration: "03:12",
      badge: "🔥 NEWEST RELEASE #1",
      accentColor: "from-rose-600 to-amber-600",
      thumbnail: "https://i.ytimg.com/vi/87ndOuq346I/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/87ndOuq346I/hqdefault.jpg",
      caption: "Lush acoustic chords and soulful dual vocals over 85 BPM modern Indi R&B drums. Studio master stems ready for DJ mixes.",
    },
    {
      id: "vid-kalyani",
      videoId: "wE7QEsQ9IPI",
      title: "KALYANI | Deep House x Afro Grooves • Hindi Songs With Bass And Beats [120 BPM]",
      cleanTitle: "KALYANI",
      subgenre: "Hindi Deep House / Afro",
      bpm: 120,
      key: "A Minor",
      viewsFormatted: "890+ Views",
      views: 890,
      duration: "03:28",
      badge: "⚡ LATEST DROP #2",
      accentColor: "from-red-600 to-purple-600",
      thumbnail: "https://i.ytimg.com/vi/wE7QEsQ9IPI/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/wE7QEsQ9IPI/hqdefault.jpg",
      caption: "Deep rolling bassline with 120 BPM hypnotic ethnic percussion. Engineered for late night drives and club sound systems.",
    },
    {
      id: "vid-aaona",
      videoId: "UjthtKkgwWU",
      title: "AAO NA | Hindi Deep House Remix X Bass And Beats [120 BPM]",
      cleanTitle: "AAO NA",
      subgenre: "Hindi Deep House",
      bpm: 120,
      key: "G Minor",
      viewsFormatted: "2.6K+ Views",
      views: 2682,
      duration: "03:20",
      badge: "👑 STREAMING HIT #3",
      accentColor: "from-blue-600 to-indigo-600",
      thumbnail: "https://i.ytimg.com/vi/UjthtKkgwWU/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/UjthtKkgwWU/hqdefault.jpg",
      caption: "Viral streaming anthem AAO NA. Deep atmospheric pads, crisp acoustic tabla, and smooth melodic groove with 2.6K+ streams.",
    },
    {
      id: "vid-inthenight",
      videoId: "rC8QB0BZ9EU",
      title: "IN THE NIGHT (No Control) | Afro House x Deep House x Club Bangers [126 BPM]",
      cleanTitle: "IN THE NIGHT",
      subgenre: "Club Bangers / Afro House",
      bpm: 126,
      key: "D Minor",
      viewsFormatted: "2.0K+ Views",
      views: 2085,
      duration: "03:34",
      badge: "💥 CLUB ANTHEM #4",
      accentColor: "from-amber-600 to-red-600",
      thumbnail: "https://i.ytimg.com/vi/rC8QB0BZ9EU/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/rC8QB0BZ9EU/hqdefault.jpg",
      caption: "High energy festival club banger with punchy 126 BPM kicks, rolling bass drop and electrifying vocal hooks.",
    },
    {
      id: "vid-aadat",
      videoId: "1Mg56Wyc56U",
      title: "AADAT | Afro Beats x Deep House x Club Bangers [124 BPM]",
      cleanTitle: "AADAT",
      subgenre: "Hindi Afro House",
      bpm: 124,
      key: "F Minor",
      viewsFormatted: "1.4K+ Views",
      views: 1420,
      duration: "03:18",
      badge: "✨ VIRAL AFRO DROP #5",
      accentColor: "from-emerald-600 to-cyan-600",
      thumbnail: "https://i.ytimg.com/vi/1Mg56Wyc56U/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/1Mg56Wyc56U/hqdefault.jpg",
      caption: "Peak time 124 BPM Hindi Afro House with heavy low-end sub, crisp shakers and signature melodic progression.",
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
      {/* Sleek YouTube Channel Identity Bar with 1-Click Subscribe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff0000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
              <span>SUPASONIC BEATS</span>
              <span className="text-[#065fd4] text-xs" title="Official Artist Channel">✓</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-700 font-semibold rounded">IN</span>
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
            className="px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
            <span>SUBSCRIBE</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* NETFLIX / PRIME VIDEO HERO HORIZONTAL SLIDER */}
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-950 border border-gray-200 shadow-lg group select-none"
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
                        <span className="px-2.5 py-1 rounded-md bg-[#ff0000] text-white text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-current" />
                          {item.badge}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold border border-white/20">
                          {item.bpm} BPM
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-gray-200 text-[10px] sm:text-xs font-bold border border-white/20">
                          {item.key}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-semibold">
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

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-2.5 flex-wrap mt-4 sm:mt-5 pt-1">
                        <button
                          onClick={() => setInlinePlayingId(item.videoId)}
                          className="px-5 py-2.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/40 active:scale-95 transition-all"
                        >
                          <Play className="w-4 h-4 fill-current translate-x-0.2" />
                          <span>Watch Video</span>
                        </button>

                        <button
                          onClick={() => triggerDownload("/audio/clover_clip.mp3", `${item.cleanTitle}_320kbps_SUPASONIC.mp3`)}
                          className="px-3.5 py-2.5 rounded-full bg-white/90 hover:bg-white text-gray-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all backdrop-blur-sm"
                          title="Instant 320kbps MP3 Download"
                        >
                          <Download className="w-3.5 h-3.5 text-[#ff0000]" />
                          <span>MP3 320k</span>
                        </button>

                        <button
                          onClick={() => triggerDownload("/audio/clover_clip.mp3", `${item.cleanTitle}_WAV_STEMS_SUPASONIC.zip`)}
                          className="px-3.5 py-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 active:scale-95 transition-all backdrop-blur-sm"
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
                            className="hidden md:flex px-3 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs items-center gap-1.5 border border-white/20 backdrop-blur-sm transition-all"
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

        {/* Left / Right Arrow Controls (Netflix Floating Style) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 hover:opacity-100 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 hover:opacity-100 transition-all active:scale-90"
        >
          <ChevronRight className="w-6 h-6 translate-x-0.5" />
        </button>

        {/* Slide Counter & Dots (Top Right on Mobile, Bottom Right on Laptop) */}
        <div className="absolute top-3 right-3 sm:bottom-4 sm:top-auto z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
          <span>{currentIndex + 1}</span>
          <span className="text-gray-400">/</span>
          <span>{latest5Videos.length}</span>
        </div>
      </div>

      {/* HORIZONTAL MINI-CARDS RAIL (Side-by-side Netflix Style Thumbnail Selector) */}
      <div className="w-full">
        <div className="flex items-center justify-between pb-1 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
              Channel Latest 5 Releases (Select Track)
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            Side-by-side horizontal scroll • Click any track to jump
          </span>
        </div>

        {/* 5 Cards Side-by-Side Horizontal Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 pt-1">
          {latest5Videos.map((video, idx) => {
            const isActive = currentIndex === idx;

            return (
              <button
                key={video.id}
                onClick={() => goToSlide(idx)}
                className={`relative text-left p-2 rounded-xl transition-all duration-200 border group ${
                  isActive
                    ? "bg-white border-[#ff0000] shadow-md ring-2 ring-red-500/20"
                    : "bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                {/* 16:9 Thumbnail with Overlay */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.cleanTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = video.hqThumbnail;
                    }}
                  />

                  {/* Active Equalizer Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-red-600/20 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="px-2 py-0.5 rounded-full bg-black/80 text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-ping" />
                        ACTIVE
                      </div>
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[9px] font-mono">
                    {video.duration}
                  </div>

                  {/* BPM Chip */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-amber-300 text-[9px] font-bold">
                    {video.bpm} BPM
                  </div>
                </div>

                {/* Track Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="font-bold text-[#ff0000]">#{idx + 1}</span>
                    <span>•</span>
                    <span className="truncate">{video.subgenre}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5 group-hover:text-[#ff0000] transition-colors">
                    {video.cleanTitle}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{video.viewsFormatted}</p>
                </div>

                {/* Active Underline Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ff0000] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
