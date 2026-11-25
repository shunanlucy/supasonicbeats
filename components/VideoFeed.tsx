"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Download,
  Share2,
  Search,
  Check,
  ChevronDown,
  FileAudio,
  Disc,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";
import SubscribeAdPoster from "./SubscribeAdPoster";
import SubscribeUnlockModal from "./SubscribeUnlockModal";

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
  onOpenTip,
  postTypeFilter = "all",
}: VideoFeedProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [downloadMenuOpenId, setDownloadMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  const subgenres = [
    { label: "All Releases", value: "all" },
    { label: "Indian Afro House", value: "Afro House" },
    { label: "Deep House", value: "Deep House" },
    { label: "Club Bangers", value: "Club Bangers" },
    { label: "Raga Techno", value: "Raga" },
    { label: "125 BPM+", value: "125" },
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

  const handleDownloadTrigger = (post: FeedPost, type: "mp3" | "wav" | "cover", e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadMenuOpenId(null);
    const cleanName = post.title.split("|")[0].trim().replace(/[^a-zA-Z0-9]/g, "_");

    if (type === "cover") {
      const a = document.createElement("a");
      a.href = post.thumbnail;
      a.download = `${cleanName}_Cover.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    setUnlockModal({
      isOpen: true,
      trackTitle: post.title.split("|")[0].trim(),
      formatLabel: type === "wav" ? "Studio 48kHz Master WAV" : "320 kbps Stereo MP3",
      downloadUrl: post.audioUrl || "/audio/clover_clip.mp3",
      filename: `${cleanName}_${type === "wav" ? "StudioMaster.wav" : "320kbps.mp3"}`,
    });
  };

  const filteredPosts = posts.filter((post) => {
    if (postTypeFilter !== "all" && post.type !== postTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hitTitle = post.title?.toLowerCase().includes(q);
      const hitGenre = post.subgenre?.toLowerCase().includes(q);
      const hitKey = post.key?.toLowerCase().includes(q);
      const hitBpm = post.bpm?.toString().includes(q);
      if (!hitTitle && !hitGenre && !hitKey && !hitBpm) return false;
    }
    if (selectedGenre !== "all") {
      return (
        post.subgenre?.toLowerCase().includes(selectedGenre.toLowerCase()) ||
        post.title?.toLowerCase().includes(selectedGenre.toLowerCase()) ||
        post.bpm?.toString().includes(selectedGenre)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#ff3b30] animate-spin" />
        <p className="mt-3 text-xs font-medium tracking-wider text-slate-500 uppercase">
          Loading Releases
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Catalog Releases" className="space-y-5">
      {/* Search + Clean Chips Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracks, BPM, musical key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-full liquid-glass text-[#0b0f19] placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {subgenres.map((chip) => {
            const isActive = selectedGenre === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => setSelectedGenre(chip.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "liquid-pill-active text-[#0b0f19]"
                    : "liquid-pill text-slate-600 hover:text-[#0b0f19]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pure Unblocked Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredPosts.map((post, idx) => {
          const isDownloadOpen = downloadMenuOpenId === post.id;
          const isTip = post.type === "tip";

          return (
            <React.Fragment key={post.id}>
              {idx === 6 && postTypeFilter === "release" && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <SubscribeAdPoster variant="billboard" />
                </div>
              )}

              <article
                itemScope
                itemType={isTip ? "https://schema.org/Article" : "https://schema.org/MusicRecording"}
                className="group flex flex-col rounded-[24px] liquid-card overflow-hidden p-2 space-y-2.5"
              >
                <meta itemProp="name" content={post.title} />

                {isTip ? (
                  <div
                    onClick={() => onOpenTip(post)}
                    className="p-4 rounded-[18px] bg-white/55 border border-white/80 cursor-pointer min-h-[175px] flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ff3b30]">
                        {post.tipCategory || "Studio Production Guide"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#0b0f19] group-hover:text-[#ff3b30] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-700 font-semibold pt-3">
                      <span>Read Studio Note</span>
                      <ArrowUpRight className="w-4 h-4 text-[#ff3b30]" />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleCardClick(post)}
                    className="relative aspect-video w-full rounded-[18px] bg-slate-950 cursor-pointer overflow-hidden group/media"
                  >
                    <img
                      src={post.thumbnail}
                      alt={`${post.title} - SUPASONIC BEATS`}
                      itemProp="image"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-[1.03]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = post.videoId === "Wqdt2D61_Ss"
                          ? "/thumbs/raat_ka_nasha.jpg"
                          : `https://i.ytimg.com/vi/${post.videoId}/hqdefault.jpg`;
                      }}
                    />

                    {/* Only subtle single duration badge in corner — artwork stays 100% clean */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-md text-white font-mono text-[10px] font-medium border border-white/15">
                      {post.duration || "3:24"}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity bg-black/20">
                      <div className="w-11 h-11 rounded-full liquid-btn-red flex items-center justify-center shadow-xl">
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {!isTip && (
                  <div className="px-2 pb-1.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => handleCardClick(post)}
                        className="text-sm font-bold text-[#0b0f19] hover:text-[#ff3b30] line-clamp-2 leading-snug cursor-pointer transition-colors"
                        title={post.title}
                      >
                        {post.title}
                      </h3>

                      <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 mt-1">
                        <span className="font-mono font-medium text-slate-700">{post.bpm} BPM</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600">{post.key}</span>
                        <span>·</span>
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/70 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleCardClick(post)}
                        className="flex-1 py-1.5 px-3 rounded-full liquid-pill text-[#0b0f19] text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch</span>
                      </button>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDownloadMenuOpenId(isDownloadOpen ? null : post.id);
                          }}
                          className="py-1.5 px-3 rounded-full liquid-pill text-[#0b0f19] text-xs font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-[#ff3b30]" />
                          <span>Audio</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {isDownloadOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-full mb-2 right-0 w-48 rounded-2xl liquid-glass p-1.5 shadow-2xl z-50 text-left"
                          >
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "mp3", e)}
                              className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#0b0f19] hover:bg-white/80 flex items-center gap-2"
                            >
                              <FileAudio className="w-3.5 h-3.5 text-sky-600" />
                              <div>
                                <div className="font-semibold">320kbps MP3</div>
                                <div className="text-[10px] text-slate-500">Car &amp; Mobile Audio</div>
                              </div>
                            </button>
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "wav", e)}
                              className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#0b0f19] hover:bg-white/80 flex items-center gap-2"
                            >
                              <Disc className="w-3.5 h-3.5 text-[#ff3b30]" />
                              <div>
                                <div className="font-semibold">Studio WAV Master</div>
                                <div className="text-[10px] text-slate-500">Lossless DJ Quality</div>
                              </div>
                            </button>
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "cover", e)}
                              className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#0b0f19] hover:bg-white/80 flex items-center gap-2"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                              <div>
                                <div className="font-semibold">Artwork Cover</div>
                                <div className="text-[10px] text-slate-500">HD Image</div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleCopyLink(post, e)}
                        className="p-2 rounded-full liquid-pill text-slate-600 hover:text-[#0b0f19]"
                        aria-label="Share track link"
                        title="Share link"
                      >
                        {copiedId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            </React.Fragment>
          );
        })}
      </div>

      {unlockModal && (
        <SubscribeUnlockModal
          isOpen={unlockModal.isOpen}
          trackTitle={unlockModal.trackTitle}
          formatLabel={unlockModal.formatLabel}
          downloadUrl={unlockModal.downloadUrl}
          filename={unlockModal.filename}
          onClose={() => setUnlockModal(null)}
        />
      )}
    </section>
  );
}
