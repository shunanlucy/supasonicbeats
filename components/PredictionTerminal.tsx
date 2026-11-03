"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  Sliders,
  Award,
  Wallet,
  Coins,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PlusCircle,
  Crown,
  Medal,
  ShieldAlert,
  Flame,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VideoTrack {
  id: string;
  title: string;
  shortTitle: string;
  views: number;
  bpm: number;
  genre: string;
  levelTier: "BOSS" | "ELITE" | "FIGHTER" | "ROOKIE";
  levelBadge: string;
  levelColor: string;
  nextLevelName: string;
  nextLevelTarget: number;
  xpProgress: number; // 0 to 100%
  delta24h: number;
  pct24h: number;
  trend: "bull" | "bear" | "neutral";
  predictedTomorrow: {
    base: number;
    bull: number;
    bear: number;
  };
  historyCurve: { date: string; views: number; predicted?: boolean }[];
  thesis: string;
  algorithmSignal: string;
}

export default function PredictionTerminal({
  beats,
  livePulse,
  channelOverview,
}: {
  beats: any[];
  livePulse: any;
  channelOverview: any;
}) {
  // Mobile sub-view tab: 'arena' | 'chart' | 'levels' | 'bets'
  const [mobileView, setMobileView] = useState<"arena" | "chart" | "levels" | "bets">("arena");

  // Track data organized into Level Tiers
  const trackedVideos: VideoTrack[] = useMemo(() => {
    return [
      {
        id: "pgJIMI4Ihzw",
        title: "ZARA ZARA | Deep House x Hindi Deep Bass [124 BPM]",
        shortTitle: "ZARA ZARA",
        views: 582,
        bpm: 124,
        genre: "Deep House x GTA VI Bass",
        levelTier: "ELITE",
        levelBadge: "🥇 LEVEL 3: ELITE",
        levelColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        nextLevelName: "👑 BOSS TIER (1,000 Views)",
        nextLevelTarget: 1000,
        xpProgress: 58,
        delta24h: 184,
        pct24h: 46.2,
        trend: "bull",
        predictedTomorrow: {
          base: 780,
          bull: 1100,
          bear: 660,
        },
        historyCurve: [
          { date: "31 Oct", views: 4 },
          { date: "01 Nov", views: 98 },
          { date: "02 Nov", views: 398 },
          { date: "03 Nov (Today)", views: 582 },
          { date: "04 Nov (Tomorrow)", views: 780, predicted: true },
        ],
        thesis: "Accurately hit Day 3 benchmark (582v). 58% towards unlocking Boss Level!",
        algorithmSignal: "BULLISH BREAKOUT (Target: 780 - 1,100v)",
      },
      {
        id: "h7sJw_li4F0",
        title: "MAJBOOR (Duet Version) | Chill Afro House [122 BPM]",
        shortTitle: "MAJBOOR",
        views: 395,
        bpm: 122,
        genre: "Chill Afro House Duet",
        levelTier: "FIGHTER",
        levelBadge: "🥈 LEVEL 2: FIGHTER",
        levelColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
        nextLevelName: "🥇 ELITE TIER (500 Views)",
        nextLevelTarget: 500,
        xpProgress: 79,
        delta24h: 210,
        pct24h: 113.5,
        trend: "bull",
        predictedTomorrow: {
          base: 620,
          bull: 850,
          bear: 480,
        },
        historyCurve: [
          { date: "02 Nov", views: 85 },
          { date: "03 Nov (Today)", views: 395 },
          { date: "04 Nov (Tomorrow)", views: 620, predicted: true },
        ],
        thesis: "Super-fast Day 2 surge! Only 105 views away from unlocking Elite Level 3.",
        algorithmSignal: "SUPER SURGE (+113% Day 2 Wave)",
      },
      {
        id: "BuvPDZawk9M",
        title: "DEEDAR DE | Deep House x Club Bangers [124 BPM]",
        shortTitle: "DEEDAR DE",
        views: 4618,
        bpm: 124,
        genre: "Hindi Afro House Fusion",
        levelTier: "BOSS",
        levelBadge: "👑 LEVEL 4: FINAL BOSS",
        levelColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
        nextLevelName: "🏆 LEGEND TIER (5,000 Views)",
        nextLevelTarget: 5000,
        xpProgress: 92,
        delta24h: 439,
        pct24h: 10.5,
        trend: "bull",
        predictedTomorrow: {
          base: 5100,
          bull: 5600,
          bear: 4850,
        },
        historyCurve: [
          { date: "28 Oct", views: 298 },
          { date: "30 Oct", views: 3600 },
          { date: "31 Oct", views: 4179 },
          { date: "03 Nov (Today)", views: 4618 },
          { date: "04 Nov (Tomorrow)", views: 5100, predicted: true },
        ],
        thesis: "All-time Channel Record Holder. 92% towards the 5,000 Legend Benchmark!",
        algorithmSignal: "CHAMPION STATUS (Aiming 5,000+ Milestone)",
      },
      {
        id: "o68amPUakwU",
        title: "DIL LAGA LIYA | Deep House Mix [124 BPM]",
        shortTitle: "DIL LAGA LIYA",
        views: 800,
        bpm: 124,
        genre: "Deep House Bollywood Remix",
        levelTier: "ELITE",
        levelBadge: "🥇 LEVEL 3: ELITE",
        levelColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        nextLevelName: "👑 BOSS TIER (1,000 Views)",
        nextLevelTarget: 1000,
        xpProgress: 80,
        delta24h: 160,
        pct24h: 25.0,
        trend: "bull",
        predictedTomorrow: {
          base: 950,
          bull: 1200,
          bear: 870,
        },
        historyCurve: [
          { date: "29 Oct", views: 0 },
          { date: "31 Oct", views: 443 },
          { date: "02 Nov", views: 710 },
          { date: "03 Nov (Today)", views: 800 },
          { date: "04 Nov (Tomorrow)", views: 950, predicted: true },
        ],
        thesis: "80% XP to Boss Tier! Strong candidate to cross 1,000 views within 24-48 hours.",
        algorithmSignal: "ACCUMULATING TO 1K (Boss Tier Candidate)",
      },
      {
        id: "u9kx5lpIoZs",
        title: "TU MIL JAAYE | King - Shah Rukh Khan [120 BPM]",
        shortTitle: "TU MIL JAAYE",
        views: 4,
        bpm: 120,
        genre: "Bollywood Club House",
        levelTier: "ROOKIE",
        levelBadge: "🥉 LEVEL 1: ROOKIE",
        levelColor: "text-slate-300 border-slate-700 bg-slate-800",
        nextLevelName: "🥈 FIGHTER TIER (100 Views)",
        nextLevelTarget: 100,
        xpProgress: 4,
        delta24h: 4,
        pct24h: 100.0,
        trend: "neutral",
        predictedTomorrow: {
          base: 90,
          bull: 180,
          bear: 45,
        },
        historyCurve: [
          { date: "03 Nov (Launch)", views: 4 },
          { date: "04 Nov (Tomorrow)", views: 90, predicted: true },
        ],
        thesis: "Fresh drop! Seed testing tonight in 8:30-11:30 PM peak to unlock Fighter Level.",
        algorithmSignal: "SEED TEST (Target: 50 - 100v to Level Up)",
      },
      {
        id: "UjthtKkgwWU",
        title: "AAO NA | Hindi Deep House Remix [120 BPM]",
        shortTitle: "AAO NA",
        views: 2501,
        bpm: 120,
        genre: "Deep House Club Remix",
        levelTier: "BOSS",
        levelBadge: "👑 LEVEL 4: FINAL BOSS",
        levelColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
        nextLevelName: "🏆 LEGEND TIER (3,000 Views)",
        nextLevelTarget: 3000,
        xpProgress: 83,
        delta24h: 77,
        pct24h: 3.2,
        trend: "neutral",
        predictedTomorrow: {
          base: 2600,
          bull: 2750,
          bear: 2540,
        },
        historyCurve: [
          { date: "29 Oct", views: 2360 },
          { date: "31 Oct", views: 2424 },
          { date: "03 Nov (Today)", views: 2501 },
          { date: "04 Nov (Tomorrow)", views: 2600, predicted: true },
        ],
        thesis: "Evergreen playlist monster. Consistently minting passive views daily.",
        algorithmSignal: "EVERGREEN STEADY (Compounding Daily)",
      },
      {
        id: "wE7QEsQ9IPI",
        title: "KALYANI | Deep House x Afro Grooves [120 BPM]",
        shortTitle: "KALYANI",
        views: 1206,
        bpm: 120,
        genre: "Hindi Afro Grooves",
        levelTier: "BOSS",
        levelBadge: "👑 LEVEL 4: FINAL BOSS",
        levelColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
        nextLevelName: "🏆 2K MILESTONE",
        nextLevelTarget: 2000,
        xpProgress: 60,
        delta24h: 65,
        pct24h: 5.7,
        trend: "neutral",
        predictedTomorrow: {
          base: 1280,
          bull: 1350,
          bear: 1240,
        },
        historyCurve: [
          { date: "30 Oct", views: 923 },
          { date: "31 Oct", views: 1141 },
          { date: "03 Nov (Today)", views: 1206 },
          { date: "04 Nov (Tomorrow)", views: 1280, predicted: true },
        ],
        thesis: "Solid Boss status achieved. Retaining steady audience affinity.",
        algorithmSignal: "BOSS LEVEL VERIFIED (Steady 1.2K+)",
      },
    ];
  }, [livePulse]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>("pgJIMI4Ihzw");

  // Paper Trading Game State
  const [tradingData, setTradingData] = useState<any>({
    portfolio: {
      currentBalance: 16450,
      totalPnL: 6450,
      pnlPercentage: 64.5,
      winRate: 80.0,
      totalTrades: 5,
    },
    settledTrades: [],
    activePositions: [],
  });

  const [tradeType, setTradeType] = useState<"CALL (BUY)" | "PUT (SELL)">("CALL (BUY)");
  const [stakeAmount, setStakeAmount] = useState<number>(500);
  const [tradeSuccessNotice, setTradeSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/paper-trading")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setTradingData(d);
      })
      .catch(() => {});
  }, []);

  const currentVideo = useMemo(() => {
    return trackedVideos.find((v) => v.id === selectedVideoId) || trackedVideos[0];
  }, [trackedVideos, selectedVideoId]);

  const chartData = useMemo(() => {
    return currentVideo.historyCurve.map((pt) => {
      const isPredicted = !!pt.predicted;
      return {
        date: pt.date,
        ActualViews: isPredicted ? null : pt.views,
        PredictedBase: isPredicted ? pt.views : null,
        BullTarget: isPredicted ? currentVideo.predictedTomorrow.bull : null,
        BearSupport: isPredicted ? currentVideo.predictedTomorrow.bear : null,
        views: pt.views,
        isPredicted,
      };
    });
  }, [currentVideo]);

  const handlePlaceTrade = async () => {
    try {
      const res = await fetch("/api/paper-trading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: currentVideo.shortTitle,
          type: tradeType,
          targetStrike: currentVideo.predictedTomorrow.base,
          currentViews: currentVideo.views,
          stake: stakeAmount,
          targetDate: "Tomorrow (04 Nov)",
          thesis: `${tradeType === "CALL (BUY)" ? "Bullish" : "Bearish"} call on ${currentVideo.shortTitle}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTradingData((prev: any) => ({
          ...prev,
          portfolio: data.portfolio,
          activePositions: [data.newPosition, ...(prev.activePositions || [])],
        }));
        setTradeSuccessNotice(`🎉 Trade Placed! ${tradeType} on ${currentVideo.shortTitle} with ${stakeAmount} coins!`);
        setTimeout(() => setTradeSuccessNotice(null), 4000);
      }
    } catch (e) {
      alert("Failed to place trade.");
    }
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* ============================================================== */}
      {/* 🎮 1. GAMER HUD & WALLET BAR (Mobile-First Header) */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#111424] via-[#151930] to-[#12162a] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> BEATEXCHANGE 2.0 • LIVE
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
            👑 PRO TRADER • LVL 4
          </span>
        </div>

        {/* Big Wallet Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#0a0d18] p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[9px] sm:text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Wallet
            </div>
            <div className="text-base sm:text-xl font-black text-amber-300 mt-0.5 truncate">
              {tradingData.portfolio.currentBalance.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">SB</span>
            </div>
          </div>

          <div>
            <div className="text-[9px] sm:text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Total Profit
            </div>
            <div className="text-base sm:text-xl font-black text-emerald-400 mt-0.5 truncate">
              +{tradingData.portfolio.totalPnL.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[9px] sm:text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-cyan-400" /> Win Rate
            </div>
            <div className="text-base sm:text-xl font-black text-cyan-300 mt-0.5">
              {tradingData.portfolio.winRate}%
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 📱 2. GAME MODE SELECTOR TABS (Fluid Mobile Navigation) */}
      {/* ============================================================== */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101424] rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setMobileView("arena")}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            mobileView === "arena"
              ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md shadow-cyan-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> ⚡ Trade Arena
        </button>

        <button
          onClick={() => setMobileView("chart")}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            mobileView === "chart"
              ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md shadow-cyan-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-300" /> 📈 Stock Chart
        </button>

        <button
          onClick={() => setMobileView("levels")}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            mobileView === "levels"
              ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md shadow-cyan-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" /> 🏆 Level Ladder
        </button>

        <button
          onClick={() => setMobileView("bets")}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            mobileView === "bets"
              ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md shadow-cyan-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Medal className="w-3.5 h-3.5 text-emerald-400" /> 📜 My Bets ({tradingData.activePositions?.length || 0})
        </button>
      </div>

      {/* ============================================================== */}
      {/* 🚀 QUICK ASSET PICKER CAROUSEL (Pick Track To Bet/View) */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {trackedVideos.map((trk) => {
          const isSelected = trk.id === selectedVideoId;
          return (
            <button
              key={trk.id}
              onClick={() => setSelectedVideoId(trk.id)}
              className={`px-3 py-2 rounded-xl text-left transition-all shrink-0 border flex items-center gap-2.5 ${
                isSelected
                  ? "bg-gradient-to-r from-purple-900/60 to-cyan-900/40 border-cyan-400 text-white shadow-lg shadow-cyan-950/40"
                  : "bg-[#111422] border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="text-xs font-black truncate max-w-[110px]">{trk.shortTitle}</div>
                <div className="text-[10px] text-cyan-300 font-mono">{trk.views}v</div>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${trk.levelColor}`}>
                {trk.levelTier}
              </span>
            </button>
          );
        })}
      </div>

      {/* Success Notification Alert */}
      {tradeSuccessNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black rounded-xl animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {tradeSuccessNotice}
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: ⚡ TRADE ARENA (Call / Put Betting System) */}
      {/* ============================================================== */}
      {mobileView === "arena" && (
        <div className="space-y-4">
          {/* Selected Track Main Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1220] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${currentVideo.levelColor}`}>
                    {currentVideo.levelBadge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {currentVideo.bpm} BPM
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">{currentVideo.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{currentVideo.thesis}</p>
              </div>

              <div className="text-right shrink-0 bg-[#161a2e] p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Views</div>
                <div className="text-2xl font-black text-white">{currentVideo.views}</div>
                <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +{currentVideo.pct24h.toFixed(0)}% 24h
                </div>
              </div>
            </div>

            {/* Level XP Progress Bar (Gamification) */}
            <div className="bg-[#141728] p-3 rounded-xl border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Target: {currentVideo.nextLevelName}
                </span>
                <span className="text-cyan-400">{currentVideo.xpProgress}% XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentVideo.xpProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>{currentVideo.views} views</span>
                <span>Goal: {currentVideo.nextLevelTarget} views</span>
              </div>
            </div>

            {/* Strike Target Box for Tomorrow */}
            <div className="p-3 bg-[#13172b] rounded-xl border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Tomorrow Settlement Strike</span>
                <div className="text-lg font-black text-cyan-300">{currentVideo.predictedTomorrow.base} Views</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Bull Case Ceiling</span>
                <div className="text-sm font-bold text-purple-400">{currentVideo.predictedTomorrow.bull} Views</div>
              </div>
            </div>

            {/* Order Pad: Big Call / Put Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTradeType("CALL (BUY)")}
                  className={`py-3 px-3 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all border ${
                    tradeType === "CALL (BUY)"
                      ? "bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-950/60 scale-[1.02]"
                      : "bg-[#141728] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1 text-sm font-black">
                    <ArrowUpRight className="w-4 h-4 text-emerald-200" /> CALL (BUY 📈)
                  </div>
                  <span className="text-[10px] font-normal opacity-90">Will BEAT {currentVideo.predictedTomorrow.base}v</span>
                </button>

                <button
                  onClick={() => setTradeType("PUT (SELL)")}
                  className={`py-3 px-3 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all border ${
                    tradeType === "PUT (SELL)"
                      ? "bg-rose-600 border-rose-400 text-white shadow-xl shadow-rose-950/60 scale-[1.02]"
                      : "bg-[#141728] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1 text-sm font-black">
                    <ArrowDownRight className="w-4 h-4 text-rose-200" /> PUT (SELL 📉)
                  </div>
                  <span className="text-[10px] font-normal opacity-90">Will MISS {currentVideo.predictedTomorrow.base}v</span>
                </button>
              </div>

              {/* Stake Amount Selector */}
              <div className="flex items-center gap-2">
                {[250, 500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setStakeAmount(amt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all border ${
                      stakeAmount === amt
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-[#141728] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    🪙 {amt}
                  </button>
                ))}
              </div>

              {/* Big Bet Confirmation Button */}
              <button
                onClick={handlePlaceTrade}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                  tradeType === "CALL (BUY)"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-950/60"
                    : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-950/60"
                }`}
              >
                <Zap className="w-4 h-4" />
                EXECUTE {tradeType} BET ({stakeAmount} SB Coins)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: 📈 STOCK ACTION CHART & CONE */}
      {/* ============================================================== */}
      {mobileView === "chart" && (
        <div className="p-4 rounded-2xl bg-[#0f1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-white">{currentVideo.shortTitle} Views Chart</div>
              <div className="text-[10px] text-cyan-400">Dotted = Tomorrow Target Cone</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white">{currentVideo.views} views</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2538" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d111a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="ActualViews" stroke="#06b6d4" strokeWidth={3} fill="url(#chartGradient)" />
                <Line type="monotone" dataKey="PredictedBase" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="BullTarget" stroke="#c084fc" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="BearSupport" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Target Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-[9px] text-amber-400 uppercase font-bold">Bear Floor</div>
              <div className="font-black text-white">{currentVideo.predictedTomorrow.bear}v</div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-[9px] text-cyan-400 uppercase font-bold">Base Strike</div>
              <div className="font-black text-cyan-300">{currentVideo.predictedTomorrow.base}v</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-[9px] text-purple-400 uppercase font-bold">Bull Target</div>
              <div className="font-black text-purple-300">{currentVideo.predictedTomorrow.bull}v</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: 🏆 LEVEL LADDER (Gamified Catalog Progression) */}
      {/* ============================================================== */}
      {mobileView === "levels" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              Channel Catalog Level Ladder
            </h3>
            <span className="text-[10px] text-slate-400">Tap track to trade</span>
          </div>

          {trackedVideos.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVideoId(v.id);
                setMobileView("arena");
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                v.id === selectedVideoId
                  ? "bg-[#181d32] border-cyan-400 shadow-lg shadow-cyan-950/40"
                  : "bg-[#0f1220] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${v.levelColor}`}>
                  {v.levelBadge}
                </span>
                <span className="text-xs font-black text-white">{v.views.toLocaleString()} views</span>
              </div>

              <div className="text-xs font-bold text-white truncate mb-2">{v.title}</div>

              {/* Progress to Next Level */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{v.nextLevelName}</span>
                  <span className="font-bold text-cyan-300">{v.xpProgress}% XP</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    style={{ width: `${v.xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: 📜 MY BETS & VERDICT SCORECARD */}
      {/* ============================================================== */}
      {mobileView === "bets" && (
        <div className="space-y-4">
          {/* Active Positions */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-yellow-400" />
              Active Live Bets ({tradingData.activePositions?.length || 0})
            </h4>

            {tradingData.activePositions?.map((pos: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-[#12162a] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{pos.videoTitle}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                        pos.type.includes("CALL") ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {pos.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Strike Target: <strong className="text-cyan-300">{pos.targetStrike}v</strong> | Bet: {pos.stake} SB
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                  Settling 04 Nov
                </span>
              </div>
            ))}
          </div>

          {/* Settled Trades & Prediction Verdict */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              Prediction Verdicts (Past Bets Settled)
            </h4>

            {tradingData.settledTrades?.map((st: any, idx: number) => {
              const isWin = st.pnl > 0;
              return (
                <div key={idx} className="p-3 rounded-xl bg-[#12162a] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{st.videoTitle}</span>
                      <span className="text-[9px] text-slate-400 font-mono">({st.type})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Target: {st.targetStrike}v $\rightarrow$ Actual: <strong className="text-white">{st.actualSettled}v</strong>
                    </div>
                    <div className="text-[9px] text-slate-500">{st.verdict}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                      {isWin ? `+${st.pnl}` : st.pnl} SB
                    </div>
                    <span className={`text-[9px] font-bold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                      {st.pnlPct >= 0 ? `+${st.pnlPct}%` : `${st.pnlPct}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
