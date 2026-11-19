"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Sparkles,
  Flame,
  Tag,
  Target,
  FileText,
  Share2,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface SEODrawerModalProps {
  post: FeedPost | null;
  onClose: () => void;
}

export default function SEODrawerModal({ post, onClose }: SEODrawerModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!post) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const seo = post.seoData;
  if (!seo) return null;

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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#f1f1f1]">YouTube High SEO & Viral Tags</h3>
              <p className="text-[11px] text-[#aaaaaa] truncate max-w-sm">{post.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Trending Titles */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#282828] pb-1.5">
              <span className="text-xs font-bold text-[#f1f1f1] flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#ff0000]" /> 5 High-CTR YouTube Titles
              </span>
              <span className="text-[10px] text-[#717171]">Rank #1 Formula</span>
            </div>

            <div className="space-y-2">
              {seo.titles.map((t, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#212121] border border-[#282828] hover:border-[#383838] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-[#ff4e45]">{t.type}</div>
                    <div className="text-xs font-mono font-semibold text-[#f1f1f1] truncate">{t.title}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(t.title, `post-title-${i}`)}
                    className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors flex-shrink-0"
                    title="Copy Title"
                  >
                    {copiedKey === `post-title-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#282828] pb-1.5">
              <span className="text-xs font-bold text-[#f1f1f1] flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-[#3ea6ff]" /> High SEO Algorithmic Tags
              </span>
              <button
                onClick={() => handleCopy(seo.tagsString, "drawer-tags")}
                className="text-xs text-[#3ea6ff] hover:underline font-semibold flex items-center gap-1"
              >
                {copiedKey === "drawer-tags" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy All ({seo.tagList.length} tags)
              </button>
            </div>

            <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-[#121212] border border-[#282828] max-h-36 overflow-y-auto">
              {seo.tagList.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#212121] text-[#aaaaaa] border border-[#303030]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f1f1f1] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> YouTube Description Box
              </span>
              <button
                onClick={() => handleCopy(seo.descriptionTemplate, "drawer-desc")}
                className="text-xs text-[#3ea6ff] hover:underline font-semibold flex items-center gap-1"
              >
                {copiedKey === "drawer-desc" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy Description
              </button>
            </div>
            <textarea
              readOnly
              value={seo.descriptionTemplate}
              rows={5}
              className="w-full p-3 rounded-xl bg-[#121212] border border-[#303030] font-mono text-[11px] text-[#aaaaaa] focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
