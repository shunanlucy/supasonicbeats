"use client";

import React, { useState } from "react";
import {
  Bell,
  Play,
  Sparkles,
  X,
  ExternalLink,
  Flame,
  Music,
} from "lucide-react";
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
    <div className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-2 pb-1 bg-gradient-to-b from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent pointer-events-none">
      <div className="max-w-5xl mx-auto rounded-full bg-[#181818] p-1.5 pl-4 pr-2.5 pointer-events-auto flex items-center justify-between gap-3 shadow-xl border border-[#ff0000]/30 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#ff0000] flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-red-900/40">
            <Bell className="w-3 h-3 fill-current animate-bounce" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#272727] text-[#ff4e45] border border-[#ff0000]/20 flex-shrink-0">
              {latestPost.type === "tip" ? "PRODUCER TIP" : "NEW DROP"}
            </span>

            <p className="text-xs font-bold text-[#f1f1f1] truncate max-w-xs sm:max-w-md md:max-w-xl">
              {latestPost.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onOpenPost(latestPost)}
            className="px-3 py-1 rounded-full bg-white text-black hover:bg-[#d9d9d9] text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            {latestPost.type === "tip" ? (
              <>Read Tip</>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Stream
              </>
            )}
          </button>

          <a
            href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Subscribe
          </a>

          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-full text-[#aaaaaa] hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
