"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Share2,
  ExternalLink,
  Flame,
  Music,
  Check,
  Disc,
  FileAudio,
  Image as ImageIcon,
  Heart,
  Eye,
  Play,
} from "lucide-react";
import { FeedPost } from "@/lib/feedEngine";

interface VideoPlayerModalProps {
  post: FeedPost | null;
  onClose: () => void;
  onOpenSEO: (post: FeedPost) => void;
}

export default function VideoPlayerModal({
  post,
  onClose,
  onOpenSEO,
}: VideoPlayerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(post.youtubeUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: "mp3" | "wav" | "cover") => {
    const link = document.createElement("a");
    if (type === "mp3") {
      link.href = post.mp3DownloadUrl || "/audio/clover_clip.mp3";
      link.download = `${post.title.replace(/[/\\?%*:|"<>]/g, "-")}_320kbps.mp3`;
    } else if (type === "wav") {
      link.href = post.wavDownloadUrl || "/audio/clover_clip.mp3";
      link.download = `${post.title.replace(/[/\\?%*:|"<>]/g, "-")}_Studio_Master.wav`;
    } else if (type === "cover") {
      link.href = post.coverDownloadUrl || post.thumbnail;
      link.download = `${post.title.replace(/[/\\?%*:|"<>]/g, "-")}_Cover_4K.jpg`;
      link.target = "_blank";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#181818] border border-[#303030] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-3.5 px-5 bg-[#212121] border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#272727] border border-[#303030]">
              <img src="/channel_avatar.jpg" alt="Supasonic Beats" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#f1f1f1] flex items-center gap-1.5">
                <span>SUPASONIC BEATS</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#aaaaaa] text-black flex items-center justify-center text-[9px] font-black">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-[#aaaaaa]">{post.formattedDate} • Studio Master</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <Play className="w-3 h-3 fill-current" /> Subscribe
            </a>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
              title="Copy Video Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={post.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Details & Actions Footer */}
        <div className="p-5 md:p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#272727] text-[#f1f1f1]">
                  {post.bpm} BPM
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#272727] text-[#aaaaaa]">
                  {post.key}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#272727] text-[#ff4e45]">
                  {post.subgenre}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#f1f1f1]">{post.title}</h2>
              <p className="text-xs text-[#aaaaaa] leading-relaxed max-w-3xl">{post.caption}</p>
            </div>

            {/* Engagement Pill */}
            <div className="flex items-center gap-3 bg-[#212121] border border-[#282828] p-2 px-3.5 rounded-full self-start">
              <span className="text-xs font-medium text-[#f1f1f1] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#3ea6ff]" /> {post.views.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-[#f1f1f1] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#ff4e45]" /> {post.likes.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Download Options Bar */}
          <div className="pt-3 border-t border-[#282828] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#aaaaaa] font-medium mr-1">Direct Download:</span>
              <button
                onClick={() => handleDownload("mp3")}
                className="px-3.5 py-2 rounded-full bg-[#3ea6ff] hover:bg-[#65b8ff] text-black font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <FileAudio className="w-3.5 h-3.5" /> 320kbps MP3
              </button>
              <button
                onClick={() => handleDownload("wav")}
                className="px-3.5 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <Disc className="w-3.5 h-3.5" /> Studio WAV Master
              </button>
              <button
                onClick={() => handleDownload("cover")}
                className="px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> 4K Artwork
              </button>
            </div>

            {post.seoData && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSEO(post);
                }}
                className="px-3.5 py-2 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-[#ff0000]" /> View Viral Tags
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
