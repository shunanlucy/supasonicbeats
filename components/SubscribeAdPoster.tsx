"use client";

import React from "react";
import {
  Bell,
  Play,
  Flame,
  Sparkles,
  ExternalLink,
  Users,
  CheckCircle2,
  Disc,
} from "lucide-react";

interface SubscribeAdPosterProps {
  variant?: "billboard" | "compact" | "hero";
  subscriberCount?: string;
}

export default function SubscribeAdPoster({
  variant = "billboard",
  subscriberCount = "114+",
}: SubscribeAdPosterProps) {
  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  if (variant === "compact") {
    return (
      <a
        href={subscribeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block p-4 sm:p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#ff0000] transition-all duration-200 overflow-hidden shadow-xl active:scale-[0.98]"
      >
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ff0000] flex items-center justify-center text-white shadow-md shadow-red-900/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#ff4e45] flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-[#ff0000]" />
                OFFICIAL YOUTUBE
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#f1f1f1] group-hover:text-white transition-colors truncate">
                Subscribe to SUPASONIC BEATS
              </h4>
              <p className="text-[11px] text-[#aaaaaa]">Join {subscriberCount} listeners & producers</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider shadow-md flex-shrink-0 transition-colors">
            Subscribe
          </span>
        </div>
      </a>
    );
  }

  // Large YouTube-Themed Billboard Advertisement Poster
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10 bg-[#181818] border border-[#282828] hover:border-[#383838] shadow-2xl my-8 group">
      {/* YouTube Red Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left Ad Content */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#272727] border border-[#ff0000]/30 text-[#ff4e45] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-ping" />
            <Play className="w-3 h-3 fill-current" />
            OFFICIAL ARTIST SUBSCRIPTION
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#f1f1f1] tracking-tight leading-snug">
            NEVER MISS A BEAT DROP. <br />
            <span className="text-[#ff0000]">
              SUBSCRIBE TO SUPASONIC BEATS ON YOUTUBE
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-[#aaaaaa] leading-relaxed">
            Get exclusive 4K audio-visual releases, lossless 320kbps MP3s and studio WAV master stems, and weekly viral Hindi Afro House & Desi Deep House club bangers before anyone else.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#aaaaaa] pt-1">
            <span className="flex items-center gap-1.5 text-[#f1f1f1] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#ff0000]" /> Free 320kbps MP3s
            </span>
            <span className="flex items-center gap-1.5 text-[#f1f1f1] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#ff0000]" /> Lossless Studio WAV
            </span>
            <span className="flex items-center gap-1.5 text-[#f1f1f1] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#ff0000]" /> Weekly Master Releases
            </span>
          </div>
        </div>

        {/* Right CTA Button & Social Proof */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3.5 flex-shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-red-900/40 active:scale-95 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#ff0000] flex items-center justify-center">
              <Play className="w-3 h-3 fill-current translate-x-0.2" />
            </div>
            SUBSCRIBE ON YOUTUBE
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 text-xs text-[#aaaaaa]">
            <Bell className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>
              Join <strong className="text-[#f1f1f1]">{subscriberCount}</strong> subscribers • 1-Click Redirect
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
