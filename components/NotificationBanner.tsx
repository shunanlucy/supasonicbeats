"use client";

import React, { useState } from "react";
import { Play, X } from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface NotificationBannerProps {
  latestPost: FeedPost | null;
  onOpenPost: (post: FeedPost) => void;
}

export default function NotificationBanner({
  latestPost,
  onOpenPost,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible || !latestPost) return null;

  return (
    <div className="w-full px-3 sm:px-6 pt-2.5 pb-1 flex justify-center">
      <div className="max-w-3xl w-full sm:w-auto rounded-full liquid-glass px-3.5 py-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#ff3b30] flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff3b30] flex-shrink-0">
            {latestPost.type === "tip" ? "Studio Note" : "New Drop"}
          </span>
          <p className="text-xs font-semibold text-[#0b0f19] truncate max-w-[180px] sm:max-w-md">
            {latestPost.title}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onOpenPost(latestPost)}
            className="px-3 py-1 rounded-full liquid-btn-red text-[11px] font-semibold flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>{latestPost.type === "tip" ? "Read" : "Play"}</span>
          </button>

          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
