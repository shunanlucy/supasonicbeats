"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Share2,
  Check,
  CheckCircle2,
  BookOpen,
  Flame,
  Play,
  ExternalLink,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface TipModalProps {
  post: FeedPost | null;
  onClose: () => void;
}

export default function TipModal({ post, onClose }: TipModalProps) {
  const [copied, setCopied] = useState(false);

  if (!post || post.type !== "tip") return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.tipContent || post.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#181818] border border-[#303030] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 px-5 bg-[#212121] border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff0000]/20 flex items-center justify-center text-[#ff4e45]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff4e45]">
                PRODUCER MASTERCLASS • {post.tipCategory || "STUDIO GUIDE"}
              </div>
              <span className="text-xs text-[#aaaaaa]">{post.formattedDate} by SUPASONIC BEATS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
              title="Copy Tip"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-5 overflow-y-auto">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#f1f1f1] leading-snug">
              {post.title}
            </h2>
            <p className="mt-2 text-xs md:text-sm text-[#aaaaaa] leading-relaxed">
              {post.caption}
            </p>
          </div>

          {post.tipContent && (
            <div className="p-4 rounded-xl bg-[#212121] border border-[#282828] font-mono text-xs text-[#f1f1f1] whitespace-pre-wrap leading-relaxed">
              {post.tipContent}
            </div>
          )}

          <div className="pt-3 border-t border-[#282828] flex items-center justify-between">
            <div className="text-xs text-[#aaaaaa]">
              Tempo Target: <strong className="text-[#3ea6ff]">{post.bpm} BPM</strong>
            </div>
            <a
              href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-900/40"
            >
              <Play className="w-3 h-3 fill-current" />
              Subscribe for Weekly Guides
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
