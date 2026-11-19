"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  ExternalLink,
  Info,
  X,
  Star,
  Flame,
  CheckCircle2,
  Volume2,
} from "lucide-react";

interface GoogleAdItem {
  id: string;
  title: string;
  bpm: number;
  key: string;
  genre: string;
  views: number;
  videoId: string;
  posterUrl: string;
}

interface GoogleStyleAdBannerProps {
  format?: "leaderboard" | "billboard" | "rectangle" | "anchor";
  className?: string;
}

export default function GoogleStyleAdBanner({
  format = "leaderboard",
  className = "",
}: GoogleStyleAdBannerProps) {
  // Official 16:9 Widescreen Hit Videos (Zero Shorts)
  const officialAdVideos: GoogleAdItem[] = [
    {
      id: "ad-deedar",
      title: "DEEDAR DE",
      bpm: 124,
      key: "F Minor",
      genre: "Hindi Afro House",
      views: 5700,
      videoId: "BuvPDZawk9M",
      posterUrl: "https://i.ytimg.com/vi/BuvPDZawk9M/hqdefault.jpg",
    },
    {
      id: "ad-raatbaki",
      title: "RAAT BAKI",
      bpm: 124,
      key: "C Minor",
      genre: "Late Night Car Bass",
      views: 3717,
      videoId: "iXySpPM-wOc",
      posterUrl: "https://i.ytimg.com/vi/iXySpPM-wOc/hqdefault.jpg",
    },
    {
      id: "ad-aaona",
      title: "AAO NA",
      bpm: 120,
      key: "G Minor",
      genre: "Deep House",
      views: 2682,
      videoId: "nK_eWfB8Y_E",
      posterUrl: "https://i.ytimg.com/vi/nK_eWfB8Y_E/hqdefault.jpg",
    },
    {
      id: "ad-madhosh",
      title: "MADHOSH",
      bpm: 124,
      key: "F Minor",
      genre: "Melodic Duet",
      views: 1970,
      videoId: "ZhYEBZDrTcc",
      posterUrl: "https://i.ytimg.com/vi/ZhYEBZDrTcc/hqdefault.jpg",
    },
    {
      id: "ad-majboor",
      title: "MAJBOOR",
      bpm: 122,
      key: "A# Minor",
      genre: "Romantic Club Beat",
      views: 1558,
      videoId: "h7sJw_li4F0",
      posterUrl: "https://i.ytimg.com/vi/h7sJw_li4F0/hqdefault.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  // Auto-rotate ads every 7 seconds like real Google dynamic display ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % officialAdVideos.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [officialAdVideos.length]);

  if (dismissed) return null;

  const currentItem = officialAdVideos[currentIndex];

  // Google AdChoices & Badge Header (Clean Bright Theme)
  const GoogleAdTag = () => (
    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 select-none">
      <span className="px-1.5 py-0.2 rounded border border-gray-300 bg-gray-100 font-mono text-[9px] text-gray-800 font-bold tracking-wider">
        Ad
      </span>
      <span className="text-gray-400">•</span>
      <span className="text-gray-600 font-sans text-[10px]">Ads by Google</span>
      <a
        href="https://adssettings.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#065fd4] hover:underline flex items-center gap-0.5 transition-colors"
        title="Google AdChoices"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        <span className="text-[9px] font-medium hidden sm:inline">AdChoices</span>
      </a>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }}
        className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-black transition-colors ml-1"
        title="Close Ad"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // 1. Google 300x250 Medium Rectangle Ad (For Watch Page / Sidebars)
  if (format === "rectangle") {
    return (
      <aside aria-label="Advertisement" className={`relative w-full max-w-[340px] mx-auto rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm p-3.5 space-y-2.5 ${className}`}>
        {/* Top Google Ad Label Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 px-1">
          <GoogleAdTag />
          <span className="text-[10px] text-gray-400 font-mono">300x250</span>
        </div>

        {/* 16:9 Widescreen Video Slot */}
        <Link
          href={`/watch/${currentItem.videoId}`}
          className="relative aspect-video w-full rounded-xl overflow-hidden bg-black block group shadow-sm"
        >
          <img
            src={currentItem.posterUrl}
            alt={`${currentItem.title} - SUPASONIC BEATS Hindi Afro House`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[9px] font-bold">
              {currentItem.bpm} BPM
            </span>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-bold">
            <span className="truncate">{currentItem.title}</span>
            <span className="text-white bg-[#ff0000] px-2 py-0.5 rounded font-mono text-[10px]">Play ▶</span>
          </div>
        </Link>

        {/* Ad Copy */}
        <div className="px-1 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 truncate">
            <span>SUPASONIC BEATS™ Official</span>
            <span className="text-[#065fd4] text-[10px]">✓</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-current" />
              ))}
            </div>
            <span className="text-gray-500 text-[10px] font-mono">(4.9) • 46K+ Views • 114+ Subs</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
            Trending Hindi Afro House & Desi EDM Master Beats. Free 320kbps MP3 & WAV Stems available.
          </p>
        </div>

        {/* Google Ad CTA Button */}
        <div className="pt-1">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-center"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            SUBSCRIBE ON YOUTUBE
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    );
  }

  // 2. Google Large Billboard Display Ad (970x250 In-Feed / In-Page)
  if (format === "billboard") {
    return (
      <aside aria-label="Advertisement" className={`relative w-full rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm p-4 md:p-6 my-6 ${className}`}>
        {/* Top Google Ad Label Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <GoogleAdTag />
            <span className="text-[10px] text-gray-400 font-mono hidden md:inline">970x250 Billboard</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {currentIndex + 1}/{officialAdVideos.length} Rotating Ads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* 16:9 Showcase Slot */}
          <Link
            href={`/watch/${currentItem.videoId}`}
            className="md:col-span-4 relative aspect-video rounded-2xl overflow-hidden bg-black block group shadow-sm"
          >
            <img
              src={currentItem.posterUrl}
              alt={`${currentItem.title} - SUPASONIC BEATS`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-2.5 left-2.5 flex gap-1">
              <span className="px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-bold">
                {currentItem.bpm} BPM
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/80 text-gray-300 font-mono text-[10px] font-bold">
                {currentItem.key}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-[#ff0000] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-bold truncate">
              {currentItem.title} • {currentItem.genre}
            </div>
          </Link>

          {/* Ad Copy & Value Props */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-[11px] text-[#065fd4] font-mono font-medium">
              www.youtube.com/@SupasonicBeatsOfficial
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 tracking-tight leading-snug">
              Official Hindi Afro House & Desi EDM Beats
            </h3>
            <div className="flex items-center gap-2 text-xs text-amber-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 text-[11px]">4.9 Rating • 46K+ Views • 114+ Subscribers</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Produced by SUPASONIC BEATS. Studio Master quality, royalty-friendly club bangers, and driving basslines. Free 320kbps MP3 & WAV master stems for creators.
            </p>
          </div>

          {/* Ad Action CTA */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              SUBSCRIBE NOW
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/watch/${currentItem.videoId}`}
              className="w-full py-2.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
            >
              Watch Video & Stems
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // 3. Google Sticky Bottom Anchor Ad (Clean Bright)
  if (format === "anchor") {
    if (collapsed) {
      return (
        <aside aria-label="Bottom Ad Tab" className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setCollapsed(false)}
            className="px-4 py-1.5 rounded-t-xl bg-white border-t border-x border-gray-200 text-gray-700 hover:text-black text-[10px] font-bold flex items-center gap-1.5 shadow-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-ping" />
            Ad: Subscribe to Supasonic Beats ▲
          </button>
        </aside>
      );
    }

    return (
      <aside aria-label="Sticky Advertisement" className="fixed bottom-0 inset-x-0 z-50 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Left Media & Channel Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Collapse & Ad tag */}
            <div className="flex flex-col items-start gap-0.5 flex-shrink-0">
              <GoogleAdTag />
              <button
                onClick={() => setCollapsed(true)}
                className="text-[9px] text-gray-500 hover:text-gray-900 font-mono underline"
              >
                Hide ▼
              </button>
            </div>

            {/* Video preview */}
            <Link
              href={`/watch/${currentItem.videoId}`}
              className="relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-gray-200 group"
            >
              <img
                src={currentItem.posterUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 font-mono text-[8px] bg-black/85 px-1 text-white font-bold">
                {currentItem.bpm} BPM
              </span>
            </Link>

            {/* Headline */}
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate flex items-center gap-1">
                <span>{currentItem.title}</span>
                <span className="hidden sm:inline text-gray-500">• {currentItem.genre}</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate hidden sm:block">
                Official Studio Master from SUPASONIC BEATS • Free MP3 & WAV
              </div>
            </div>
          </div>

          {/* Right Subscribe CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              SUBSCRIBE
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>
    );
  }

  // 4. Default: Standard Google Leaderboard Ad (728x90)
  return (
    <aside aria-label="Advertisement" className={`relative w-full max-w-5xl mx-auto rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm p-3.5 my-5 ${className}`}>
      {/* Top Google Ad Label Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2">
        <div className="flex items-center gap-2">
          <GoogleAdTag />
          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">728x90 Leaderboard</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          Ad {currentIndex + 1} of {officialAdVideos.length}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Video Media */}
        <Link
          href={`/watch/${currentItem.videoId}`}
          className="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0 border border-gray-200 group shadow-sm"
        >
          <img
            src={currentItem.posterUrl}
            alt={currentItem.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/85 text-white font-mono text-[8px] font-bold">
            {currentItem.bpm} BPM
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100">
            <Play className="w-4 h-4 text-white fill-current" />
          </div>
        </Link>

        {/* Center: Ad Copy */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {currentItem.title} - Official Drop | Supasonic Beats
            </h4>
            <span className="text-[#065fd4] text-xs hidden sm:inline">✓</span>
          </div>
          <div className="text-[10px] text-[#065fd4] font-mono truncate">
            youtube.com/@SupasonicBeatsOfficial • Hindi Afro House
          </div>
          <p className="text-[11px] text-gray-600 truncate hidden sm:block">
            Listen to 124 BPM master audio. Download 320kbps MP3, studio stems & 4K artwork.
          </p>
        </div>

        {/* Right: Subscribe CTA */}
        <div className="flex-shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-5 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all text-center"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">SUBSCRIBE</span>
            <span className="sm:hidden">SUB</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
