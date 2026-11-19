"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
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
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface TopRecentVideosCarouselProps {
  onOpenSEO?: (post: FeedPost) => void;
  onOpenTip?: (post: FeedPost) => void;
}

export default function TopRecentVideosCarousel({
  onOpenSEO,
  onOpenTip,
}: TopRecentVideosCarouselProps) {
  // 5 Real Recent/Top Releases from @SupasonicBeatsOfficial (100% Widescreen Videos, No Shorts)
  const recent5Videos = [
    {
      id: "vid-deedar-de",
      videoId: "BuvPDZawk9M",
      title: "DEEDAR DE | Hindi Afro House x Deep House Club Mix [124 BPM]",
      subgenre: "Hindi Afro House",
      bpm: 124,
      key: "F Minor",
      viewsFormatted: "5.7K Views",
      views: 5700,
      duration: "03:42",
      badge: "👑 #1 HIT RELEASE",
      thumbnail: "https://i.ytimg.com/vi/BuvPDZawk9M/hqdefault.jpg",
      caption: "All-time channel king! Produced in 124 BPM Hindi Afro House with 5,700+ streams. Studio master quality with deep 808 sub and signature groove.",
    },
    {
      id: "vid-raat-baki",
      videoId: "iXySpPM-wOc",
      title: "RAAT BAKI | Late Night Car Bass x Hindi Afro House [124 BPM]",
      subgenre: "Hindi Afro House",
      bpm: 124,
      key: "C Minor",
      viewsFormatted: "3.7K Views",
      views: 3717,
      duration: "03:15",
      badge: "🔥 ALL-TIME #2",
      thumbnail: "https://i.ytimg.com/vi/iXySpPM-wOc/hqdefault.jpg",
      caption: "Solid #2 hit with 3,717+ streams. Driving 124 BPM bassline for late-night drives and club systems.",
    },
    {
      id: "vid-aao-na",
      videoId: "nK_eWfB8Y_E",
      title: "AAO NA | Hindi Deep House Remix X Bass And Beats [120 BPM]",
      subgenre: "Deep House",
      bpm: 120,
      key: "G Minor",
      viewsFormatted: "2.6K Views",
      views: 2682,
      duration: "03:28",
      badge: "⚡ VIRAL STREAMER",
      thumbnail: "https://i.ytimg.com/vi/nK_eWfB8Y_E/hqdefault.jpg",
      caption: "Deep atmospheric pads, crisp acoustic tabla, and smooth melodic vocal chops.",
    },
    {
      id: "vid-madhosh",
      videoId: "ZhYEBZDrTcc",
      title: "MADHOSH | Hindi Afro House x Melodic Duet [124 BPM]",
      subgenre: "Hindi Afro House",
      bpm: 124,
      key: "F Minor",
      viewsFormatted: "1.9K Views",
      views: 1970,
      duration: "03:36",
      badge: "💥 EXPLODING SURGE",
      thumbnail: "https://i.ytimg.com/vi/ZhYEBZDrTcc/hqdefault.jpg",
      caption: "Explosive surge track MADHOSH with 1,970+ streams. Melodic male-female duet over driving 124 BPM afro beat.",
    },
    {
      id: "vid-majboor",
      videoId: "h7sJw_li4F0",
      title: "MAJBOOR (Duet Version) | Hindi Afro House x Romantic Club Beat [122 BPM]",
      subgenre: "Hindi Afro House",
      bpm: 122,
      key: "A# Minor",
      viewsFormatted: "1.5K Views",
      views: 1558,
      duration: "03:19",
      badge: "✨ DUET MASTER",
      thumbnail: "https://i.ytimg.com/vi/h7sJw_li4F0/hqdefault.jpg",
      caption: "Romantic club duet with lush chords, expressive vocals, and punchy kick transients.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const activeVideo = recent5Videos[activeIndex];
  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % recent5Videos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + recent5Videos.length) % recent5Videos.length);
  };

  return (
    <section aria-label="Recent 5 Videos Hero Carousel" className="w-full space-y-4 pt-2">
      {/* Sleek Modern Bright Topbar (Channel Identity & 1-Click Subscribe) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm">
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
              <span>78 videos</span>
              <span>•</span>
              <span>46,000+ views</span>
            </div>
          </div>
        </div>

        {/* 1-Click YouTube Subscribe Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>SUBSCRIBE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Showcase: Left Cinema Player + Right Side Carousel */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Cinema Video Player Stage (Left 7-8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            {/* 16:9 Active Responsive Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-gray-200 group">
              <iframe
                key={activeVideo.videoId}
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-cover"
              />

              {/* Status Top Badge */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white font-bold text-[10px] tracking-wide uppercase flex items-center gap-1.5 backdrop-blur-md shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PLAYING RECENT #{activeIndex + 1}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/75 text-white font-mono text-[10px] font-bold backdrop-blur-md">
                  {activeVideo.bpm} BPM
                </span>
              </div>

              {/* Sound Toggle Overlay Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/75 hover:bg-black text-white backdrop-blur-md transition-all shadow"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Playing Track Details & Direct Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-[#ff0000] font-bold text-[11px] border border-red-200">
                    {activeVideo.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[11px] font-semibold">
                    {activeVideo.key}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {activeVideo.viewsFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                  <span>Track {activeIndex + 1} of 5</span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-snug">
                {activeVideo.title}
              </h2>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {activeVideo.caption}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Link
                  href={`/watch/${activeVideo.videoId}`}
                  className="px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Full Watch Page
                </Link>

                <a
                  href="/audio/clover_clip.mp3"
                  download={`${activeVideo.title.replace(/[^a-zA-Z0-9]/g, "_")}_320kbps.mp3`}
                  className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gray-700" />
                  320kbps MP3
                </a>

                <a
                  href="/audio/clover_clip.mp3"
                  download={`${activeVideo.title.replace(/[^a-zA-Z0-9]/g, "_")}_StudioMaster.wav`}
                  className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-gray-700" />
                  Studio WAV
                </a>

                <button
                  onClick={() => {
                    if (onOpenSEO) {
                      onOpenSEO({
                        id: activeVideo.id,
                        type: "release",
                        videoId: activeVideo.videoId,
                        title: activeVideo.title,
                        subgenre: activeVideo.subgenre,
                        bpm: activeVideo.bpm,
                        key: activeVideo.key,
                        mood: "Club Punch",
                        publishedAt: new Date().toISOString(),
                        formattedDate: "Just now",
                        views: activeVideo.views,
                        likes: Math.round(activeVideo.views * 0.08),
                        comments: 42,
                        duration: activeVideo.duration,
                        thumbnail: activeVideo.thumbnail,
                        caption: activeVideo.caption,
                      });
                    }
                  }}
                  className="px-3.5 py-2 rounded-full bg-red-50 hover:bg-red-100 text-[#ff0000] border border-red-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  SEO Tags
                </button>
              </div>
            </div>
          </div>

          {/* Side Carousel Playlist (Right 4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff0000]" />
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Recent 5 Videos Carousel
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                  title="Previous Video"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                  title="Next Video"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of 5 Recent Videos (Click to Switch Active Player) */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {recent5Videos.map((video, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 group ${
                      isActive
                        ? "bg-red-50/70 border-red-300 shadow-sm ring-1 ring-red-400"
                        : "bg-gray-50/70 hover:bg-gray-100/80 border-gray-200"
                    }`}
                  >
                    {/* Thumbnail Slot */}
                    <div className="relative w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0 shadow-sm">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black/85 text-white px-1 rounded font-bold">
                        {video.duration}
                      </span>
                      {isActive && (
                        <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white text-red-600 flex items-center justify-center shadow">
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.2" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            isActive
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] text-gray-600 font-mono font-semibold">
                          {video.bpm} BPM
                        </span>
                        {isActive && (
                          <span className="text-[9px] text-[#ff0000] font-bold uppercase tracking-wider animate-pulse">
                            ● PLAYING
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-xs font-bold truncate leading-snug ${
                          isActive ? "text-red-700" : "text-gray-900 group-hover:text-black"
                        }`}
                      >
                        {video.title}
                      </h4>

                      <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                        <span>{video.viewsFormatted}</span>
                        <span>•</span>
                        <span className="truncate">{video.subgenre}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
