"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  PlusCircle,
  Sparkles,
  Music,
  Zap,
  BookOpen,
  Film,
  AlertCircle,
} from "lucide-react";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export default function NewPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: NewPostModalProps) {
  const [postType, setPostType] = useState<"release" | "tip">("release");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subgenre, setSubgenre] = useState("Hindi Afro House");
  const [bpm, setBpm] = useState("124");
  const [key, setKey] = useState("F Minor");
  const [mood, setMood] = useState("Late Night Drive");

  // Tip specific fields
  const [tipCategory, setTipCategory] = useState("Mixing & Production");
  const [tipContent, setTipContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postType === "release" && !videoUrl.trim()) {
      setError("Please enter a valid YouTube Video URL or Video ID");
      return;
    }
    if (!title.trim()) {
      setError("Please provide a title for this post");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          videoUrl: postType === "release" ? videoUrl : undefined,
          title: title.trim(),
          subgenre,
          bpm: parseInt(bpm || "124", 10),
          key,
          mood,
          tipCategory: postType === "tip" ? tipCategory : undefined,
          tipContent: postType === "tip" ? tipContent : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create post");
      }

      onPostCreated(data.post);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#181818] border border-[#303030] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 px-5 bg-[#212121] border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff0000]/20 flex items-center justify-center text-[#ff4e45]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#f1f1f1]">Upload / Add New Post</h3>
              <p className="text-[11px] text-[#aaaaaa]">Publish directly to SUPASONIC BEATS catalog</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Type Selector (YouTube Pills) */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#121212] border border-[#282828]">
            <button
              type="button"
              onClick={() => setPostType("release")}
              className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                postType === "release"
                  ? "bg-[#ff0000] text-white shadow-md shadow-red-900/40"
                  : "text-[#aaaaaa] hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Video / Beat Release
            </button>
            <button
              type="button"
              onClick={() => setPostType("tip")}
              className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                postType === "tip"
                  ? "bg-[#ff0000] text-white shadow-md shadow-red-900/40"
                  : "text-[#aaaaaa] hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Producer Tip & Trick
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {postType === "release" ? (
            <>
              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">
                  YouTube Video URL or Video ID <span className="text-[#ff4e45]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://youtu.be/87ndOuq346I or 87ndOuq346I"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">
                  Release Title <span className="text-[#ff4e45]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KAISA NASHA | Hindi Afro House x Deep House [124 BPM]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Subgenre</label>
                  <select
                    value={subgenre}
                    onChange={(e) => setSubgenre(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff]"
                  >
                    <option value="Hindi Afro House">Hindi Afro House</option>
                    <option value="Deep House">Deep House</option>
                    <option value="Club Bangers">Club Bangers</option>
                    <option value="Late Night Drive">Late Night Drive</option>
                    <option value="Dance Pop">Hindi Dance Pop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Tempo (BPM)</label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-mono focus:outline-none focus:border-[#3ea6ff]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">
                  Tip / Masterclass Title <span className="text-[#ff4e45]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 124 BPM Sidechain Secret: How to get punchy kicks without mud"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Tip Category</label>
                <select
                  value={tipCategory}
                  onChange={(e) => setTipCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff]"
                >
                  <option value="Mixing & Production">Mixing & Production</option>
                  <option value="SEO & Algorithm">SEO & Algorithm Hacks</option>
                  <option value="Licensing & Business">Licensing & Bollywood Web Series Sync</option>
                  <option value="Sound Design">808 & Tabla Sound Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">
                  Detailed Steps
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Step 1: Set kick fundamental to 55Hz...&#10;Step 2: Optical sidechain compressor...&#10;Step 3: Export 24-bit WAV..."
                  value={tipContent}
                  onChange={(e) => setTipContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs focus:outline-none focus:border-[#3ea6ff] resize-none font-mono"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/40 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              {loading ? "Publishing..." : postType === "release" ? "Publish Video & Generate SEO" : "Publish Producer Tip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
