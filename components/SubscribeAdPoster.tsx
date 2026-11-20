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
        className="group relative block p-4 sm:p-5 rounded-3xl liquid-glass border border-white/80 hover:border-white transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.9)] hover:shadow-lg active:scale-[0.98]"
      >
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff3b30] to-[#e00000] flex items-center justify-center text-white shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform flex-shrink-0 border border-white/30">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#ff3b30] flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-[#ff3b30]" />
                OFFICIAL YOUTUBE
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#ff3b30] transition-colors truncate">
                Subscribe to SUPASONIC BEATS
              </h4>
              <p className="text-[11px] text-gray-500">Join {subscriberCount} listeners & producers</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full liquid-btn-red font-bold text-xs uppercase tracking-wider shadow-sm flex-shrink-0">
            Subscribe
          </span>
        </div>
      </a>
    );
  }

  // Large YouTube-Themed Billboard Advertisement Poster (iPhone Liquid Glass)
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 liquid-glass border border-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,1)] my-8 group">
      {/* Subtle Liquid Water Glow Orbs inside container */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-red-200/25 to-sky-200/20 rounded-full blur-3xl pointer-events-none animate-water-pulse" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left Ad Content */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-badge text-[#ff3b30] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ff3b30] animate-ping" />
            <Play className="w-3 h-3 fill-current" />
            OFFICIAL ARTIST SUBSCRIPTION
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
            NEVER MISS A BEAT DROP. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b30] to-[#e00000]">
              SUBSCRIBE TO SUPASONIC BEATS ON YOUTUBE
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Get exclusive 4K audio-visual releases, lossless 320kbps MP3s and studio WAV master stems, and weekly viral Hindi Afro House & Desi Deep House club bangers before anyone else.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
            <span className="flex items-center gap-1.5 text-gray-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#ff3b30]" /> Free 320kbps MP3s
            </span>
            <span className="flex items-center gap-1.5 text-gray-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#ff3b30]" /> Lossless Studio WAV
            </span>
            <span className="flex items-center gap-1.5 text-gray-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#ff3b30]" /> Weekly Master Releases
            </span>
          </div>
        </div>

        {/* Right CTA Button & Social Proof */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3.5 flex-shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full liquid-btn-red font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/30 active:scale-95 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#ff3b30] flex items-center justify-center shadow-sm">
              <Play className="w-3 h-3 fill-current translate-x-0.2" />
            </div>
            SUBSCRIBE ON YOUTUBE
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Bell className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>
              Join <strong className="text-gray-900 font-bold">{subscriberCount}</strong> subscribers • 1-Click Redirect
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
