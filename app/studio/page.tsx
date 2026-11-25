"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  PlusCircle,
  RefreshCw,
  Sliders,
} from "lucide-react";
import CompetitorLeaderboard from "@/components/CompetitorLeaderboard";
import SEOGeneratorTab from "@/components/SEOGeneratorTab";
import NewPostModal from "@/components/NewPostModal";
import { FeedPost } from "@/lib/feedEngine";
import { CompetitorItem } from "@/lib/competitorRanking";

export default function ArtistStudioPage() {
  const [activeTool, setActiveTool] = useState<"seo" | "competitors">("seo");
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [supasonicStanding, setSupasonicStanding] = useState<any>({
    rank: 6,
    name: "SUPASONIC BEATS (Official)",
    channelId: "UCM1yIAO_tvDGWOYi3JcyacA",
    subscribers: "141+",
    totalViews: "59K+",
    dominantBPM: "125 BPM",
    signatureStyle: "Indian Afro House & Raga Techno",
    tacticalGap: "Extended playlists + 125 BPM Raga Techno drops accelerate Suggested traffic.",
    topBreakout: {
      title: "DEEDAR DE [124 BPM] - Hindi Afro House (5.8K views)",
      views: 5839,
      viewsFormatted: "5.8K",
    },
    isSupasonic: true,
  });
  const [nicheStats, setNicheStats] = useState<any>({
    totalTrackedChannels: 25,
    avgBPM: "124.2 BPM",
    topSubgenre: "Indian Afro House x Raga Techno",
    highestBreakoutVelocity: "1.11M in 10 days",
  });

  useEffect(() => {
    fetch("/api/competitors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCompetitors(data.topCompetitors || []);
          if (data.supasonicStanding) setSupasonicStanding(data.supasonicStanding);
          if (data.nicheStats) setNicheStats(data.nicheStats);
        }
      })
      .catch((e) => console.warn("Failed to load competitors:", e));
  }, []);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/feed?refresh=true");
      const data = await res.json();
      showToastMsg(
        data.liveSynced
          ? "Synced live catalog from YouTube channel."
          : "Local catalog snapshot verified."
      );
    } catch {
      showToastMsg("Sync completed using local snapshot.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen water-ambient-bg text-[#0b0f19] relative overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-36 -left-32 w-[30rem] h-[30rem] rounded-full bg-sky-200/40 blur-[120px] animate-water-pulse" />
        <div className="absolute bottom-0 -right-32 w-[32rem] h-[32rem] rounded-full bg-indigo-100/45 blur-[130px] animate-water-pulse [animation-delay:4s]" />
      </div>

      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-2xl liquid-glass text-xs font-semibold text-[#0b0f19] shadow-xl">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full liquid-pill text-xs font-semibold text-slate-700 hover:text-[#0b0f19] flex items-center gap-1.5 flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Site</span>
            </Link>

            <div className="flex items-center gap-2 min-w-0">
              <Sliders className="w-4 h-4 text-[#ff3b30] flex-shrink-0" />
              <span className="font-bold text-sm tracking-tight truncate">
                Creator Studio Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="p-2 rounded-full liquid-pill text-slate-700 hover:text-[#0b0f19]"
              title="Sync YouTube Channel"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#ff3b30]" : ""}`} />
            </button>

            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-4 py-2 rounded-full liquid-btn-red text-xs font-semibold flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Post</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTool("seo")}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTool === "seo" ? "liquid-pill-active" : "liquid-pill text-slate-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>SEO Metadata Builder</span>
          </button>

          <button
            onClick={() => setActiveTool("competitors")}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTool === "competitors" ? "liquid-pill-active" : "liquid-pill text-slate-600"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Competitor Radar Leaderboard</span>
          </button>
        </div>

        {activeTool === "seo" ? (
          <SEOGeneratorTab />
        ) : (
          <CompetitorLeaderboard
            competitors={competitors}
            supasonicStanding={supasonicStanding}
            nicheStats={nicheStats}
          />
        )}
      </main>

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onPostCreated={(p: FeedPost) => showToastMsg(`Published "${p.title}" to catalog.`)}
      />
    </div>
  );
}
