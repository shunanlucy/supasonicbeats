"use client";

import React from "react";
import { Bell, Play, ExternalLink, CheckCircle2 } from "lucide-react";

interface SubscribeAdPosterProps {
  variant?: "billboard" | "compact" | "hero";
  subscriberCount?: string;
}

export default function SubscribeAdPoster({
  variant = "billboard",
  subscriberCount = "141+",
}: SubscribeAdPosterProps) {
  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  if (variant === "compact") {
    return (
      <a
        href={subscribeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block p-4 sm:p-5 rounded-3xl liquid-card transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl liquid-btn-red flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-wider uppercase text-[#ff3b30]">
                Official YouTube
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0b0f19] truncate">
                Subscribe to SUPASONIC BEATS
              </h4>
              <p className="text-[11px] text-slate-500">{subscriberCount} subscribers</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full liquid-btn-red font-semibold text-xs flex-shrink-0">
            Subscribe
          </span>
        </div>
      </a>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] p-6 sm:p-8 md:p-10 liquid-glass my-6">
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-sky-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-8 w-64 h-64 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#ff3b30]">
            Official Label Channel
          </span>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0b0f19] tracking-tight leading-snug">
            Follow Every Drop on YouTube.
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Subscribe for weekly 124–128 BPM Indian Afro House, Raga Techno, and Late-Night Car Audio releases, plus instant access to 320kbps MP3 and Master WAV downloads.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff3b30]" /> 320kbps MP3s
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff3b30]" /> Car &amp; DJ WAV Masters
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff3b30]" /> Creator Attribution Friendly
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full liquid-btn-red font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <span className="text-[11px] text-slate-500">
            Join <strong className="text-[#0b0f19] font-semibold">{subscriberCount}</strong> listeners
          </span>
        </div>
      </div>
    </div>
  );
}
