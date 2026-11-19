"use client";

import React, { useState } from "react";
import {
  Trophy,
  TrendingUp,
  Search,
  Eye,
  Users,
  Flame,
  Zap,
  Target,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Award,
  Play,
} from "lucide-react";
import { CompetitorItem } from "@/lib/competitorRanking";
import SubscribeAdPoster from "./SubscribeAdPoster";

interface CompetitorLeaderboardProps {
  competitors: CompetitorItem[];
  supasonicStanding: CompetitorItem;
  nicheStats: {
    totalTrackedChannels: number;
    avgBPM: string;
    topSubgenre: string;
    highestBreakoutVelocity: string;
  };
}

export default function CompetitorLeaderboard({
  competitors,
  supasonicStanding,
  nicheStats,
}: CompetitorLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBpm, setFilterBpm] = useState<string>("all");
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorItem | null>(null);

  const allCompetitors = [...competitors];
  if (!allCompetitors.some((c) => c.isSupasonic)) {
    allCompetitors.splice(7, 0, supasonicStanding);
  }

  const filtered = allCompetitors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topBreakout?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dominantBPM.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBpm = filterBpm === "all" || c.dominantBPM.includes(filterBpm);

    return matchesSearch && matchesBpm;
  });

  return (
    <div className="space-y-6">
      {/* Top Industry Chart Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#181818] border border-[#282828]">
          <div className="flex items-center gap-1.5 text-[#3ea6ff] text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" /> Producers Tracked
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#f1f1f1]">{nicheStats.totalTrackedChannels} Channels</div>
          <p className="text-[11px] text-[#aaaaaa] mt-0.5">Hindi Afro House Niche</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#282828]">
          <div className="flex items-center gap-1.5 text-[#ff4e45] text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" /> Golden Tempo
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#f1f1f1]">{nicheStats.avgBPM}</div>
          <p className="text-[11px] text-[#aaaaaa] mt-0.5">Peak Club & Drive Tempo</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#282828]">
          <div className="flex items-center gap-1.5 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" /> Top Genre
          </div>
          <div className="text-lg md:text-xl font-bold text-[#f1f1f1] truncate">Hindi Afro House</div>
          <p className="text-[11px] text-[#aaaaaa] mt-0.5">Deep House & Club Beats</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#282828]">
          <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" /> Fastest Velocity
          </div>
          <div className="text-lg md:text-xl font-bold text-[#f1f1f1]">1.42M in 14d</div>
          <p className="text-[11px] text-[#aaaaaa] mt-0.5">Dhun Music Vibes (Aao Na)</p>
        </div>
      </div>

      {/* Supasonic Beats Official Standing Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#181818] border border-[#ff0000]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full p-0.5 bg-[#0f0f0f] border-2 border-[#303030] shadow-xl flex-shrink-0">
              <img
                src="/channel_avatar.jpg"
                alt="Supasonic Beats"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black shadow-sm">
                  CHART RANK #8
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> High Velocity Upside
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#f1f1f1] mt-1">
                SUPASONIC BEATS vs Industry Competitors
              </h2>
              <p className="text-xs text-[#aaaaaa] mt-1 max-w-xl leading-relaxed">
                {supasonicStanding.tacticalGap}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://www.youtube.com/@supasonicbeats?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-900/40 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Subscribe to Boost Rank
            </a>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#181818] border border-[#282828]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#717171] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor channel, breakout track, or tempo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] placeholder-[#717171] text-xs focus:outline-none focus:border-[#3ea6ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#aaaaaa]">Tempo:</span>
          <select
            value={filterBpm}
            onChange={(e) => setFilterBpm(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#121212] border border-[#303030] text-[#f1f1f1] text-xs font-medium focus:outline-none"
          >
            <option value="all">All Tempos</option>
            <option value="124">124 BPM (Golden Tempo)</option>
            <option value="122">122 BPM</option>
            <option value="126">126 BPM</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {filtered.map((comp) => {
          const isSupasonic = comp.isSupasonic;
          const isSelected = selectedCompetitor?.name === comp.name;

          return (
            <div
              key={comp.name}
              onClick={() => setSelectedCompetitor(isSelected ? null : comp)}
              className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isSupasonic
                  ? "bg-[#212121] border border-[#ff0000]/60 shadow-lg"
                  : isSelected
                  ? "bg-[#212121] border border-[#3ea6ff]/60"
                  : "bg-[#181818] border border-[#282828] hover:border-[#383838]"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                {/* Channel Identity */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 ${
                      comp.rank === 1
                        ? "bg-yellow-400 text-black"
                        : comp.rank === 2
                        ? "bg-slate-300 text-black"
                        : comp.rank === 3
                        ? "bg-amber-600 text-white"
                        : isSupasonic
                        ? "bg-[#ff0000] text-white"
                        : "bg-[#272727] text-[#aaaaaa]"
                    }`}
                  >
                    #{comp.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#f1f1f1] flex items-center gap-1.5">
                        {comp.name}
                        {isSupasonic && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#ff0000] text-white">
                            YOU
                          </span>
                        )}
                      </h3>
                      <span className="text-[11px] px-2 py-0.2 rounded bg-[#272727] text-[#3ea6ff] font-mono">
                        {comp.dominantBPM}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#aaaaaa] mt-0.5">
                      <span>
                        <strong className="text-[#f1f1f1]">{comp.subscribers}</strong> subscribers
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-[#f1f1f1]">{comp.totalViews}</strong> views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Breakout Video */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#121212] border border-[#282828] flex-1 max-w-xl">
                  <div className="w-7 h-7 rounded-lg bg-[#272727] flex items-center justify-center flex-shrink-0">
                    <Flame className="w-3.5 h-3.5 text-[#ff0000]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-[#aaaaaa] font-semibold flex items-center justify-between">
                      <span>Top Breakout Track</span>
                      <span className="text-emerald-400 font-mono">{comp.topBreakout.viewsFormatted} views</span>
                    </div>
                    <p className="text-xs font-medium text-[#f1f1f1] truncate mt-0.5" title={comp.topBreakout.title}>
                      {comp.topBreakout.title}
                    </p>
                  </div>
                </div>

                {/* Tactical link */}
                <div className="flex items-center gap-1.5 self-end lg:self-center">
                  <span className="text-xs text-[#aaaaaa] hover:text-[#f1f1f1] font-semibold flex items-center gap-1">
                    {isSelected ? "Hide Insights" : "Tactical Gap"}
                    <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </span>
                </div>
              </div>

              {/* Expandable Intelligence Panel */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-[#282828] grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3ea6ff] mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Tactical Market Gap (How to Outrank)
                    </div>
                    <p className="text-xs text-[#aaaaaa] leading-relaxed">
                      {comp.tacticalGap}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#ff4e45] mb-1.5">
                      <Zap className="w-3.5 h-3.5" /> Title Pattern & Aesthetic
                    </div>
                    <div className="text-xs text-[#aaaaaa] space-y-1">
                      <div>
                        <span className="text-[#717171] font-medium">Formula:</span>{" "}
                        <code className="text-[11px] text-[#f1f1f1] bg-[#272727] px-1 py-0.5 rounded font-mono">
                          {comp.titlePattern}
                        </code>
                      </div>
                      <div>
                        <span className="text-[#717171] font-medium">Visual Style:</span>{" "}
                        <span className="text-[#f1f1f1]">{comp.thumbnailStyle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* High-Converting Subscribe Ad Poster */}
      <SubscribeAdPoster variant="billboard" subscriberCount={supasonicStanding.subscribers} />
    </div>
  );
}
