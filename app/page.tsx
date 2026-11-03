"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  PlayCircle,
  Eye,
  Clock,
  Users,
  TrendingUp,
  Share2,
  Music,
  Disc,
  Flame,
  Radio,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Sparkles,
  BarChart3,
  Globe2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  RadioTower,
  Target,
  Wand2,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Award,
  Trophy,
  SlidersHorizontal,
  Stethoscope,
  Copy,
  Layers,
  FileText,
  AlertCircle,
  Printer,
  Compass,
  Radar,
  HelpCircle,
  RotateCcw,
  Volume2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PredictionTerminal from "@/components/PredictionTerminal";
import ChannelLevelSystem from "@/components/ChannelLevelSystem";
import AlgorithmBatchLadder from "@/components/AlgorithmBatchLadder";

export default function Dashboard() {
  const [authState, setAuthState] = useState<{
    loading: boolean;
    authenticated: boolean;
    channel?: any;
    error?: string;
  }>({
    loading: true,
    authenticated: false,
  });

  const [periodDays, setPeriodDays] = useState<number>(28);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Tabs: levels | prediction | audience | live | competitor | trends | ctr | audit | builder | velocity | epk | beats | batches
  const [activeTab, setActiveTab] = useState<
    "levels" | "prediction" | "audience" | "live" | "competitor" | "trends" | "ctr" | "audit" | "builder" | "velocity" | "epk" | "beats" | "batches"
  >("levels");
  const [levelTierFilter, setLevelTierFilter] = useState<"all" | "boss" | "elite" | "fighter" | "rookie">("all");

  // Audience & Subscriber Loyalty state
  const [audienceData, setAudienceData] = useState<any>(null);
  const [audienceLoading, setAudienceLoading] = useState<boolean>(false);

  // Live Pulse
  const [livePulse, setLivePulse] = useState<any>(null);
  const [autoRefreshLive, setAutoRefreshLive] = useState<boolean>(true);
  const [pulseLoading, setPulseLoading] = useState<boolean>(false);
  const liveIntervalRef = useRef<any>(null);

  // Competitor Radar state (Inspired by AgriciDaniel/claude-youtube)
  const [competitorQuery, setCompetitorQuery] = useState<string>("Hindi Afro House");
  const [competitorData, setCompetitorData] = useState<any>(null);
  const [competitorLoading, setCompetitorLoading] = useState<boolean>(false);

  // CTR Evaluator
  const [inputTitle, setInputTitle] = useState<string>("PAAS AA | Hindi Afro House x Deep House | Supasonic Beats [124 BPM]");
  const [ctrResult, setCtrResult] = useState<any>(null);
  const [evaluatingCtr, setEvaluatingCtr] = useState<boolean>(false);

  // Catalog Audit state
  const [auditData, setAuditData] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [auditFilter, setAuditFilter] = useState<"all" | "critical" | "polish">("all");

  // Metadata Builder state
  const [builderInput, setBuilderInput] = useState({
    songName: "TERE BINA",
    subgenre: "Hindi Afro House",
    bpm: "124",
    key: "F Minor",
    mood: "Late Night Drive",
  });
  const [generatedMeta, setGeneratedMeta] = useState<any>(null);
  const [generatingMeta, setGeneratingMeta] = useState<boolean>(false);

  // Tap Tempo BPM Finder state
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [tappedBpm, setTappedBpm] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState<number>(0);
  const [isTapPulsing, setIsTapPulsing] = useState<boolean>(false);

  // Copy feedbacks
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authState.authenticated && autoRefreshLive) {
      liveIntervalRef.current = setInterval(() => {
        pingLivePulse(false);
      }, 30000);
    } else {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    }
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [authState.authenticated, autoRefreshLive]);

  useEffect(() => {
    evaluateTitle(inputTitle);
    handleGenerateMetadata();
    fetchCompetitors(competitorQuery);
  }, []);

  // Keyboard Spacebar listener for Tap Tempo when on builder tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "builder") return;
      // If typing in an input, don't hijack space
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleTapTempo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, tapTimes]);

  const handleTapTempo = () => {
    const now = performance.now();
    setIsTapPulsing(true);
    setTimeout(() => setIsTapPulsing(false), 120);

    // Reset if last tap was more than 2.5 seconds ago
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2500) {
      setTapTimes([now]);
      setTapCount(1);
      return;
    }

    const newTapTimes = [...tapTimes, now].slice(-8); // keep last 8 taps
    setTapTimes(newTapTimes);
    setTapCount((prev) => prev + 1);

    if (newTapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      let calculatedBpm = Math.round(60000 / avgInterval);

      if (calculatedBpm > 200) calculatedBpm = Math.round(calculatedBpm / 2);
      if (calculatedBpm < 60) calculatedBpm = calculatedBpm * 2;

      setTappedBpm(calculatedBpm);

      // Automatically suggest genre based on detected BPM
      let suggestedGenre = builderInput.subgenre;
      if (calculatedBpm >= 120 && calculatedBpm <= 125) suggestedGenre = "Hindi Afro House";
      else if (calculatedBpm > 125 && calculatedBpm <= 132) suggestedGenre = "Dance Pop x Club Bangers";
      else if (calculatedBpm >= 115 && calculatedBpm < 120) suggestedGenre = "Deep House";
      else if (calculatedBpm > 132) suggestedGenre = "Dark Phonk & Trance";

      const updatedInput = {
        ...builderInput,
        bpm: calculatedBpm.toString(),
        subgenre: suggestedGenre,
      };

      setBuilderInput(updatedInput);

      // Auto update titles and tags immediately
      generateMetadataDirect(updatedInput);
    }
  };

  const resetTapTempo = () => {
    setTapTimes([]);
    setTappedBpm(null);
    setTapCount(0);
  };

  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      if (data.authenticated) {
        setAuthState({
          loading: false,
          authenticated: true,
          channel: data.channel,
        });
        loadAnalytics(periodDays);
        pingLivePulse(true);
        loadCatalogAudit();
        loadAudienceData();
      } else {
        setAuthState({
          loading: false,
          authenticated: false,
          error: data.error,
        });
      }
    } catch (e: any) {
      setAuthState({
        loading: false,
        authenticated: false,
        error: e.message,
      });
    }
  };

  const loadAudienceData = async () => {
    try {
      setAudienceLoading(true);
      const res = await fetch("/api/audience");
      const data = await res.json();
      if (data.success) {
        setAudienceData(data);
      }
    } catch (e) {
      console.warn("Failed to load audience data:", e);
    } finally {
      setAudienceLoading(false);
    }
  };

  const pingLivePulse = async (showSpinner = true) => {
    try {
      if (showSpinner) setPulseLoading(true);
      const res = await fetch("/api/live-pulse");
      const data = await res.json();
      if (data.success) {
        setLivePulse(data);
      }
    } catch (e) {
      console.warn("Live pulse fetch failed:", e);
    } finally {
      if (showSpinner) setPulseLoading(false);
    }
  };

  const fetchCompetitors = async (query: string) => {
    try {
      setCompetitorLoading(true);
      const res = await fetch(`/api/competitor-radar?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setCompetitorData(data);
      }
    } catch (e) {
      console.error("Competitor radar error:", e);
    } finally {
      setCompetitorLoading(false);
    }
  };

  const loadAnalytics = async (days: number) => {
    try {
      setDataLoading(true);
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.status === 401) {
        setAuthState({ loading: false, authenticated: false });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const loadCatalogAudit = async () => {
    try {
      setAuditLoading(true);
      const res = await fetch("/api/catalog-audit");
      const data = await res.json();
      if (data.success) {
        setAuditData(data);
      }
    } catch (err) {
      console.error("Error loading catalog audit:", err);
    } finally {
      setAuditLoading(false);
    }
  };

  const evaluateTitle = async (titleToTest: string) => {
    if (!titleToTest) return;
    try {
      setEvaluatingCtr(true);
      const res = await fetch("/api/ctr-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleToTest }),
      });
      const data = await res.json();
      if (data.success) {
        setCtrResult(data.result);
      }
    } catch (e) {
      console.error("CTR evaluation failed:", e);
    } finally {
      setEvaluatingCtr(false);
    }
  };

  const generateMetadataDirect = async (inputToUse: any) => {
    try {
      setGeneratingMeta(true);
      const res = await fetch("/api/metadata-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputToUse),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedMeta(data.metadata);
      }
    } catch (e) {
      console.error("Metadata generation failed:", e);
    } finally {
      setGeneratingMeta(false);
    }
  };

  const handleGenerateMetadata = () => {
    generateMetadataDirect(builderInput);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePeriodChange = (days: number) => {
    setPeriodDays(days);
    loadAnalytics(days);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/status", { method: "POST" });
    setAuthState({ loading: false, authenticated: false });
    setAnalyticsData(null);
    setLivePulse(null);
    setAuditData(null);
  };

  const filteredBeats =
    analyticsData?.beats?.filter((beat: any) => {
      const matchesSearch =
        beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beat.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre = selectedGenre === "all" || beat.genre?.toLowerCase() === selectedGenre.toLowerCase();
      return matchesSearch && matchesGenre;
    }) || [];

  const availableGenres = Array.from(
    new Set(analyticsData?.beats?.map((b: any) => b.genre).filter(Boolean))
  ) as string[];

  if (authState.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090A0F] text-slate-300">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
          <Music className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          Connecting to SUPASONIC BEATS Studio Engine...
        </p>
      </div>
    );
  }

  if (!authState.authenticated) {
    return (
      <div className="min-h-screen bg-[#090A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.25),rgba(255,255,255,0))] flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full bg-[#111420]/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Disc className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">SUPASONIC BEATS</h1>
              <p className="text-xs text-slate-400">Next-Gen Studio Intelligence & Competitor Radar</p>
            </div>
          </div>
          <a
            href="/api/auth/login"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-purple-600/30"
          >
            <Users className="w-5 h-5" />
            Connect SUPASONIC BEATS Channel
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const channel = analyticsData?.channel || authState.channel;
  const summary = analyticsData?.analytics?.summary;
  const dailyStats = analyticsData?.analytics?.dailyStats || [];
  const trends = analyticsData?.trends || [];
  const topBeats = analyticsData?.insights?.topBeats || [];
  const audit = auditData?.audit;
  const velocity = auditData?.velocity;

  const filteredAuditItems = audit?.items?.filter((item: any) => {
    if (auditFilter === "critical") return item.status === "Critical Fix";
    if (auditFilter === "polish") return item.status === "Needs Polish";
    return true;
  }) || [];

  const allCatalogVideos = (audit?.items || auditData?.videos || []).map((v: any) => ({
    id: v.id || v.videoId,
    title: v.title,
    views: typeof v.views === "number" ? v.views : parseInt(v.views || "0", 10),
    likes: typeof v.likes === "number" ? v.likes : parseInt(v.likes || "0", 10),
    duration: v.duration,
  }));

  const filteredTierVideos = allCatalogVideos.filter((v: any) => {
    if (levelTierFilter === "boss") return v.views >= 1000;
    if (levelTierFilter === "elite") return v.views >= 500 && v.views < 1000;
    if (levelTierFilter === "fighter") return v.views >= 100 && v.views < 500;
    if (levelTierFilter === "rookie") return v.views < 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* 🔴 Top Live Pulse Ticker */}
      <div className="bg-gradient-to-r from-[#170a24] via-[#0e101f] to-[#12081d] border-b border-purple-500/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-extrabold tracking-wider uppercase text-[11px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE PULSE
          </div>
          <span className="text-slate-300 hidden sm:inline">
            Live Stream: <strong className="text-white">{(livePulse?.liveViews || Number(channel?.statistics?.viewCount || 0)).toLocaleString()}</strong> Total Views
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            <strong className="text-cyan-300">{livePulse?.liveSubs || channel?.statistics?.subscriberCount || 0}</strong> Subscribers
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-[11px]">
            {livePulse?.timestamp ? `Synced ${new Date(livePulse.timestamp).toLocaleTimeString()}` : "Syncing..."}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={autoRefreshLive}
              onChange={(e) => setAutoRefreshLive(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            <span className="text-[11px] font-medium">Auto-Sync (30s)</span>
          </label>
          <button
            onClick={() => pingLivePulse(true)}
            disabled={pulseLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 transition-all font-semibold"
          >
            <RefreshCw className={`w-3 h-3 ${pulseLoading ? "animate-spin" : ""}`} />
            Ping Now
          </button>
        </div>
      </div>

      {/* Main Studio Header */}
      <header className="sticky top-0 z-50 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Disc className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight text-white">{channel?.title || "SUPASONIC BEATS"}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Studio 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Hindi Afro House • Deep House • Dance Pop</p>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <div className="hidden xl:flex items-center gap-1.5 bg-[#141418] p-1.5 rounded-2xl border border-zinc-800/90 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab("levels")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "levels"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" /> Catalog Movers & Levels
          </button>
          <button
            onClick={() => setActiveTab("batches")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "batches"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-300" /> 🔬 Batches & Speed
          </button>
          <button
            onClick={() => setActiveTab("prediction")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "prediction"
                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md shadow-cyan-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" /> 📈 Market Prediction
          </button>
          <button
            onClick={() => {
              setActiveTab("audience");
              if (!audienceData) loadAudienceData();
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "audience"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Audience & Loyalty
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "live"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <RadioTower className="w-3.5 h-3.5 text-red-400" /> Live Radar
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "audit"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> Catalog Audit
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "builder"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" /> Title & BPM
          </button>
          <button
            onClick={() => setActiveTab("competitor")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "competitor"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-orange-400" /> Competitor Spy
          </button>
          <button
            onClick={() => setActiveTab("ctr")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "ctr"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" /> 3-System CTR
          </button>
          <button
            onClick={() => setActiveTab("epk")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all font-semibold ${
              activeTab === "epk"
                ? "bg-[#E23744] text-white shadow-md shadow-rose-900/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> Pitch Sheet
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#141724] border border-slate-800 rounded-xl p-0.5 text-xs">
            {[7, 28, 90].map((d) => (
              <button
                key={d}
                onClick={() => handlePeriodChange(d)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  periodDays === d ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
            title="Disconnect Channel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 xl:pb-8 space-y-6">
        {/* Mobile/Compact Horizontal Navigation Tabs */}
        <div className="flex xl:hidden overflow-x-auto pb-2 gap-2 text-xs scrollbar-none">
          {[
            { id: "batches", label: "🔬 Batches", icon: Layers },
            { id: "levels", label: "🏆 Level-Up", icon: Flame },
            { id: "prediction", label: "🎮 Market Game", icon: TrendingUp },
            { id: "live", label: "📡 Live Radar", icon: RadioTower },
            { id: "audience", label: "👥 Audience", icon: Users },
            { id: "audit", label: "🩺 Audit", icon: Stethoscope },
            { id: "builder", label: "🎛️ Title & BPM", icon: Wand2 },
            { id: "competitor", label: "Radar Spy", icon: Radar },
            { id: "trends", label: "Trend Catcher", icon: Sparkles },
            { id: "ctr", label: "3-System CTR", icon: Target },
            { id: "epk", label: "Pitch Sheet", icon: FileText },
          ].map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold ${
                  activeTab === tab.id ? "bg-purple-600 text-white" : "bg-[#141724] text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB: 🔬 ALGORITHM IMPRESSION BATCHES & GRADUATION SPEED */}
        {/* ============================================================== */}
        {activeTab === "batches" && (
          <AlgorithmBatchLadder
            catalogVideos={allCatalogVideos}
          />
        )}

        {/* ============================================================== */}
        {/* TAB: 🏆 CHANNEL RPG LEVEL PROGRESSION & QUEST SYSTEM */}
        {/* ============================================================== */}
        {activeTab === "levels" && (
          <ChannelLevelSystem
            channelStats={authState.channel?.statistics}
            catalogVideos={allCatalogVideos}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {/* ============================================================== */}
        {/* TAB: 👥 AUDIENCE & SUBSCRIBER LOYALTY TRACKER (YOUTUBE STUDIO UX) */}
        {/* ============================================================== */}
        {activeTab === "audience" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#17142b] via-[#101422] to-[#121c2e] border border-purple-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> YouTube Studio Audience Analytics
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    Audience & Subscriber Loyalty Tracker
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Track returning viewers, subscriber watch habits, and repeat listen behavior across your catalog. Discover what makes subscribers stay for almost 3 minutes per track!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadAudienceData}
                    disabled={audienceLoading}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${audienceLoading ? "animate-spin" : ""}`} />
                    Refresh Audience Data
                  </button>
                </div>
              </div>

              {/* Top Metrics Summary Cards */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#0e1220] border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase">Subscriber Loyalty Multiplier</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-2">
                    {audienceData?.subStats?.loyaltyMultiplier || 3.5}X <span className="text-xs text-emerald-300 font-bold">LONGER WATCH TIME</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Subscribers listen 3.5x longer than cold browse!</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1220] border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase">Subscribed Avg Duration</span>
                  <div className="text-2xl font-black text-cyan-400 mt-1 flex items-baseline gap-2">
                    {audienceData?.subStats?.subscribed?.avgSeconds || 165}s <span className="text-xs text-cyan-300 font-medium">(2m 45s)</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Nearly full song retention!</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1220] border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase">Non-Subscribed Avg Duration</span>
                  <div className="text-2xl font-black text-slate-300 mt-1 flex items-baseline gap-2">
                    {audienceData?.subStats?.unsubscribed?.avgSeconds || 47}s
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Cold casual listeners</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1220] border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase">Subscribed Watch Time</span>
                  <div className="text-2xl font-black text-purple-400 mt-1 flex items-baseline gap-2">
                    {((audienceData?.subStats?.subscribed?.minutes || 1308) / 60).toFixed(1)} hrs
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Generated by loyal fans</span>
                </div>
              </div>
            </div>

            {/* YouTube Studio Signature Card: Watch Time from Subscribers */}
            <div className="p-6 md:p-7 rounded-3xl bg-[#111422] border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" /> Watch Time from Subscribers
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official YouTube Studio metric comparing subscribed vs non-subscribed audience behavior:
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  🟢 3.5X Super Retention Signal
                </span>
              </div>

              {/* Comparative Progress Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex mb-6">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all"
                  style={{ width: `${audienceData?.subStats?.subscribedWatchPct || 9.1}%` }}
                  title="Subscribed Watch Time"
                />
                <div
                  className="bg-slate-700 h-full transition-all"
                  style={{ width: `${audienceData?.subStats?.unsubscribedWatchPct || 90.9}%` }}
                  title="Non-Subscribed Watch Time"
                />
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#161c30] border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                      <span className="font-bold text-white text-sm">Subscribed (Your Core Audience)</span>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300">
                      {audienceData?.subStats?.subscribedWatchPct || 9.1}% of Watch Time
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Views</span>
                      <span className="text-base font-black text-white">{(audienceData?.subStats?.subscribed?.views || 608).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Watch Time</span>
                      <span className="text-base font-black text-cyan-300">{(audienceData?.subStats?.subscribed?.minutes || 1308).toLocaleString()}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Avg Duration</span>
                      <span className="text-base font-black text-emerald-400">{audienceData?.subStats?.subscribed?.avgSeconds || 165}s (2m 45s)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#161c30] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-500" />
                      <span className="font-bold text-slate-300 text-sm">Not Subscribed (Browse Discovery)</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {audienceData?.subStats?.unsubscribedWatchPct || 90.9}% of Watch Time
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Views</span>
                      <span className="text-base font-black text-white">{(audienceData?.subStats?.unsubscribed?.views || 24225).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Watch Time</span>
                      <span className="text-base font-black text-slate-300">{(audienceData?.subStats?.unsubscribed?.minutes || 13147).toLocaleString()}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Avg Duration</span>
                      <span className="text-base font-black text-slate-400">{audienceData?.subStats?.unsubscribed?.avgSeconds || 47}s</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Algorithm Super-Power:</strong> Aapka har ek subscriber naye casual listeners se <strong>3.5X zyada watch time</strong> deta hai. Jab bhi naya gaana drop hota hai, yahi loyal listeners video ko algorithm ke high-retention bracket me bhejte hain!
                </span>
              </div>
            </div>

            {/* What Your Subscribers Watch (Ranked Table) */}
            <div className="p-6 md:p-7 rounded-3xl bg-[#111422] border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" /> What Your Subscribers Watch & Repeat
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Top songs that keep your subscribers listening on loop with the highest watch time:
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                      <th className="pb-3 px-3">#</th>
                      <th className="pb-3 px-3">Song Title</th>
                      <th className="pb-3 px-3 text-right">Sub-Views</th>
                      <th className="pb-3 px-3 text-right">Sub Watch Time</th>
                      <th className="pb-3 px-3 text-right">Avg View Duration</th>
                      <th className="pb-3 px-3 text-center">Loyalty Badge</th>
                      <th className="pb-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(audienceData?.topSubVideos && audienceData.topSubVideos.length > 0
                      ? audienceData.topSubVideos
                      : [
                          { id: "vA5StwqtM6I", title: "Hindi Romantic Songs Playlist ❤️ | Thahar Gaya, Tu Aur Main", subViews: 20, watchTimeMinutes: 84, avgDurationSeconds: 316 },
                          { id: "Ossd36BQPzs", title: "Dekh Le | Bollywood Romantic Pop x Late Night Chill", subViews: 13, watchTimeMinutes: 45, avgDurationSeconds: 226 },
                          { id: "1_rcI_jlL2Q", title: "AADHI RAAT - Late Night Hindi Car Bass (Official Music Video)", subViews: 20, watchTimeMinutes: 38, avgDurationSeconds: 142 },
                          { id: "lQl3dRGivOI", title: "BHAR LE TU | Hindi Deep House Remix X Bass And Beats [124 BPM]", subViews: 19, watchTimeMinutes: 36, avgDurationSeconds: 129 },
                          { id: "opj6VHo_Zy8", title: "Aao Paas - Official Music Video | Late Night Luxury Deep House", subViews: 13, watchTimeMinutes: 31, avgDurationSeconds: 159 },
                          { id: "2QoQNFlGpQ4", title: "UP Wali Laiki (यूपी वाली लइकी) | Desi Party Song", subViews: 14, watchTimeMinutes: 29, avgDurationSeconds: 134 },
                          { id: "6O7SxWnfZqE", title: "Paas Aa | Hindi Afro House x Deep House", subViews: 14, watchTimeMinutes: 26, avgDurationSeconds: 115 },
                          { id: "r58HTbAFSPM", title: "Tu Hi Meri | Hindi Romantic R&B Song | Saxophone Vibes", subViews: 14, watchTimeMinutes: 26, avgDurationSeconds: 160 },
                          { id: "M-JVYUUEQdE", title: "Subha Se Pahle | Hindi Romantic Dance Pop", subViews: 20, watchTimeMinutes: 22, avgDurationSeconds: 129 },
                          { id: "siluURGPUBE", title: "Supasonic Beats - DHEERE SE | Late Night Hindi R&B", subViews: 13, watchTimeMinutes: 21, avgDurationSeconds: 106 },
                        ]
                    ).map((v: any, idx: number) => {
                      const isHighDuration = v.avgDurationSeconds >= 120;
                      return (
                        <tr key={v.id || idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              {v.thumbnail && (
                                <img
                                  src={v.thumbnail}
                                  alt=""
                                  className="w-12 h-8 rounded-lg object-cover shrink-0 border border-slate-700"
                                />
                              )}
                              <span className="font-bold text-white max-w-md line-clamp-1" title={v.title}>
                                {v.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-cyan-300">
                            {v.subViews}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-purple-300">
                            {v.watchTimeMinutes}m
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`font-black px-2 py-0.5 rounded-md ${
                                isHighDuration
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "text-slate-300"
                              }`}
                            >
                              {v.avgDurationSeconds}s ({Math.floor(v.avgDurationSeconds / 60)}m {v.avgDurationSeconds % 60}s)
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {v.avgDurationSeconds > 200 ? (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-[10px]">
                                👑 Mega Repeat
                              </span>
                            ) : v.avgDurationSeconds > 120 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-[10px]">
                                🔥 High Loyalty
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold text-[10px]">
                                🟢 Active
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <a
                              href={`https://www.youtube.com/watch?v=${v.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                            >
                              Play <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Retention Funnel & Strategy Playbook */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#131726] border border-cyan-500/30">
                <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" /> 1. The Playlist Trap
                </span>
                <h4 className="font-black text-white text-base mt-2">Continuous Long Mixes</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Subscribers playlist tracks par average <strong>5+ minutes</strong> rukte hain! Hamara 18-Min Non-Stop Mix aise hi subscribers ko loop me baandh kar rakhta hai.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131726] border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> 2. 120-124 BPM Car Bass
                </span>
                <h4 className="font-black text-white text-base mt-2">Night Drive Repeat Engine</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  `AADHI RAAT`, `BHAR LE TU`, aur `PAAS AA` par subscriber retention 120s+ hai. Car speakers par sub-bass ka maza lene ke liye wo ise bar-baar replay karte hain.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131726] border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> 3. End-Screen Cross Promotion
                </span>
                <h4 className="font-black text-white text-base mt-2">The Flywheel Loop</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Jab `DEEDAR DE` (4.6K views) khatam ho, toh End-Screen me `ZARA ZARA` aur `TU MIL JAAYE` ka card lagayein taaki naye viewers turant returning viewers ban jayein!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 🎛️ BPM TAP DETECTOR & TITLE BUILDER (METHOD #3) */}
        {/* ============================================================== */}
        {activeTab === "builder" && (
          <div className="space-y-6">
            {/* 🥁 Interactive Tap Tempo BPM Finder Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1a122e] via-[#111422] to-[#121b2d] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                      Live BPM Tap Tempo Finder
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Gaana play karein aur beat ke sath Tap karein!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg">
                    Apna gaana sunte huye neeche button par ya keyboard ka <strong>Spacebar</strong> 4-5 baar dabayein — software turant exact BPM nikalega aur automatically naye titles bana dega!
                  </p>
                </div>

                {/* Tap Button & BPM Display */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Big Tap Tempo Button */}
                  <button
                    onClick={handleTapTempo}
                    className={`w-36 h-36 rounded-full font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all shadow-2xl select-none ${
                      isTapPulsing
                        ? "scale-95 bg-gradient-to-br from-cyan-400 to-pink-500 text-black shadow-cyan-400/50"
                        : "bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-500 text-white hover:scale-105 shadow-purple-600/40"
                    }`}
                  >
                    <Disc className={`w-6 h-6 ${isTapPulsing ? "animate-spin" : ""}`} />
                    <span className="text-sm font-extrabold">TAP BEAT</span>
                    <span className="text-[10px] opacity-80">(or Spacebar)</span>
                    <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full mt-0.5">
                      Taps: {tapCount}
                    </span>
                  </button>

                  {/* Detected BPM Result Card */}
                  <div className="p-4 rounded-2xl bg-[#0e111d] border border-slate-800 text-center min-w-36">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Detected Tempo
                    </span>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 my-1">
                      {tappedBpm ? `${tappedBpm}` : "--"}
                    </div>
                    <span className="text-xs font-bold text-slate-400">BPM</span>

                    {tappedBpm && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold block">
                          ✓ Auto-Applied!
                        </span>
                        <button
                          onClick={resetTapTempo}
                          className="mt-1 text-[10px] text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto"
                        >
                          <RotateCcw className="w-2.5 h-2.5" /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Metadata Configuration Form */}
            <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-yellow-300" />
                    Live Title & Tag Generator (Auto-Synced with BPM)
                  </h3>
                  <p className="text-xs text-slate-400">
                    BPM change hote hi saare titles aur tags live update ho jaate hain.
                  </p>
                </div>

                <button
                  onClick={handleGenerateMetadata}
                  disabled={generatingMeta}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generatingMeta ? "animate-spin" : ""}`} />
                  Regenerate Titles
                </button>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Song Name
                  </label>
                  <input
                    type="text"
                    value={builderInput.songName}
                    onChange={(e) => {
                      const updated = { ...builderInput, songName: e.target.value };
                      setBuilderInput(updated);
                      generateMetadataDirect(updated);
                    }}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Subgenre
                  </label>
                  <select
                    value={builderInput.subgenre}
                    onChange={(e) => {
                      const updated = { ...builderInput, subgenre: e.target.value };
                      setBuilderInput(updated);
                      generateMetadataDirect(updated);
                    }}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Hindi Afro House</option>
                    <option>Deep House</option>
                    <option>Dance Pop x Club Bangers</option>
                    <option>Late Night Drive Mix</option>
                    <option>Romantic Desi Electronic</option>
                    <option>Dark Phonk & Trance</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <span>⚡ BPM (Tempo)</span>
                    {tappedBpm && <span className="text-[9px] text-emerald-400 font-bold">✓ Tapped</span>}
                  </label>
                  <input
                    type="text"
                    value={builderInput.bpm}
                    onChange={(e) => {
                      const updated = { ...builderInput, bpm: e.target.value };
                      setBuilderInput(updated);
                      generateMetadataDirect(updated);
                    }}
                    className="w-full bg-[#181c2d] border border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-extrabold text-cyan-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Musical Key
                  </label>
                  <input
                    type="text"
                    value={builderInput.key}
                    onChange={(e) => {
                      const updated = { ...builderInput, key: e.target.value };
                      setBuilderInput(updated);
                      generateMetadataDirect(updated);
                    }}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Mood / Context
                  </label>
                  <select
                    value={builderInput.mood}
                    onChange={(e) => {
                      const updated = { ...builderInput, mood: e.target.value };
                      setBuilderInput(updated);
                      generateMetadataDirect(updated);
                    }}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Late Night Drive</option>
                    <option>Club Banger Drop</option>
                    <option>Soulful Desi Chill</option>
                    <option>High Energy Party</option>
                    <option>Rain & Chai Vibes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generated Results with BPM live inserted */}
            {generatedMeta && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> 5 Ready-to-Use Title Variations (BPM Included):
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      BPM: <strong>{builderInput.bpm}</strong> • Key: <strong>{builderInput.key}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {generatedMeta.titles.map((tItem: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#161a29] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">
                            {tItem.type}
                          </span>
                          <p className="text-xs font-bold text-white">{tItem.title}</p>
                          <span className="text-[11px] text-slate-400 block">{tItem.advantage}</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 font-mono">{tItem.charCount} chars</span>
                          <button
                            onClick={() => copyToClipboard(tItem.title, `gen-title-${idx}`)}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
                          >
                            {copiedKey === `gen-title-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedKey === `gen-title-${idx}` ? "Copied!" : "Copy Title"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 20 Ranked Tags Box */}
                <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-purple-300 uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-4 h-4" /> 20 Ranked Search Tags (Includes {builderInput.bpm} BPM):
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Direct YouTube Studio ke Tag Box mein paste karne ke liye formatted.
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedMeta.tagsString, "gen-tags")}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-extrabold text-white flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/30"
                    >
                      {copiedKey === "gen-tags" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "gen-tags" ? "Copied All Tags!" : "Copy 20 Tags"}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
                    {generatedMeta.tagsString}
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    Character Count: <strong className="text-cyan-300">{generatedMeta.totalTagChars}</strong> / 500 max
                  </div>
                </div>

                {/* Description Template */}
                <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Complete YouTube Description Template:
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Includes timestamps, genre tags, producer bio, and Spotify/YouTube hashtags.
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedMeta.descriptionTemplate, "gen-desc")}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white flex items-center gap-1.5 transition-all"
                    >
                      {copiedKey === "gen-desc" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "gen-desc" ? "Copied Description!" : "Copy Description"}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-[#161a29] border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {generatedMeta.descriptionTemplate}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 🕵️ COMPETITOR & NICHE SPY RADAR */}
        {/* ============================================================== */}
        {activeTab === "competitor" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1b1429] via-[#111422] to-[#121a2c] border border-orange-500/30 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Radar className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      Competitor & Niche Spy Radar
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-extrabold uppercase">
                        Live Data
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Inspired by Claude-YouTube framework: Spy on top Hindi Afro House & Deep House hits, extract competitor tags & uncover keyword gaps.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-96">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={competitorQuery}
                      onChange={(e) => setCompetitorQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchCompetitors(competitorQuery)}
                      placeholder="Search niche (e.g. Hindi Afro House)..."
                      className="w-full bg-[#181c2d] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <button
                    onClick={() => fetchCompetitors(competitorQuery)}
                    disabled={competitorLoading}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${competitorLoading ? "animate-spin" : ""}`} />
                    Spy
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
                <span className="text-slate-400 text-[11px] font-bold uppercase shrink-0">Quick Spies:</span>
                {[
                  "Hindi Afro House",
                  "Hindi Deep House",
                  "Late Night Drive Hindi",
                  "Bollywood Club Bangers",
                  "Desi Electronic Fusion",
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCompetitorQuery(preset);
                      fetchCompetitors(preset);
                    }}
                    className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all font-semibold ${
                      competitorQuery === preset
                        ? "bg-orange-500 text-white"
                        : "bg-[#181c2d] text-slate-300 hover:text-white border border-slate-800"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {competitorData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#111420] border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Top Hits Analyzed
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {competitorData.totalFound} Tracks
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Ranked by lifetime view volume</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#111420] border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Average Views per Hit
                  </span>
                  <div className="text-2xl font-black text-cyan-300 mt-1">
                    {(competitorData.averageViews || 0).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Massive audience appetite in this niche</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#111420] border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Niche Keyword Gaps Found
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {competitorData.keywordGaps?.length || 0} Gaps
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">High-traffic tags you can claim</p>
                </div>
              </div>
            )}

            {competitorData?.keywordGaps && (
              <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
                <h3 className="font-extrabold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Untapped Keyword Gaps (What Competitors Rank For):
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {competitorData.keywordGaps.map((gap: any, gIdx: number) => (
                    <div
                      key={gIdx}
                      className="p-3.5 rounded-2xl bg-[#161a29] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-white">#{gap.keyword}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                            High Demand
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{gap.recommendedUse}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(gap.keyword, `gap-${gIdx}`)}
                        className="mt-3 py-1 px-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-[11px] font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1 transition-all"
                      >
                        {copiedKey === `gap-${gIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === `gap-${gIdx}` ? "Copied Tag" : "Copy Tag"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {competitorData?.topCompetitors && (
              <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Top Competitor Hits in "{competitorQuery}":
                </h3>

                <div className="space-y-3">
                  {competitorData.topCompetitors.map((comp: any, idx: number) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-2xl bg-[#161a29] border border-slate-800 hover:border-orange-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-black text-lg text-slate-500 w-6 text-center">#{idx + 1}</span>
                        {comp.thumbnail && (
                          <img src={comp.thumbnail} alt={comp.title} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-orange-400 font-bold">{comp.channelTitle}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] text-slate-400">{comp.duration}</span>
                          </div>
                          <h4 className="font-bold text-xs text-white max-w-lg line-clamp-1 mt-0.5">{comp.title}</h4>
                          <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] text-slate-400">
                            {comp.tags.slice(0, 4).map((t: string, tIdx: number) => (
                              <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-6 text-right shrink-0">
                        <div>
                          <span className="text-base font-black text-cyan-300 block">
                            {comp.views.toLocaleString()} Views
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {comp.likes.toLocaleString()} likes • {comp.viewsPerDay.toLocaleString()} views/day
                          </span>
                        </div>

                        <a
                          href={`https://youtube.com/watch?v=${comp.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors"
                          title="Watch on YouTube"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 🎯 3-SYSTEM ALGORITHM CTR OPTIMIZER */}
        {/* ============================================================== */}
        {activeTab === "ctr" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#111420] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    3-System Algorithm & CTR Scorer
                  </h3>
                  <p className="text-xs text-slate-400">
                    YouTube's Three-System Architecture (Browse vs Search vs Shorts). Tests how each algorithm will treat your title.
                  </p>
                </div>
                <button
                  onClick={() => evaluateTitle(inputTitle)}
                  disabled={evaluatingCtr}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/30"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Evaluate Title
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => {
                    setInputTitle(e.target.value);
                    evaluateTitle(e.target.value);
                  }}
                  placeholder="e.g. SONG NAME | Hindi Afro House x Deep House | Supasonic Beats [124 BPM]"
                  className="w-full bg-[#161a29] border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                  {inputTitle.length} chars
                </span>
              </div>
            </div>

            {ctrResult?.threeSystem && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#141829] via-[#101322] to-[#161226] border border-purple-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-wider">
                      YouTube 3-System Distribution
                    </span>
                    <h4 className="text-base font-black text-white mt-0.5">
                      Predicted Primary Surface: <span className="text-cyan-300">{ctrResult.threeSystem.primarySurface}</span>
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">🏠 Browse (Home Feed)</span>
                      <span className="text-xs font-black text-purple-300">{ctrResult.threeSystem.browseScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${ctrResult.threeSystem.browseScore}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">🔍 Search (SEO)</span>
                      <span className="text-xs font-black text-cyan-300">{ctrResult.threeSystem.searchScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${ctrResult.threeSystem.searchScore}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">📱 Shorts Feed</span>
                      <span className="text-xs font-black text-pink-300">{ctrResult.threeSystem.shortsScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: `${ctrResult.threeSystem.shortsScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 🩺 CATALOG AUDIT & SEO FIXER */}
        {/* ============================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#111420] to-cyan-950/30 border border-purple-500/30 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-black">
                    {audit?.overallHealthScore || 0}%
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      Catalog Health & SEO Audit
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        57 Videos Scanned
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      YouTube Studio never audits your videos. Here are the exact metadata leaks costing you views.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadCatalogAudit}
                    disabled={auditLoading}
                    className="px-4 py-2 rounded-xl bg-[#1a1e30] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? "animate-spin" : ""}`} />
                    Re-Scan Catalog
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                    Missing BPM in Title
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {audit?.missingBpmCount || 0} <span className="text-xs text-slate-400 font-medium">videos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Artists search specifically by tempo (e.g. "124 bpm"). Adding BPM recovers missed searchers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">
                    Missing Musical Key
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {audit?.missingKeyCount || 0} <span className="text-xs text-slate-400 font-medium">videos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Singers filter beats by pitch (e.g. "F Minor"). Adding Key increases artist buyer clicks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#161a29] border border-slate-800">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Optimized Videos
                  </span>
                  <div className="text-2xl font-black text-cyan-300 mt-1">
                    {audit?.optimizedCount || 0} <span className="text-xs text-slate-400 font-medium">videos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Videos with complete subgenre tags, clean separators, and proper length.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAuditItems.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#111420] border border-slate-800 hover:border-purple-500/30 transition-all shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.title} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.status === "Optimized"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : item.status === "Needs Polish"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.status} ({item.healthScore}/100)
                          </span>
                          <span className="text-xs text-slate-400">
                            {item.views.toLocaleString()} Views • {item.viewsPerDay} Views/Day
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">{item.title}</h4>
                      </div>
                    </div>

                    <a
                      href={`https://studio.youtube.com/video/${item.id}/edit`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                    >
                      Open in Studio <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141728] border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> Recommended Quick-Fix Title:
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.suggestedTitle, `title-${item.id}`)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        {copiedKey === `title-${item.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === `title-${item.id}` ? "Copied!" : "Copy Title"}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0e111d] text-xs font-mono text-slate-200">
                      {item.suggestedTitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 📈 STOCK-MARKET PREDICTION TERMINAL */}
        {/* ============================================================== */}
        {activeTab === "prediction" && (
          <PredictionTerminal
            beats={analyticsData?.beats || []}
            livePulse={livePulse}
            channelOverview={authState.channel}
          />
        )}

        {/* ============================================================== */}
        {/* TAB: 🔴 LIVE RADAR */}
        {/* ============================================================== */}
        {activeTab === "live" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[#111420] border border-purple-500/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Channel Views</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                </div>
                <div className="text-3xl font-black text-white tracking-tight mt-1">
                  {(livePulse?.liveViews || Number(channel?.statistics?.viewCount || 0)).toLocaleString()}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#111420] border border-cyan-500/30 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Watch Time ({periodDays}D)</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-cyan-300 tracking-tight mt-1">
                  {summary?.watchTimeHours || 0} <span className="text-sm font-semibold text-slate-400">Hours</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#111420] border border-pink-500/30 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Subscribers</span>
                  <Users className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-3xl font-black text-pink-300 tracking-tight mt-1">
                  {livePulse?.liveSubs || channel?.statistics?.subscriberCount || 0}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#111420] border border-yellow-500/30 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Catalog Uploads</span>
                  <Disc className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-yellow-300 tracking-tight mt-1">
                  {channel?.statistics?.videoCount || 0} <span className="text-sm font-semibold text-slate-400">Tracks</span>
                </div>
              </div>
            </div>

            {/* Realtime Hourly Velocity & Peak Monitor */}
            <div className="p-6 rounded-3xl bg-[#111420] border border-emerald-500/30 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-Time Velocity Engine
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {livePulse?.hourly?.peakLabel || "Tracking"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Current Speed: {livePulse?.hourly?.viewsPerHourRate || 0}{" "}
                    <span className="text-sm text-slate-400 font-normal">views / hour</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => pingLivePulse(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-xs font-semibold text-purple-200 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Speed
                  </button>
                </div>
              </div>

              {/* Peak Threshold Targets Indicator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className={`p-3.5 rounded-2xl border ${
                  (livePulse?.hourly?.viewsPerHourRate || 0) >= 100
                    ? "bg-red-500/10 border-red-500/40 text-red-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}>
                  <div className="text-[11px] font-bold uppercase tracking-wider">Mega Surge Target</div>
                  <div className="text-lg font-black mt-0.5">100+ Views/hr</div>
                  <div className="text-[10px] text-slate-400 mt-1">Prime Window: 9:30 PM – 11:30 PM IST</div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  (livePulse?.hourly?.viewsPerHourRate || 0) >= 50
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}>
                  <div className="text-[11px] font-bold uppercase tracking-wider">Active Peak Target</div>
                  <div className="text-lg font-black mt-0.5">50+ Views/hr</div>
                  <div className="text-[10px] text-slate-400 mt-1">Crosses around: 7:30 PM – 8:00 PM IST</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <div className="text-[11px] font-bold uppercase tracking-wider">Peak End Dropoff</div>
                  <div className="text-lg font-black text-slate-300 mt-0.5">01:30 AM – 02:30 AM</div>
                  <div className="text-[10px] text-slate-500 mt-1">Slumps into sleep hours (2-10 v/hr)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 🚀 TREND CATCHER */}
        {/* ============================================================== */}
        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trends.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#111420] border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {t.vibe}
                      </span>
                      <h3 className="text-lg font-black text-white mt-2">{t.subgenre}</h3>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      {t.estimatedViewPotential}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#161a29] p-3.5 rounded-2xl border border-slate-800">
                    💡 <strong>Algorithm Secret:</strong> {t.whyThisWorks}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#141724] border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Recommended Tempo</span>
                      <span className="font-extrabold text-white text-sm">⚡ {t.recommendedBpm}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#141724] border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Musical Key</span>
                      <span className="font-extrabold text-purple-300 text-sm">🎹 {t.recommendedKey}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 📈 LIFESPAN RADAR */}
        {/* ============================================================== */}
        {activeTab === "velocity" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#161a29] border border-orange-500/30">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  🔥 Surge Hits
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {velocity?.surgeHits?.length || 0}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#161a29] border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  📈 Evergreen Slow Burners
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {velocity?.evergreenTracks?.length || 0}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#161a29] border border-red-500/30">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  💤 Sleeping Tracks
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {velocity?.sleepingTracks?.length || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: 📄 EPK */}
        {/* ============================================================== */}
        {activeTab === "epk" && (
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#16132b] via-[#0f111d] to-[#121626] border border-purple-500/40 shadow-2xl space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight">SUPASONIC BEATS</h2>
            <p className="text-sm text-cyan-300 font-bold">
              Electronic Music Producer Press Kit (EPK)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#131626] border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Streams</span>
                <div className="text-2xl font-black text-white mt-1">
                  {(livePulse?.liveViews || Number(channel?.statistics?.viewCount || 0)).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#131626] border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Subscribers</span>
                <div className="text-2xl font-black text-cyan-300 mt-1">
                  {livePulse?.liveSubs || channel?.statistics?.subscriberCount || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 📱 NATIVE-STYLE MOBILE BOTTOM NAVIGATION BAR */}
      {/* ============================================================== */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0e17]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => setActiveTab("prediction")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "prediction" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === "prediction" ? "text-cyan-400 scale-110" : ""}`} />
          <span className="text-[10px]">Market</span>
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "live" ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"
          }`}
        >
          <RadioTower className={`w-5 h-5 ${activeTab === "live" ? "text-red-400 scale-110" : ""}`} />
          <span className="text-[10px]">Live Radar</span>
        </button>

        <button
          onClick={() => setActiveTab("levels")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "levels" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"
          }`}
        >
          <Trophy className={`w-5 h-5 ${activeTab === "levels" ? "text-amber-400 scale-110" : ""}`} />
          <span className="text-[10px]">Level-Up</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("audience");
            if (!audienceData) loadAudienceData();
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "audience" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === "audience" ? "text-emerald-400 scale-110" : ""}`} />
          <span className="text-[10px]">Audience</span>
        </button>

        <button
          onClick={() => setActiveTab("ctr")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "ctr" ? "text-purple-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"
          }`}
        >
          <Target className={`w-5 h-5 ${activeTab === "ctr" ? "text-purple-400 scale-110" : ""}`} />
          <span className="text-[10px]">CTR Test</span>
        </button>
      </nav>
    </div>
  );
}
