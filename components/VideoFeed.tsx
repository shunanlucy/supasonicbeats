"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Download,
  Share2,
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  Music,
  Heart,
  MessageCircle,
  Eye,
  Disc,
  Check,
  ExternalLink,
  ChevronDown,
  FileAudio,
  Image as ImageIcon,
  BookOpen,
  ArrowUpRight,
  Tag,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";
import SubscribeAdPoster from "./SubscribeAdPoster";

interface VideoFeedProps {
  posts: FeedPost[];
  loading: boolean;
  onPlayVideo: (post: FeedPost) => void;
  onOpenSEO: (post: FeedPost) => void;
  onOpenTip: (post: FeedPost) => void;
  currentlyPlayingId?: string | null;
  postTypeFilter?: "all" | "release" | "tip";
}

export default function VideoFeed({
  posts,
  loading,
  onPlayVideo,
  onOpenSEO,
  onOpenTip,
  currentlyPlayingId,
  postTypeFilter = "all",
}: VideoFeedProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [downloadMenuOpenId, setDownloadMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subgenres = [
    { label: "All Beats", value: "all" },
    { label: "Hindi Afro House", value: "Hindi Afro House" },
    { label: "124 BPM Club Mix", value: "124 BPM" },
    { label: "Deep House", value: "Deep House" },
    { label: "Club Bangers", value: "Club Bangers" },
    { label: "Late Night Drive", value: "Late Night Drive" },
  ];

  const handleCardClick = (post: FeedPost) => {
    if (post.type === "tip") {
      onOpenTip(post);
    } else {
      router.push(`/watch/${post.videoId}`);
    }
  };

  const handleCopyLink = (post: FeedPost, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.youtubeUrl || `${window.location.origin}/watch/${post.videoId}`);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (post: FeedPost, type: "mp3" | "wav" | "cover", e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadMenuOpenId(null);
    let targetUrl = post.audioUrl || "/audio/clover_clip.mp3";
    let filename = `${post.title.replace(/[^a-zA-Z0-9]/g, "_")}`;

    if (type === "mp3") filename += "_320kbps.mp3";
    else if (type === "wav") filename += "_StudioMaster.wav";
    else {
      filename += "_4KCover.jpg";
      targetUrl = post.thumbnail;
    }

    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredPosts = posts.filter((post) => {
    if (postTypeFilter !== "all" && post.type !== postTypeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchGenre = post.subgenre?.toLowerCase().includes(q);
      const matchKey = post.key?.toLowerCase().includes(q);
      const matchBpm = post.bpm?.toString().includes(q);
      if (!matchTitle && !matchGenre && !matchKey && !matchBpm) return false;
    }

    if (selectedGenre !== "all") {
      return (
        post.subgenre?.toLowerCase() === selectedGenre.toLowerCase() ||
        post.title?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-500">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#ff0000] animate-spin" />
        <p className="mt-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
          Loading SUPASONIC BEATS Catalog...
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Video Posts Feed" className="space-y-5">
      {/* 1. YouTube Style Bright Search & Filter Chips Bar */}
      <div className="space-y-3">
        {/* Bright Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog by title, 124 BPM, Hindi Afro House, musical key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 text-xs focus:outline-none focus:border-[#065fd4] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bright Chips Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {subgenres.map((chip) => {
            const isActive = selectedGenre === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => setSelectedGenre(chip.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
                  isActive
                    ? "bg-gray-900 text-white font-bold"
                    : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bright Video Grid with Microdata Schema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post, idx) => {
          const isPlaying = currentlyPlayingId === post.id;
          const isDownloadOpen = downloadMenuOpenId === post.id;
          const isTip = post.type === "tip";

          return (
            <React.Fragment key={post.id}>
              {/* Insert YouTube Subscribe Billboard after 6 items */}
              {idx === 6 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <SubscribeAdPoster variant="billboard" />
                </div>
              )}

              {/* Semantic YouTube Video Card Article (Bright Style) */}
              <article
                itemScope
                itemType={isTip ? "https://schema.org/Article" : "https://schema.org/MusicRecording"}
                className="group flex flex-col rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <meta itemProp="name" content={post.title} />
                <meta itemProp="duration" content="PT3M24S" />
                <meta itemProp="inLanguage" content="hi" />

                {/* Media Area (16:9 Thumbnail with Duration Badge) */}
                {isTip ? (
                  <div
                    onClick={() => onOpenTip(post)}
                    className="p-5 bg-gradient-to-br from-red-50/60 via-amber-50/40 to-white cursor-pointer min-h-[170px] flex flex-col justify-between border-b border-gray-100"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff0000] px-2 py-0.5 rounded bg-red-100 inline-block">
                        {post.tipCategory || "Producer Masterclass"}
                      </span>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#ff0000] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 font-semibold pt-3">
                      <span>Read Full Studio Guide</span>
                      <ArrowUpRight className="w-4 h-4 text-[#ff0000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleCardClick(post)}
                    className="relative aspect-video w-full bg-gray-100 cursor-pointer overflow-hidden group/media"
                  >
                    <img
                      src={post.thumbnail}
                      alt={`${post.title} - Hindi Afro House Beat by SUPASONIC BEATS`}
                      itemProp="image"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${post.videoId}/hqdefault.jpg`;
                      }}
                    />

                    {/* YouTube Timestamp Duration Badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] font-bold">
                      {post.duration || "3:24"}
                    </div>

                    {/* Top Badges: BPM & Key */}
                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                      <span className="px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[9px] font-bold">
                        {post.bpm} BPM
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/85 text-gray-300 font-mono text-[9px] font-bold">
                        {post.key}
                      </span>
                    </div>

                    {post.isNewRelease && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-0.5 rounded bg-[#ff0000] text-white font-bold text-[9px] tracking-wider uppercase shadow-md">
                          NEW
                        </span>
                      </div>
                    )}

                    {/* YouTube Play Icon Hover Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity bg-black/25">
                      <div className="w-12 h-12 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-xl scale-95 group-hover/media:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Details (Bright Style: Avatar + Title + Stats) */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div className="flex gap-3">
                    {/* Circular Channel Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img
                        src="/channel_avatar.jpg"
                        alt="SUPASONIC BEATS"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title & Metadata */}
                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => handleCardClick(post)}
                        className="text-xs md:text-sm font-bold text-gray-900 hover:text-black line-clamp-2 leading-snug cursor-pointer"
                        title={post.title}
                      >
                        {post.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1">
                        <span className="hover:text-gray-900 transition-colors">SUPASONIC BEATS</span>
                        <span className="text-[10px] font-black text-[#065fd4]">✓</span>
                      </div>

                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{post.formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Action Bar Underneath */}
                  <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1.5">
                    {isTip ? (
                      <button
                        onClick={() => onOpenTip(post)}
                        className="w-full py-1.5 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#ff0000]" />
                        <span>Read Tip</span>
                      </button>
                    ) : (
                      <>
                        {/* Stream / Watch */}
                        <button
                          onClick={() => handleCardClick(post)}
                          className="flex-1 py-1.5 px-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current text-gray-800" />
                          <span>Watch</span>
                        </button>

                        {/* Download Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDownloadMenuOpenId(isDownloadOpen ? null : post.id);
                            }}
                            className="py-1.5 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3 text-gray-700" />
                            <span>Download</span>
                            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                          </button>

                          {isDownloadOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute bottom-full mb-2 right-0 w-48 rounded-xl bg-white border border-gray-200 p-1.5 shadow-xl z-50 text-left"
                            >
                              <div className="text-[10px] font-bold text-gray-500 px-2 py-1 uppercase tracking-wider border-b border-gray-100 mb-1">
                                Direct Studio Master
                              </div>
                              <button
                                onClick={(e) => handleDownload(post, "mp3", e)}
                                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <FileAudio className="w-3.5 h-3.5 text-[#065fd4]" />
                                <div>
                                  <div>Audio MP3</div>
                                  <div className="text-[9px] text-gray-500">320 kbps High Quality</div>
                                </div>
                              </button>
                              <button
                                onClick={(e) => handleDownload(post, "wav", e)}
                                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <Disc className="w-3.5 h-3.5 text-[#ff0000]" />
                                <div>
                                  <div>Studio WAV Master</div>
                                  <div className="text-[9px] text-gray-500">24-bit Lossless</div>
                                </div>
                              </button>
                              <button
                                onClick={(e) => handleDownload(post, "cover", e)}
                                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                                <div>
                                  <div>4K Artwork Cover</div>
                                  <div className="text-[9px] text-gray-500">1920x1080 High Res</div>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* SEO Tags Button */}
                        <button
                          onClick={() => onOpenSEO(post)}
                          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                          title="View High SEO Sound Tags"
                        >
                          <Tag className="w-3.5 h-3.5 text-amber-500" />
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={(e) => handleCopyLink(post, e)}
                          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === post.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
