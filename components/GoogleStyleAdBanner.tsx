"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ExternalLink, X } from "lucide-react";

interface PromoTrackItem {
  id: string;
  title: string;
  bpm: number;
  key: string;
  genre: string;
  videoId: string;
  posterUrl: string;
}

interface GoogleStyleAdBannerProps {
  format?: "leaderboard" | "billboard" | "rectangle" | "anchor";
  className?: string;
  releases?: Array<{
    id: string;
    videoId?: string;
    title: string;
    bpm: number;
    key: string;
    subgenre: string;
    thumbnail: string;
  }>;
}

export default function GoogleStyleAdBanner({
  format = "leaderboard",
  className = "",
  releases = [],
}: GoogleStyleAdBannerProps) {
  const fallbackPromos: PromoTrackItem[] = [
    {
      id: "promo-aajphir",
      title: "AAJ PHIR",
      bpm: 125,
      key: "D Minor",
      genre: "Deep House x Club Bangers",
      videoId: "UzLfMApeA-4",
      posterUrl: "https://i.ytimg.com/vi/UzLfMApeA-4/hqdefault.jpg",
    },
    {
      id: "promo-abaaja",
      title: "AB AAJA",
      bpm: 128,
      key: "D Minor",
      genre: "VIP Club Bounce",
      videoId: "2wip8JYV7tQ",
      posterUrl: "https://i.ytimg.com/vi/2wip8JYV7tQ/hqdefault.jpg",
    },
    {
      id: "promo-madhosh",
      title: "MADHOSH",
      bpm: 124,
      key: "F Minor",
      genre: "Deep House Duet",
      videoId: "ZhYEBZDrTcc",
      posterUrl: "https://i.ytimg.com/vi/ZhYEBZDrTcc/hqdefault.jpg",
    },
    {
      id: "promo-deedar",
      title: "DEEDAR DE",
      bpm: 124,
      key: "F Minor",
      genre: "Hindi Afro House",
      videoId: "BuvPDZawk9M",
      posterUrl: "https://i.ytimg.com/vi/BuvPDZawk9M/hqdefault.jpg",
    },
  ];

  const promoTracks: PromoTrackItem[] =
    releases && releases.length > 0
      ? releases.slice(0, 4).map((r) => ({
          id: `promo-${r.id}`,
          title: r.title.split("|")[0].trim(),
          bpm: r.bpm,
          key: r.key,
          genre: r.subgenre,
          videoId: r.videoId || r.id,
          posterUrl: r.thumbnail,
        }))
      : fallbackPromos;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoTracks.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [promoTracks.length]);

  if (dismissed || format === "anchor") return null;

  const currentItem = promoTracks[currentIndex];

  return (
    <aside
      aria-label="Featured Label Spotlight"
      className={`relative w-full rounded-[24px] liquid-glass p-4 sm:p-5 overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href={`/watch/${currentItem.videoId}`}
            className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/60"
          >
            <img
              src={currentItem.posterUrl}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-slate-900/5 text-slate-700 font-mono">
                Spotlight
              </span>
              <span className="truncate">{currentItem.genre}</span>
            </div>
            <Link
              href={`/watch/${currentItem.videoId}`}
              className="block text-sm sm:text-base font-bold text-[#0b0f19] hover:text-[#ff3b30] truncate mt-0.5 transition-colors"
            >
              {currentItem.title} · {currentItem.bpm} BPM
            </Link>
            <p className="text-[11px] text-slate-500 truncate">
              Available in 320kbps MP3 &amp; Studio 48kHz WAV for car audio &amp; DJs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full liquid-btn-red font-semibold text-xs flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Subscribe</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
