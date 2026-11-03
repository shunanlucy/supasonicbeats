"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Zap,
  TrendingUp,
  Clock,
  Flame,
  ChevronRight,
  Award,
  Shield,
  ArrowUpRight,
  Play,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Sparkles,
  Star,
  Target,
  ArrowRight,
} from "lucide-react";

export interface BatchVideo {
  id: string;
  title: string;
  views: number;
  publishedAt?: string;
  likes?: number;
  comments?: number;
  dailyRate?: number;
  daysActive?: number;
  batchPromotionSpeed?: string;
  nextMilestone?: number;
  viewsNeeded?: number;
  estimatedDaysToNextBatch?: string;
  batchRank?: number;
  impressionEstimate?: string;
  algorithmSignal?: string;
}

interface AlgorithmBatchLadderProps {
  catalogVideos?: any[];
  onPlayVideo?: (video: any) => void;
}

export default function AlgorithmBatchLadder({
  catalogVideos = [],
  onPlayVideo,
}: AlgorithmBatchLadderProps) {
  // Selected Batch filter tab: 'all' | 'batch1' | 'batch2' | 'batch3' | 'batch4'
  const [selectedBatch, setSelectedBatch] = useState<"all" | "batch1" | "batch2" | "batch3" | "batch4">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Process all catalog videos into batches
  const processedVideos: BatchVideo[] = useMemo(() => {
    const now = new Date().getTime();

    return catalogVideos.map((v) => {
      const views = typeof v.views === "number" ? v.views : parseInt(v.views || "0", 10);
      const pubDate = v.publishedAt ? new Date(v.publishedAt).getTime() : now - 4 * 24 * 3600 * 1000;
      const daysActive = Math.max(1, Math.round((now - pubDate) / (1000 * 60 * 60 * 24)));
      const dailyRate = Math.max(1, Math.round((views / daysActive) * 10) / 10);

      // Determine Batch
      let nextMilestone = 250;
      let batchPromotionSpeed = "Standard Pace";
      let estimatedDaysToNextBatch = "3-5 Days";
      let impressionEstimate = "~1,500 - 3,000 Impressions";
      let algorithmSignal = "Initial Seed Audience Testing";

      if (views >= 2500) {
        // Batch 4: Champion (>2,500v)
        nextMilestone = 5000;
        const remaining = Math.max(0, 5000 - views);
        const days = Math.max(1, Math.round(remaining / Math.max(10, dailyRate)));
        estimatedDaysToNextBatch = days <= 2 ? "24-48 Hours" : `${days} Days`;
        batchPromotionSpeed = "🚀 RECORD-BREAKING (Cleared Batch 1 in 18h)";
        impressionEstimate = "100,000+ Autopilot Impressions";
        algorithmSignal = "🏆 EVERGREEN AUTOPILOT (High Repeat Retention)";
      } else if (views >= 800) {
        // Batch 3: Breakout (800 - 2,500v)
        nextMilestone = 2500;
        const remaining = Math.max(0, 2500 - views);
        const days = Math.max(1, Math.round(remaining / Math.max(10, dailyRate)));
        estimatedDaysToNextBatch = days <= 2 ? "1-2 Days" : `${days} Days`;
        batchPromotionSpeed = dailyRate >= 50 ? "⚡ FAST-TRACK (Cleared Batch 2 in 48h)" : "Steady Pace";
        impressionEstimate = "~25,000 - 60,000 Impressions";
        algorithmSignal = "🔥 BROWSE & SUGGESTED EXPANSION";
      } else if (views >= 250) {
        // Batch 2: Momentum (250 - 800v)
        nextMilestone = 800;
        const remaining = Math.max(0, 800 - views);
        const days = Math.max(1, Math.round(remaining / Math.max(5, dailyRate)));
        estimatedDaysToNextBatch = days <= 2 ? "24-48 Hours" : `${days} Days`;
        batchPromotionSpeed = dailyRate >= 80 ? "⚡ LIGHTNING PROMOTION (Batch 1 in 36h!)" : "Organic Growth";
        impressionEstimate = "~5,000 - 15,000 Impressions";
        algorithmSignal = "📈 GENRE POOL AUDIENCE TESTING (124 BPM)";
      } else {
        // Batch 1: Seed (<250v)
        nextMilestone = 250;
        const remaining = Math.max(0, 250 - views);
        const days = Math.max(1, Math.round(remaining / Math.max(3, dailyRate)));
        estimatedDaysToNextBatch = days <= 2 ? "2-3 Days" : `${days} Days`;
        batchPromotionSpeed = "Seed Phase Testing";
        impressionEstimate = "~1,000 - 3,000 Impressions";
        algorithmSignal = "🌱 SEED TESTING (CTR & Hook Analysis)";
      }

      return {
        id: v.id,
        title: v.title,
        views,
        likes: v.likes || 0,
        comments: v.comments || 0,
        publishedAt: v.publishedAt,
        daysActive,
        dailyRate,
        batchPromotionSpeed,
        nextMilestone,
        viewsNeeded: Math.max(0, nextMilestone - views),
        estimatedDaysToNextBatch,
        impressionEstimate,
        algorithmSignal,
      };
    });
  }, [catalogVideos]);

  // Separate into 4 distinct batches
  const batch4Videos = useMemo(() => {
    return processedVideos
      .filter((v) => v.views >= 2500)
      .sort((a, b) => b.views - a.views)
      .map((v, i) => ({ ...v, batchRank: i + 1 }));
  }, [processedVideos]);

  const batch3Videos = useMemo(() => {
    return processedVideos
      .filter((v) => v.views >= 800 && v.views < 2500)
      .sort((a, b) => b.views - a.views)
      .map((v, i) => ({ ...v, batchRank: i + 1 }));
  }, [processedVideos]);

  const batch2Videos = useMemo(() => {
    return processedVideos
      .filter((v) => v.views >= 250 && v.views < 800)
      .sort((a, b) => b.views - a.views)
      .map((v, i) => ({ ...v, batchRank: i + 1 }));
  }, [processedVideos]);

  const batch1Videos = useMemo(() => {
    return processedVideos
      .filter((v) => v.views < 250)
      .sort((a, b) => b.views - a.views)
      .map((v, i) => ({ ...v, batchRank: i + 1 }));
  }, [processedVideos]);

  // Filtered view based on tab & search
  const displayedVideos = useMemo(() => {
    let list: BatchVideo[] = [];
    if (selectedBatch === "batch4") list = batch4Videos;
    else if (selectedBatch === "batch3") list = batch3Videos;
    else if (selectedBatch === "batch2") list = batch2Videos;
    else if (selectedBatch === "batch1") list = batch1Videos;
    else list = [...batch4Videos, ...batch3Videos, ...batch2Videos, ...batch1Videos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }
    return list;
  }, [selectedBatch, searchQuery, batch4Videos, batch3Videos, batch2Videos, batch1Videos]);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. HEADER: ALGORITHM COHORT / BATCH PROMOTION ENGINE */}
      {/* ============================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#11131f] via-[#141629] to-[#121222] border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> YouTube Impression Cohorts & Batch System
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              ALGORITHM BATCH PROMOTION LADDER
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              YouTube algorithm kisi video ko direct sabko nahi dikhata. Pehle Batch 1 (0-250v) mein test karta hai, high retention milne par Batch 2 (250-800v) aur fir Batch 3/4 ke wide browse recommendations mein promote karta hai.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#17192a] border border-purple-500/40 p-4 rounded-2xl shadow-xl text-center min-w-[240px] w-full lg:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
              CATALOG PROMOTION RATE
            </span>
            <div className="text-2xl md:text-3xl font-black text-white mt-0.5">
              {batch4Videos.length + batch3Videos.length + batch2Videos.length}{" "}
              <span className="text-sm font-semibold text-purple-400">Graduated</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium block mt-1">
              {batch4Videos.length + batch3Videos.length + batch2Videos.length} of {processedVideos.length} tracks cleared Batch 1!
            </span>
          </div>
        </div>

        {/* 4 Batch Summary Progression Cards */}
        <div className="mt-7 pt-6 border-t border-zinc-800/80 grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {/* BATCH 1 */}
          <button
            onClick={() => setSelectedBatch("batch1")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedBatch === "batch1"
                ? "bg-zinc-800/90 border-zinc-500 shadow-md ring-1 ring-white/20"
                : "bg-[#161826]/80 border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                🌱 BATCH 1
              </span>
              <span className="text-xs font-black text-white">{batch1Videos.length} Tracks</span>
            </div>
            <h5 className="text-sm font-black text-zinc-200">Seed Testing</h5>
            <span className="text-[11px] text-zinc-400 block mt-0.5">&lt; 250 Views</span>
            <span className="text-[10px] text-zinc-500 block mt-2">~1.5K Test Impressions</span>
          </button>

          {/* BATCH 2 */}
          <button
            onClick={() => setSelectedBatch("batch2")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedBatch === "batch2"
                ? "bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-400/30"
                : "bg-[#161826]/80 border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                📈 BATCH 2
              </span>
              <span className="text-xs font-black text-cyan-300">{batch2Videos.length} Tracks</span>
            </div>
            <h5 className="text-sm font-black text-white">Momentum Pool</h5>
            <span className="text-[11px] text-cyan-400/90 block mt-0.5">250 – 800 Views</span>
            <span className="text-[10px] text-zinc-500 block mt-2">~10K Genre Impressions</span>
          </button>

          {/* BATCH 3 */}
          <button
            onClick={() => setSelectedBatch("batch3")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedBatch === "batch3"
                ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-400/30"
                : "bg-[#161826]/80 border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🔥 BATCH 3
              </span>
              <span className="text-xs font-black text-amber-300">{batch3Videos.length} Tracks</span>
            </div>
            <h5 className="text-sm font-black text-white">Breakout Expansion</h5>
            <span className="text-[11px] text-amber-400/90 block mt-0.5">800 – 2,500 Views</span>
            <span className="text-[10px] text-zinc-500 block mt-2">~50K Browse Impressions</span>
          </button>

          {/* BATCH 4 */}
          <button
            onClick={() => setSelectedBatch("batch4")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedBatch === "batch4"
                ? "bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-400/30"
                : "bg-[#161826]/80 border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                👑 BATCH 4
              </span>
              <span className="text-xs font-black text-purple-300">{batch4Videos.length} Tracks</span>
            </div>
            <h5 className="text-sm font-black text-white">Champion Autopilot</h5>
            <span className="text-[11px] text-purple-400/90 block mt-0.5">&gt; 2,500 Views</span>
            <span className="text-[10px] text-zinc-500 block mt-2">100K+ Autopilot Loop</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FASTEST GRADUATION SPEED CHAMPIONS (Highlights) */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#141418] border border-zinc-800/90 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-bold text-white">
            FASTEST BATCH GRADUATION CHAMPIONS (Record Breakers)
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Yeh tracks Batch 1 (&lt;250 views) se nikal kar sabse kam dino mein agle batches mein promote huye:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Champion 1: DEEDAR DE */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1b1528] to-[#14121e] border border-purple-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                👑 ALL-TIME RECORD #1
              </span>
              <span className="text-xs font-bold text-emerald-400">772 v/day</span>
            </div>
            <h4 className="text-sm font-black text-white">DEEDAR DE [124 BPM]</h4>
            <div className="my-1.5 text-xl font-black text-white">
              4,634 <span className="text-xs font-normal text-zinc-400">views (Batch 4 Champion)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/40 text-[11px] text-zinc-300 leading-relaxed">
              ⚡ <strong>Graduation Velocity:</strong> Batch 1 (&lt;250v) sirf <strong>18 ghante</strong> mein clear kiya! Batch 2 (800v) <strong>48 ghante</strong> mein cross kiya.
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-purple-300">
              <span>Next Goal: 5,000 Milestone</span>
              <span>ETA: 24-48 Hours</span>
            </div>
          </div>

          {/* Champion 2: MAJBOOR */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#151c24] to-[#12161c] border border-cyan-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                🚀 FASTEST DAY 2 PACE
              </span>
              <span className="text-xs font-bold text-emerald-400">163 v/day</span>
            </div>
            <h4 className="text-sm font-black text-white">MAJBOOR (Duet Version)</h4>
            <div className="my-1.5 text-xl font-black text-white">
              490 <span className="text-xs font-normal text-zinc-400">views (Batch 2 High Rank)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-900/40 text-[11px] text-zinc-300 leading-relaxed">
              ⚡ <strong>Graduation Velocity:</strong> Batch 1 (&lt;250v) sirf <strong>36 ghante</strong> mein cross kiya with 78.6% completion rate!
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-cyan-300">
              <span>Next Goal: 500 Views (Elite)</span>
              <span>ETA: &lt; 6 Hours (10 views left)</span>
            </div>
          </div>

          {/* Champion 3: BHAR LE TU */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#221c15] to-[#191512] border border-amber-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                🎯 BATCH 3 BOSS FIGHT
              </span>
              <span className="text-xs font-bold text-amber-400">99% to 1K</span>
            </div>
            <h4 className="text-sm font-black text-white">BHAR LE TU [124 BPM]</h4>
            <div className="my-1.5 text-xl font-black text-white">
              992 <span className="text-xs font-normal text-zinc-400">/ 1,000 views</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/40 text-[11px] text-zinc-300 leading-relaxed">
              ⚡ <strong>Graduation Velocity:</strong> Steady 85 views/day run. Sirf <strong>8 views bache hain</strong> 1,000 views cross karke 5th Boss Track banne ke liye!
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-amber-300">
              <span>Next Goal: 1,000 Milestone</span>
              <span>ETA: Imminent (&lt; 12 Hours)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BATCH TRACK DIRECTORY WITH RANKS & PREDICTION ETAs */}
      {/* ============================================================== */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#141418] border border-zinc-800/90 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-zinc-300" />
              <span>BATCH RANKING & PROMOTION FORECAST ({displayedVideos.length} Tracks)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Har batch mein track ki rank, velocity rate aur agle batch tak pahunchne ka prediction time:
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search track in batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181822] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Batch Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold mb-5">
          {[
            { id: "all", label: `All Tracks (${processedVideos.length})` },
            { id: "batch4", label: `👑 Batch 4: Champion (${batch4Videos.length})` },
            { id: "batch3", label: `🔥 Batch 3: Breakout (${batch3Videos.length})` },
            { id: "batch2", label: `📈 Batch 2: Momentum (${batch2Videos.length})` },
            { id: "batch1", label: `🌱 Batch 1: Seed (${batch1Videos.length})` },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedBatch(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedBatch === btn.id
                  ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-950/50"
                  : "bg-zinc-800/70 text-zinc-400 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Table / Cards List of Videos with Detailed Batch Metrics */}
        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
          {displayedVideos.map((video) => {
            const views = video.views;
            let batchBadge = "Batch 1 • Seed";
            let batchColor = "text-zinc-400 border-zinc-700 bg-zinc-800/40";
            let progressToNextPct = Math.min(100, Math.round((views / 250) * 100));

            if (views >= 2500) {
              batchBadge = "Batch 4 • Champion";
              batchColor = "text-purple-300 border-purple-500/40 bg-purple-950/30";
              progressToNextPct = Math.min(100, Math.round((views / 5000) * 100));
            } else if (views >= 800) {
              batchBadge = "Batch 3 • Breakout";
              batchColor = "text-amber-300 border-amber-500/40 bg-amber-950/30";
              progressToNextPct = Math.min(100, Math.round(((views - 800) / 1700) * 100));
            } else if (views >= 250) {
              batchBadge = "Batch 2 • Momentum";
              batchColor = "text-cyan-300 border-cyan-500/40 bg-cyan-950/30";
              progressToNextPct = Math.min(100, Math.round(((views - 250) / 550) * 100));
            }

            return (
              <div
                key={video.id}
                className="p-4 rounded-2xl bg-[#171926] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Rank, Badge & Title */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {video.batchRank && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/10 text-white">
                        Rank #{video.batchRank}
                      </span>
                    )}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${batchColor} uppercase`}>
                      {batchBadge}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {video.daysActive} Days Active • {video.dailyRate} v/day pace
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1" title={video.title}>
                    {video.title}
                  </h4>

                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    {video.algorithmSignal} ({video.impressionEstimate})
                  </span>
                </div>

                {/* Middle: Promotion Progress & ETA */}
                <div className="w-full md:w-64 bg-[#10121d] p-3 rounded-xl border border-zinc-800/60">
                  <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
                    <span className="text-zinc-400">Next Target: {video.nextMilestone?.toLocaleString()}v</span>
                    <span className="text-purple-300 font-bold">{progressToNextPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(5, progressToNextPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1.5">
                    <span>{video.viewsNeeded?.toLocaleString()} views needed</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> ETA: {video.estimatedDaysToNextBatch}
                    </span>
                  </div>
                </div>

                {/* Right: Views & Action */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                  <div className="text-right">
                    <div className="text-lg font-black text-white">
                      {views.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-zinc-400 block">Total Views</span>
                  </div>

                  {onPlayVideo && (
                    <button
                      onClick={() => onPlayVideo(video)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 transition-all"
                    >
                      <Play className="w-3 h-3 fill-purple-300" /> Preview
                    </button>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all"
                    title="Open on YouTube"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
