"use client";

import React from "react";
import Link from "next/link";
import {
  Disc,
  Play,
  Users,
  Eye,
  Radio,
  Sparkles,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Flame,
  Music,
  Trophy,
  Share2,
  CheckCircle2,
  Bell,
  BookOpen,
  Search,
} from "lucide-react";

interface ChannelHeaderProps {
  channel: {
    title?: string;
    customUrl?: string;
    description?: string;
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      videoCount?: string;
    };
  };
  totalPosts: number;
  activeTab: "feed" | "tips" | "seo" | "competitors";
  setActiveTab: (tab: "feed" | "tips" | "seo" | "competitors") => void;
  onSync: () => void;
  syncing: boolean;
  onOpenNewPost: () => void;
}

export default function ChannelHeader({
  channel,
  totalPosts,
  activeTab,
  setActiveTab,
  onSync,
  syncing,
  onOpenNewPost,
}: ChannelHeaderProps) {
  const subs = channel?.statistics?.subscriberCount || "47+";
  const views = parseInt(channel?.statistics?.viewCount || "20665", 10);
  const formattedViews =
    views >= 1000000
      ? `${(views / 1000000).toFixed(1)}M`
      : views >= 1000
      ? `${(views / 1000).toFixed(1)}K`
      : `${views}`;

  const subscribeUrl = "https://www.youtube.com/@supasonicbeats?sub_confirmation=1";

  return (
    <header className="relative w-full overflow-hidden border-b border-[#282828] bg-[#0f0f0f]">
      {/* 1. YouTube Top Navigation Bar */}
      <div className="w-full bg-[#0f0f0f] border-b border-[#282828] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40">
        {/* Left: YouTube Red Logo & SUPASONIC BEATS */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-6 rounded-lg bg-[#ff0000] flex items-center justify-center shadow-md shadow-red-900/40 group-hover:scale-105 transition-transform">
              <Play className="w-3.5 h-3.5 text-white fill-current translate-x-0.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[#f1f1f1] group-hover:text-white transition-colors">
                SUPASONIC BEATS
              </span>
              <span className="text-[10px] font-bold text-[#aaaaaa] font-mono tracking-wider px-1.5 py-0.2 rounded bg-[#272727]">
                IN
              </span>
            </div>
          </Link>
        </div>

        {/* Center: YouTube Search Style Field */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="w-full flex items-center bg-[#121212] border border-[#303030] rounded-full overflow-hidden focus-within:border-[#3ea6ff] transition-colors">
            <input
              type="text"
              placeholder="Search Hindi Afro House, 124 BPM, Desi EDM beats..."
              className="w-full px-4 py-1.5 bg-transparent text-xs text-[#f1f1f1] placeholder-[#717171] focus:outline-none"
              onClick={() => setActiveTab("feed")}
              readOnly
            />
            <button
              onClick={() => setActiveTab("feed")}
              className="px-4 py-1.5 bg-[#222222] border-l border-[#303030] text-[#aaaaaa] hover:text-white hover:bg-[#272727] transition-colors"
              title="Search Tracks"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: YouTube Direct Subscribe & Action Buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-900/30 active:scale-95 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>SUBSCRIBE</span>
          </a>

          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] transition-colors"
            title="Turn on notifications"
          >
            <Bell className="w-4 h-4 text-[#f1f1f1]" />
          </a>

          <button
            onClick={onOpenNewPost}
            className="p-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] transition-colors hidden sm:flex"
            title="Upload/Post New Track or Tip"
          >
            <PlusCircle className="w-4 h-4 text-[#f1f1f1]" />
          </button>
        </div>
      </div>

      {/* 2. YouTube Channel Banner */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-[#181818]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/channel_banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
        
        {/* YouTube Live Signal Badge */}
        <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur border border-white/10 flex items-center gap-2 text-xs font-semibold text-[#f1f1f1]">
            <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-ping" />
            <span className="text-[11px] font-mono">124 BPM Master Hub</span>
          </div>
        </div>
      </div>

      {/* 3. YouTube Channel Profile Information Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Channel Avatar + Title + Handle + High SEO Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-[#0f0f0f] border-2 border-[#303030] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#181818] relative">
                  <img
                    src="/channel_avatar.jpg"
                    alt="SUPASONIC BEATS Official YouTube Channel Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#ff0000] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-[#0f0f0f] flex items-center gap-1 shadow-md">
                <Play className="w-2 h-2 fill-current" /> ARTIST
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#f1f1f1] flex items-center gap-2">
                  {channel?.title || "SUPASONIC BEATS"}
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#aaaaaa] text-[#0f0f0f] text-[10px] font-black"
                    title="Verified Channel"
                  >
                    ✓
                  </span>
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#272727] text-[#ff0000] border border-[#ff0000]/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" /> Hindi Afro House & Desi EDM
                </span>
              </div>

              {/* YouTube Channel Metadata Line */}
              <div className="text-xs text-[#aaaaaa] flex flex-wrap items-center gap-2 font-medium">
                <span className="text-[#f1f1f1] font-semibold">{channel?.customUrl || "@supasonicbeats"}</span>
                <span>•</span>
                <span>{subs} subscribers</span>
                <span>•</span>
                <span>{totalPosts || 65} videos</span>
                <span>•</span>
                <span>{formattedViews} views</span>
              </div>

              {/* High SEO Keyword Rich Channel Description */}
              <p className="text-xs text-[#aaaaaa] max-w-2xl leading-relaxed">
                {channel?.description ||
                  "Official Music Hub for Hindi Afro House, Desi Deep House & Club Beats at 124 BPM. Free 320kbps MP3 audio, studio WAV master stems, and viral SEO sound tags for creators."}
              </p>

              {/* High-Intent SEO Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#3ea6ff] font-mono">
                  #HindiAfroHouse
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#3ea6ff] font-mono">
                  #DesiEDM
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-[#3ea6ff] font-mono">
                  #124BPM
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#303030] text-emerald-400 font-mono">
                  Free 320kbps MP3 & WAV
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: YouTube Red Subscribe Button */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#d9d9d9] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Bell className="w-3.5 h-3.5 fill-black" />
              <span>Subscribe</span>
            </a>

            <button
              onClick={onOpenNewPost}
              className="px-4 py-2.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-white/5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ff0000]" />
              <span>Post Track / Tip</span>
            </button>

            <button
              onClick={onSync}
              disabled={syncing}
              className="p-2.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-all active:scale-95 disabled:opacity-50 border border-white/5"
              title="Sync latest uploads from YouTube"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-[#ff0000]" : ""}`} />
            </button>
          </div>
        </div>

        {/* 4. YouTube-Style Navigation Tab Chips */}
        <nav
          aria-label="Channel Sections"
          className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-[#282828]"
        >
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              activeTab === "feed"
                ? "bg-[#f1f1f1] text-black font-bold shadow-sm"
                : "bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f] font-medium"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Releases & Master Beats</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "feed" ? "bg-black/10 text-black font-bold" : "bg-black/40 text-[#aaaaaa]"
              }`}
            >
              {totalPosts || 65}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tips")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              activeTab === "tips"
                ? "bg-[#f1f1f1] text-black font-bold shadow-sm"
                : "bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f] font-medium"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff0000]" />
            <span>Producer Masterclasses</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#ff0000]/20 text-[#ff4e45] font-bold">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              activeTab === "seo"
                ? "bg-[#f1f1f1] text-black font-bold shadow-sm"
                : "bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f] font-medium"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>High SEO & Sound Tags</span>
          </button>

          <button
            onClick={() => setActiveTab("competitors")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              activeTab === "competitors"
                ? "bg-[#f1f1f1] text-black font-bold shadow-sm"
                : "bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f] font-medium"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Competitor Niche Radar</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-yellow-400/20 text-yellow-300 font-bold">
              Top 10
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
