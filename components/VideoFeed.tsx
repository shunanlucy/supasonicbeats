"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Download,
  Share2,
  Check,
  FileAudio,
  Disc,
  Image as ImageIcon,
  MoreVertical,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";
import SubscribeAdPoster from "./SubscribeAdPoster";
import SubscribeUnlockModal from "./SubscribeUnlockModal";

interface VideoFeedProps {
  posts: FeedPost[];
  loading: boolean;
  externalSearchQuery?: string;
  onPlayVideo: (post: FeedPost) => void;
  onOpenSEO: (post: FeedPost) => void;
  onOpenTip: (post: FeedPost) => void;
  currentlyPlayingId?: string | null;
  postTypeFilter?: "all" | "release" | "tip";
}

export default function VideoFeed({
  posts,
  loading,
  externalSearchQuery = "",
  onOpenTip,
  postTypeFilter = "all",
}: VideoFeedProps) {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  const subgenres = [
    { label: "All", value: "all" },
    { label: "Indian Afro House", value: "Afro House" },
    { label: "Deep House", value: "Deep House" },
    { label: "Raga Techno", value: "Raga" },
    { label: "Club Bangers", value: "Club Bangers" },
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
    setMenuOpenId(null);
    navigator.clipboard.writeText(post.youtubeUrl || `${window.location.origin}/watch/${post.videoId}`);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTrigger = (post: FeedPost, type: "mp3" | "wav" | "cover", e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(null);
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
    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.toLowerCase();
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
      <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="space-y-3 animate-pulse">
            <div className="aspect-video w-full rounded-xl bg-[#f2f2f2]" />
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f2f2f2] flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-[#f2f2f2] rounded w-5/6" />
                <div className="h-3 bg-[#f2f2f2] rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section aria-label="YouTube Video Feed" className="space-y-5">
      {/* Authentic YouTube Horizontal Filter Chips Bar */}
      {postTypeFilter !== "tip" && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {subgenres.map((chip) => {
            const isActive = selectedGenre === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => setSelectedGenre(chip.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium whitespace-nowrap ${
                  isActive ? "yt-chip-active" : "yt-chip"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Fluid YouTube Grid: 1 Col (Mobile) -> 2 Col (Tablet) -> 3 Col (Laptop) -> 4 Col (Desktop/4K) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7">
        {filteredPosts.map((post, idx) => {
          const isMenuOpen = menuOpenId === post.id;
          const isTip = post.type === "tip";

          return (
            <React.Fragment key={post.id}>
              {idx === 8 && postTypeFilter === "release" && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  <SubscribeAdPoster variant="billboard" />
                </div>
              )}

              <article
                itemScope
                itemType={isTip ? "https://schema.org/Article" : "https://schema.org/MusicRecording"}
                className="group flex flex-col space-y-3"
              >
                <meta itemProp="name" content={post.title} />

                {isTip ? (
                  <div
                    onClick={() => onOpenTip(post)}
                    className="p-5 rounded-xl bg-[#f9f9f9] border border-black/[0.06] hover:bg-[#f2f2f2] cursor-pointer min-h-[180px] flex flex-col justify-between transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff0033]">
                        {post.tipCategory || "Producer Masterclass"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#0f0f0f] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#606060] line-clamp-3 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#0f0f0f] font-medium pt-3">
                      <span>Read Studio Note</span>
                      <ArrowUpRight className="w-4 h-4 text-[#ff0033]" />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Pure YouTube 16:9 Thumbnail Card */}
                    <div
                      onClick={() => handleCardClick(post)}
                      className="relative aspect-video w-full rounded-xl bg-black cursor-pointer overflow-hidden group/media"
                    >
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        itemProp="image"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/media:scale-[1.03]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            post.videoId === "Wqdt2D61_Ss"
                              ? "/thumbs/raat_ka_nasha.jpg"
                              : `https://i.ytimg.com/vi/${post.videoId}/hqdefault.jpg`;
                        }}
                      />

                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[11px] font-medium">
                        {post.duration || "3:24"}
                      </span>
                    </div>

                    {/* Exact YouTube Card Metadata Footer (Avatar Left + Title/Stats Middle + Action Menu Right) */}
                    <div className="flex items-start gap-3 px-0.5 relative">
                      <div
                        onClick={() => handleCardClick(post)}
                        className="w-9 h-9 rounded-full overflow-hidden bg-[#f2f2f2] flex-shrink-0 cursor-pointer border border-black/[0.06]"
                      >
                        <img
                          src="/channel_avatar.jpg"
                          alt="SUPASONIC BEATS"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => handleCardClick(post)}
                          className="text-sm font-medium text-[#0f0f0f] line-clamp-2 leading-snug cursor-pointer"
                          title={post.title}
                        >
                          {post.title}
                        </h3>

                        <div className="text-xs text-[#606060] mt-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span>SUPASONIC BEATS</span>
                            <CheckCircle2 className="w-3 h-3 text-[#606060]" />
                          </div>
                          <div>
                            {post.views.toLocaleString()} views • {post.bpm} BPM • {post.key}
                          </div>
                        </div>
                      </div>

                      {/* YouTube 3-Dots Context Menu Button (MP3, WAV, Cover, Share) */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(isMenuOpen ? null : post.id);
                          }}
                          aria-label="Track options"
                          className="p-1.5 rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 bottom-full mb-1 w-48 rounded-xl bg-white border border-black/10 p-1.5 shadow-xl z-50 text-left"
                          >
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "mp3", e)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#0f0f0f] hover:bg-[#f2f2f2] flex items-center gap-2.5"
                            >
                              <FileAudio className="w-4 h-4 text-[#065fd4]" />
                              <span>Download 320k MP3</span>
                            </button>
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "wav", e)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#0f0f0f] hover:bg-[#f2f2f2] flex items-center gap-2.5"
                            >
                              <Disc className="w-4 h-4 text-[#ff0033]" />
                              <span>Download Master WAV</span>
                            </button>
                            <button
                              onClick={(e) => handleDownloadTrigger(post, "cover", e)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#0f0f0f] hover:bg-[#f2f2f2] flex items-center gap-2.5"
                            >
                              <ImageIcon className="w-4 h-4 text-[#606060]" />
                              <span>Download Cover Art</span>
                            </button>
                            <button
                              onClick={(e) => handleCopyLink(post, e)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#0f0f0f] hover:bg-[#f2f2f2] flex items-center gap-2.5 border-t border-black/5 mt-1 pt-2"
                            >
                              {copiedId === post.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Share2 className="w-4 h-4 text-[#606060]" />
                              )}
                              <span>{copiedId === post.id ? "Link Copied" : "Share Link"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
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
