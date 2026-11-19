"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Flame,
  Zap,
  Tag,
  Radio,
  Target,
  FileText,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Share2,
  Music,
  Play,
} from "lucide-react";
import { generateSongMetadata, GeneratedMetadata } from "@/lib/metadataGenerator";
import SubscribeAdPoster from "./SubscribeAdPoster";

export default function SEOGeneratorTab() {
  const [songName, setSongName] = useState("KAISA NASHA");
  const [subgenre, setSubgenre] = useState("Hindi Afro House");
  const [bpm, setBpm] = useState("124");
  const [key, setKey] = useState("F Minor");
  const [mood, setMood] = useState("Late Night Drive");

  // Tap Tempo state
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [tappedBpm, setTappedBpm] = useState<number | null>(null);
  const [isTapPulsing, setIsTapPulsing] = useState(false);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTap = () => {
    const now = performance.now();
    setIsTapPulsing(true);
    setTimeout(() => setIsTapPulsing(false), 150);

    const newTimes = [...tapTimes.slice(-4), now];
    setTapTimes(newTimes);

    if (newTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      let calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm > 180) calculatedBpm = Math.round(calculatedBpm / 2);
      if (calculatedBpm < 60) calculatedBpm = calculatedBpm * 2;

      setTappedBpm(calculatedBpm);
      setBpm(calculatedBpm.toString());

      if (calculatedBpm >= 122 && calculatedBpm <= 126) setSubgenre("Hindi Afro House");
      else if (calculatedBpm > 126 && calculatedBpm <= 132) setSubgenre("Dance Pop x Club Bangers");
      else if (calculatedBpm >= 116 && calculatedBpm < 122) setSubgenre("Deep House");
    }
  };

  const metadata: GeneratedMetadata = generateSongMetadata({
    songName,
    subgenre,
    bpm,
    key,
    mood,
  });

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#181818] border border-[#282828]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff4e45] mb-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          YouTube High SEO & Discovery Engine
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#f1f1f1] tracking-tight">
          Algorithmic High-CTR Titles & Viral Sound Tags
        </h2>
        <p className="text-xs text-[#aaaaaa] mt-1 max-w-2xl leading-relaxed">
          Optimized for YouTube search suggestion algorithms, YouTube Shorts sound pages, and late-night Hindi Afro House listeners. Maximize organic impressions, click-through-rates, and audio downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form & Tap-Tempo */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] space-y-4">
            <h3 className="text-sm font-bold text-[#f1f1f1] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ff0000]" /> Track Parameters
            </h3>

            {/* Song Name */}
            <div>
              <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Song / Beat Title</label>
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="e.g. KAISA NASHA, DILBAR, TERE BINA"
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-bold focus:outline-none focus:border-[#3ea6ff] uppercase"
              />
            </div>

            {/* Subgenre */}
            <div>
              <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Subgenre</label>
              <select
                value={subgenre}
                onChange={(e) => setSubgenre(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-medium focus:outline-none"
              >
                <option value="Hindi Afro House">Hindi Afro House (Dominant)</option>
                <option value="Deep House">Deep House</option>
                <option value="Club Bangers">Club Bangers / Festival Drop</option>
                <option value="Late Night Drive">Late Night Drive / Chill House</option>
                <option value="Dance Pop">Hindi Dance Pop</option>
                <option value="Dark Phonk & Trance">Dark Phonk & Trance</option>
              </select>
            </div>

            {/* BPM & Key */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Tempo (BPM)</label>
                <input
                  type="text"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Musical Key</label>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-medium focus:outline-none"
                >
                  <option value="F Minor">F Minor</option>
                  <option value="C Minor">C Minor</option>
                  <option value="G Minor">G Minor</option>
                  <option value="D Minor">D Minor</option>
                  <option value="A# Minor">A# Minor</option>
                  <option value="E Minor">E Minor</option>
                </select>
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Target Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-medium focus:outline-none"
              >
                <option value="Late Night Drive">Late Night Drive (High Retention)</option>
                <option value="Club Banger">Club Banger & DJ Set Opener</option>
                <option value="Chill Sunset">Chill Sunset & Beach Vibe</option>
                <option value="Gym Energy">Gym Workout & Sub-Bass Motivation</option>
                <option value="Reels Viral">Reels & TikTok Viral Audio</option>
              </select>
            </div>
          </div>

          {/* Tap-Tempo Tool */}
          <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] text-center space-y-3">
            <div className="text-xs font-bold text-[#aaaaaa] flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Tap-Tempo Detection
            </div>
            <button
              onClick={handleTap}
              className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 ${
                isTapPulsing
                  ? "bg-white text-black scale-105"
                  : "bg-[#ff0000] hover:bg-[#cc0000] text-white shadow-md shadow-red-900/40"
              }`}
            >
              TAP BEAT TEMPO HERE 🥁
            </button>
            {tappedBpm && (
              <div className="text-xs text-[#aaaaaa] font-medium">
                Detected Tempo: <span className="text-[#3ea6ff] font-bold">{tappedBpm} BPM</span>
              </div>
            )}
          </div>

          {/* Compact Subscribe Poster */}
          <SubscribeAdPoster variant="compact" />
        </div>

        {/* Right Columns: Generated Titles, Tags, and Audience Blueprint */}
        <div className="lg:col-span-2 space-y-5">
          {/* 5 High-CTR Trending Titles */}
          <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#282828] pb-2">
              <h3 className="text-xs font-bold text-[#f1f1f1] flex items-center gap-2 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#ff0000]" />
                5 High-CTR YouTube Algorithm Titles
              </h3>
              <span className="text-[10px] text-[#717171] font-mono">Rank #1 Formula</span>
            </div>

            <div className="space-y-2.5">
              {metadata.titles.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#212121] border border-[#282828] hover:border-[#383838] transition-colors group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#ff4e45]">{t.type}</span>
                    <span className="text-[#717171] font-mono text-[10px]">{t.charCount} chars</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#f1f1f1] group-hover:text-white transition-colors font-mono">
                      {t.title}
                    </p>
                    <button
                      onClick={() => handleCopy(t.title, `title-${idx}`)}
                      className="p-1.5 rounded-lg bg-[#272727] hover:bg-[#3f3f3f] text-[#aaaaaa] hover:text-white transition-colors flex-shrink-0"
                      title="Copy Title"
                    >
                      {copiedKey === `title-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#aaaaaa] mt-1">{t.advantage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 25+ Algorithmic Tags (Under 500 Chars) */}
          <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#282828] pb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#3ea6ff]" />
                <h3 className="text-xs font-bold text-[#f1f1f1] uppercase tracking-wider">
                  Algorithmic Tags & Keywords
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#aaaaaa] font-mono">
                  <strong className="text-emerald-400">{metadata.totalTagChars}</strong> / 500 chars
                </span>
                <button
                  onClick={() => handleCopy(metadata.tagsString, "all-tags")}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#d9d9d9] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  {copiedKey === "all-tags" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy All Tags
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tag Badges */}
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-3 rounded-xl bg-[#212121] border border-[#282828]">
              {metadata.tagList.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-[#181818] text-[#aaaaaa] border border-[#303030]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Listener Blueprint & Description Template */}
          <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f1f1f1] uppercase tracking-wider border-b border-[#282828] pb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Listener Discovery & Ranking Strategy
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#212121] border border-[#282828]">
                <span className="font-bold text-[#ff4e45] block mb-1">🎧 YouTube Shorts Audio Pages</span>
                <p className="text-[#aaaaaa] text-[11px] leading-relaxed">
                  Clip the drop from <strong className="text-white">0:45 to 1:00</strong>. Use text: <em>"POV: You discovered Hindi Afro House for late night drives 🔊"</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#212121] border border-[#282828]">
                <span className="font-bold text-[#3ea6ff] block mb-1">🚗 Car Audio & Late Night Streams</span>
                <p className="text-[#aaaaaa] text-[11px] leading-relaxed">
                  Target search terms: <em>"Hindi car bass songs", "midnight club mix", "desi deep house 124 bpm"</em>. These listeners have 85%+ retention!
                </p>
              </div>
            </div>

            {/* Description Template */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#f1f1f1] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> YouTube Description Box
                </span>
                <button
                  onClick={() => handleCopy(metadata.descriptionTemplate, "description")}
                  className="text-xs text-[#3ea6ff] hover:underline font-semibold flex items-center gap-1"
                >
                  {copiedKey === "description" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copy Description
                </button>
              </div>
              <textarea
                readOnly
                value={metadata.descriptionTemplate}
                rows={4}
                className="w-full p-3 rounded-xl bg-[#121212] border border-[#303030] font-mono text-[11px] text-[#aaaaaa] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
