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
  onOpenSEO?: (post: FeedPost) => void;
  onOpenTip?: (post: FeedPost) => void;
  onPlayVideo?: (post: FeedPost) => void;
  subscriberCount?: string;
  videoCount?: string;
}

export default function TopRecentVideosCarousel({
  subscriberCount = "141+",
  videoCount = "98",
}: TopRecentVideosCarouselProps) {
  // Channel's Latest 5 Widescreen Non-Shorts Releases
  const latest5Videos = [
    {
      id: "vid-raatkanasha",
      videoId: "Wqdt2D61_Ss",
      title: "RAAT KA NASHA",
      subtitle: "Indian Afro House x Raga Techno x Deep House",
      subgenre: "Afro Raga Techno",
      bpm: 125,
      key: "F Minor",
      viewsFormatted: "New Release",
      views: 100,
      duration: "03:06",
      badge: "Featured Release",
      thumbnail: "https://i.ytimg.com/vi/Wqdt2D61_Ss/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/Wqdt2D61_Ss/hqdefault.jpg",
      caption:
        "Intoxicating 125 BPM late-night groove engineered with warm 52Hz car sub-bass, organic afro percussion, and seamless duet vocals.",
    },
    {
      id: "vid-aajphir",
      videoId: "UzLfMApeA-4",
      title: "AAJ PHIR",
      subtitle: "Deep House x Club Bangers x Afro House",
      subgenre: "Deep House",
      bpm: 125,
      key: "D Minor",
      viewsFormatted: "Latest Drop",
      views: 120,
      duration: "03:18",
      badge: "Latest Drop",
      thumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/UzLfMApeA-4/hqdefault.jpg",
      caption:
        "Classic Hindi sensual groove transformed into a sleek 125 BPM Deep House club mix crafted for late-night highway drives.",
    },
    {
      id: "vid-abaaja",
      videoId: "2wip8JYV7tQ",
      title: "AB AAJA",
      subtitle: "Indian Afro House x Club Bangers",
      subgenre: "VIP Club Bounce",
      bpm: 128,
      key: "D Minor",
      viewsFormatted: "624+ Views",
      views: 624,
      duration: "03:24",
      badge: "Trending Fast",
      thumbnail: "https://i.ytimg.com/vi/2wip8JYV7tQ/hqdefault.jpg",
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
      viewsFormatted: "341+ Views",
      views: 341,
      duration: "04:00",
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
      viewsFormatted: "496+ Views",
      views: 496,
      duration: "03:30",
      badge: "Fan Favorite",
      thumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/maxresdefault.jpg",
      hqThumbnail: "https://i.ytimg.com/vi/dscqPBwW8bw/hqdefault.jpg",
      caption:
        "Nostalgic Bollywood hook paired with driving 125 BPM deep house basslines and wide club reverb.",
    },
  ];

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
    }, 6000);
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

  return (
    <section
      aria-label="Latest 5 Releases Showcase"
      className="w-full space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Artist Identity Header Strip */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-white/90 shadow-sm flex-shrink-0">
            <img
              src="/channel_avatar.jpg"
              alt="Supasonic Beats"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-[#0b0f19] text-sm sm:text-base tracking-tight truncate">
                SUPASONIC BEATS
              </h1>
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 truncate">
              @SupasonicBeatsOfficial · {subscriberCount} Subscribers · {videoCount} Releases
            </p>
          </div>
        </div>

        <a
          href={subscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-center px-4 py-2 rounded-full liquid-btn-red font-semibold text-xs flex items-center gap-1.5 flex-shrink-0"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Subscribe on YouTube</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>

      {/* UNBLOCKED SPLIT-EDITORIAL HERO CAROUSEL (100% Clear Artwork on All Screens!) */}
      <div
        className="liquid-glass rounded-[28px] p-2.5 sm:p-3.5 space-y-3 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {latest5Videos.map((item) => {
              const isPlayingThis = inlinePlayingId === item.videoId;

              return (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-center"
                >
                  {/* Left: Pure 16:9 Artwork / YouTube Embed (ZERO Overlays Blocking the Image!) */}
                  <div className="lg:col-span-7 relative aspect-video w-full rounded-[20px] overflow-hidden bg-slate-950 shadow-sm border border-white/50">
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
                        className="relative w-full h-full cursor-pointer group/art"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/art:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.hqThumbnail;
                          }}
                        />

                        {/* Subtle Play Pill on Hover Only — Never Clutters Image on Mobile */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity bg-black/20">
                          <div className="w-12 h-12 rounded-full liquid-btn-red flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>

                        {/* Single Discreet Duration Pill */}
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-medium border border-white/15">
                          {item.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right (or Below on Mobile): Clean Editorial Info Panel */}
                  <div className="lg:col-span-5 flex flex-col justify-between px-1.5 sm:px-2 lg:py-3 lg:pr-3 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <span className="text-[#ff3b30]">{item.badge}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">{item.bpm} BPM</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">{item.key}</span>
                      </div>

                      <div>
                        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0b0f19] tracking-tight leading-tight">
                          {item.title}
                        </h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3 pt-1">
                        {item.caption}
                      </p>
                    </div>

                    {/* Clean Actions */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setInlinePlayingId(item.videoId)}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-full liquid-btn-red font-semibold text-xs flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play on YouTube</span>
                        </button>

                        <Link
                          href={`/watch/${item.videoId}`}
                          className="px-4 py-2.5 rounded-full liquid-pill text-[#0b0f19] font-semibold text-xs flex items-center gap-1.5"
                        >
                          <span>Details &amp; Stems</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setUnlockModal({
                              isOpen: true,
                              trackTitle: item.title,
                              formatLabel: "320 kbps Stereo MP3",
                              filename: `${item.title.replace(/\s+/g, "_")}_320kbps_SUPASONIC.mp3`,
                            })
                          }
                          className="px-3.5 py-1.5 rounded-full liquid-pill text-slate-700 hover:text-[#0b0f19] font-medium text-[11px] flex items-center gap-1.5"
                        >
                          <Download className="w-3 h-3 text-[#ff3b30]" />
                          <span>Download MP3</span>
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
                          className="px-3.5 py-1.5 rounded-full liquid-pill text-slate-700 hover:text-[#0b0f19] font-medium text-[11px] flex items-center gap-1.5"
                        >
                          <Sliders className="w-3 h-3 text-slate-600" />
                          <span>Car / DJ WAV</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Track Switcher & Prev/Next Bar */}
        <div className="pt-2 border-t border-white/70 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Latest 5 Releases ({currentIndex + 1} / {latest5Videos.length})
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Previous release"
                className="p-1.5 rounded-full liquid-pill text-slate-700 hover:text-[#0b0f19]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next release"
                className="p-1.5 rounded-full liquid-pill text-slate-700 hover:text-[#0b0f19]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {latest5Videos.map((video, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={video.id}
                  onClick={() => goToSlide(idx)}
                  className={`min-w-[145px] md:min-w-0 text-left p-2 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-white/95 ring-1 ring-[#ff3b30]/70 shadow-sm"
                      : "liquid-pill opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-1.5">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = video.hqThumbnail;
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1 px-0.5">
                    <span className={`text-[11px] font-semibold truncate ${isActive ? "text-[#0b0f19]" : "text-slate-700"}`}>
                      {idx + 1}. {video.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                      {video.bpm}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscribe-to-Unlock Download Sheet */}
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
