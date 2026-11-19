"use client";

import React, { useState, useEffect } from "react";
import {
  Music,
  Disc,
  Sparkles,
  Trophy,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Play,
  Download,
  Share2,
  Sliders,
  ExternalLink,
  Flame,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Zap,
  BookOpen,
  Bell,
} from "lucide-react";
import TopRecentVideosCarousel from "@/components/TopRecentVideosCarousel";
import VideoFeed from "@/components/VideoFeed";
import CompetitorLeaderboard from "@/components/CompetitorLeaderboard";
import SEOGeneratorTab from "@/components/SEOGeneratorTab";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import TipModal from "@/components/TipModal";
import SEODrawerModal from "@/components/SEODrawerModal";
import NewPostModal from "@/components/NewPostModal";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import NotificationBanner from "@/components/NotificationBanner";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";
import { FeedPost } from "@/lib/feedEngine";
import { CompetitorItem } from "@/lib/competitorRanking";

export default function ChannelWebsite() {
  // Navigation tabs: 'feed' | 'tips' | 'seo' | 'competitors'
  const [activeTab, setActiveTab] = useState<"feed" | "tips" | "seo" | "competitors">("feed");

  // Feed State
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [channelInfo, setChannelInfo] = useState<any>({
    title: "SUPASONIC BEATS",
    customUrl: "@SupasonicBeatsOfficial",
    description: "Official Studio Hub • High Energy Hindi Afro House, Desi Deep House & Club Bangers. Free streams, stems & high-quality audio downloads.",
    statistics: {
      subscriberCount: "114+",
      viewCount: "46000",
      videoCount: "78",
    },
  });
  const [syncing, setSyncing] = useState<boolean>(false);

  // Competitor Leaderboard State
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [supasonicStanding, setSupasonicStanding] = useState<any>({
    rank: 6,
    name: "SUPASONIC BEATS (Official)",
    channelId: "UCM1yIAO_tvDGWOYi3JcyacA",
    subscribers: "114+",
    totalViews: "46K+",
    dominantBPM: "124 BPM",
    signatureStyle: "Desi Electronic & Hindi Afro House",
    tacticalGap: "High release velocity + 124 BPM club drops is the optimal formula to crack the Top 5.",
    topBreakout: {
      title: "DEEDAR DE [124 BPM] - Hindi Afro House (5.7K views)",
      views: 5700,
      viewsFormatted: "5.7K",
    },
    isSupasonic: true,
  });
  const [nicheStats, setNicheStats] = useState<any>({
    totalTrackedChannels: 25,
    avgBPM: "123.8 BPM",
    topSubgenre: "Hindi Afro House",
    highestBreakoutVelocity: "1.42M in 14 days",
  });

  // Modals
  const [selectedVideoToPlay, setSelectedVideoToPlay] = useState<FeedPost | null>(null);
  const [selectedTipToRead, setSelectedTipToRead] = useState<FeedPost | null>(null);
  const [selectedVideoForSEO, setSelectedVideoForSEO] = useState<FeedPost | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchFeedData(false);
    fetchCompetitorsData();
  }, []);

  const fetchFeedData = async (refresh: boolean = false) => {
    try {
      if (refresh) setSyncing(true);
      else setPostsLoading(true);

      const res = await fetch(`/api/feed${refresh ? "?refresh=true" : ""}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.posts || []);
        if (data.channel) setChannelInfo(data.channel);
        if (refresh) {
          showToast(data.liveSynced ? "⚡ Live Synced from YouTube Channel!" : "✓ Feed catalog updated successfully!");
        }
      }
    } catch (e) {
      console.error("Failed to load feed:", e);
      if (refresh) showToast("Could not sync live, using local catalog");
    } finally {
      setPostsLoading(false);
      setSyncing(false);
    }
  };

  const fetchCompetitorsData = async () => {
    try {
      const res = await fetch("/api/competitors");
      const data = await res.json();
      if (data.success) {
        setCompetitors(data.topCompetitors || []);
        if (data.supasonicStanding) setSupasonicStanding(data.supasonicStanding);
        if (data.nicheStats) setNicheStats(data.nicheStats);
      }
    } catch (e) {
      console.warn("Failed to load competitors:", e);
    }
  };

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
    showToast(newPost.type === "tip" ? "💡 Producer Tip published to stream!" : "🔥 New track published to feed!");
    if (newPost.type === "tip") {
      setSelectedTipToRead(newPost);
    } else {
      setSelectedVideoForSEO(newPost);
    }
  };

  const latestPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f0f0f] flex flex-col selection:bg-[#ff0000] selection:text-white">
      {/* Dynamic Notification Pill Banner (Drop Alerts) */}
      <NotificationBanner
        latestPost={latestPost}
        onOpenPost={(post) => {
          if (post.type === "tip") setSelectedTipToRead(post);
          else setSelectedVideoToPlay(post);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 border border-red-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Professional Sticky Top Navigation Bar (Sleek on Laptop & Mobile) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Bar */}
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#ff0000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Play className="w-4 h-4 fill-current translate-x-0.2" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-gray-900 text-sm sm:text-base tracking-tight">
                    SUPASONIC BEATS
                  </span>
                  <span className="text-[#065fd4] text-xs font-bold" title="Verified Artist">✓</span>
                  <span className="text-[9px] px-1 py-0.2 bg-gray-100 text-gray-700 font-semibold rounded">IN</span>
                </div>
                <span className="text-[11px] text-gray-500 hidden sm:inline">
                  Official Studio Hub • 124 BPM Hindi Afro House
                </span>
              </div>
            </div>

            {/* Center (Desktop/Laptop): Segmented Professional Navigation Tabs */}
            <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "feed"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <Music className={`w-3.5 h-3.5 ${activeTab === "feed" ? "text-[#ff0000]" : ""}`} />
                <span>Beats Catalog</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === "feed" ? "bg-red-50 text-[#ff0000]" : "bg-gray-200 text-gray-600"
                }`}>
                  {posts.filter((p) => p.type === "release").length || 64}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("tips")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "tips"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${activeTab === "tips" ? "text-[#ff0000]" : ""}`} />
                <span>Producer Vault</span>
              </button>

              <button
                onClick={() => setActiveTab("seo")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "seo"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === "seo" ? "text-amber-500" : ""}`} />
                <span>SEO Generator</span>
              </button>

              <button
                onClick={() => setActiveTab("competitors")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "competitors"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <Trophy className={`w-3.5 h-3.5 ${activeTab === "competitors" ? "text-amber-500" : ""}`} />
                <span>Leaderboard</span>
              </button>
            </nav>

            {/* Right: Actions (Subscribe + Sync + Add Post) */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-3.5 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Bell className="w-3.5 h-3.5 fill-current" />
                <span>Subscribe ({channelInfo?.statistics?.subscriberCount || "114+"})</span>
              </a>

              <button
                onClick={() => fetchFeedData(true)}
                disabled={syncing}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                title="Sync Live Channel Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#ff0000]" : ""}`} />
              </button>

              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#ff0000]" />
                <span className="hidden sm:inline">Add Post</span>
              </button>
            </div>
          </div>

          {/* Mobile Secondary Bar: Horizontal Scrollable Category Tabs (Touch Friendly) */}
          <nav aria-label="Mobile Navigation" className="flex lg:hidden items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-gray-100">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === "feed"
                  ? "bg-[#ff0000] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Music className="w-3 h-3" />
              <span>Beats ({posts.filter((p) => p.type === "release").length || 64})</span>
            </button>

            <button
              onClick={() => setActiveTab("tips")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === "tips"
                  ? "bg-[#ff0000] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Producer Vault</span>
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === "seo"
                  ? "bg-[#ff0000] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>SEO Generator</span>
            </button>

            <button
              onClick={() => setActiveTab("competitors")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === "competitors"
                  ? "bg-[#ff0000] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Leaderboard</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full space-y-6">
        {/* TOP SECTION: Netflix / Prime Video Style Side-by-Side Horizontal Hero Carousel (Latest 5 Widescreen Videos) */}
        <TopRecentVideosCarousel
          onOpenSEO={(post) => setSelectedVideoForSEO(post)}
          onOpenTip={(post) => setSelectedTipToRead(post)}
          onPlayVideo={(post) => setSelectedVideoToPlay(post)}
        />

        {/* Tab 1: Video Releases & Beat Downloads */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#ff0000]" />
                  Full Video Releases & Beat Masters Feed
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  16:9 widescreen video catalog matching @SupasonicBeatsOfficial. Free 320kbps MP3s, studio WAV stems & viral sound tags.
                </p>
              </div>

              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="self-start sm:self-center px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Upload / Add New Post
              </button>
            </div>

            {/* Google Display Ad Leaderboard Banner */}
            <GoogleStyleAdBanner format="leaderboard" />

            <VideoFeed
              posts={posts}
              loading={postsLoading}
              onPlayVideo={(post) => setSelectedVideoToPlay(post)}
              onOpenSEO={(post) => setSelectedVideoForSEO(post)}
              onOpenTip={(post) => setSelectedTipToRead(post)}
              currentlyPlayingId={selectedVideoToPlay?.id}
              postTypeFilter="release"
            />

            {/* Google Display Ad Billboard Banner */}
            <GoogleStyleAdBanner format="billboard" />

            {/* Social Links Ecosystem */}
            <SocialLinksIsland />

            {/* Bottom YouTube Subscribe Advertisement Poster */}
            <SubscribeAdPoster variant="billboard" subscriberCount={channelInfo?.statistics?.subscriberCount || "114+"} />
          </div>
        )}

        {/* Tab 2: Tips & Tricks Stream */}
        {activeTab === "tips" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ff0000]" />
                  Producer Tips, Tricks & Studio Masterclasses
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Exclusive sound design secrets, 124 BPM mix guides, and YouTube algorithm growth playbooks.
                </p>
              </div>

              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="self-start sm:self-center px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Share a New Tip
              </button>
            </div>

            {/* Google Display Ad Leaderboard */}
            <GoogleStyleAdBanner format="leaderboard" />

            <VideoFeed
              posts={posts}
              loading={postsLoading}
              onPlayVideo={(post) => setSelectedVideoToPlay(post)}
              onOpenSEO={(post) => setSelectedVideoForSEO(post)}
              onOpenTip={(post) => setSelectedTipToRead(post)}
              currentlyPlayingId={selectedVideoToPlay?.id}
              postTypeFilter="tip"
            />

            {/* Social Links Ecosystem */}
            <SocialLinksIsland />

            {/* Subscribe Poster */}
            <SubscribeAdPoster variant="billboard" subscriberCount={channelInfo?.statistics?.subscriberCount || "114+"} />
          </div>
        )}

        {/* Tab 3: SEO & Viral Sound Tag Generator */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <GoogleStyleAdBanner format="leaderboard" />
            <SEOGeneratorTab />
            <SocialLinksIsland />
            <SubscribeAdPoster variant="billboard" subscriberCount={channelInfo?.statistics?.subscriberCount || "114+"} />
          </div>
        )}

        {/* Tab 4: Competitor Chart Rankings */}
        {activeTab === "competitors" && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Hindi Afro House & Desi EDM Competitor Leaderboard
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Market share tracking, breakout velocity, and tactical opportunities to outrank competitors.
              </p>
            </div>

            <GoogleStyleAdBanner format="leaderboard" />

            <CompetitorLeaderboard
              competitors={competitors}
              supasonicStanding={supasonicStanding}
              nicheStats={nicheStats}
            />

            <SocialLinksIsland />
          </div>
        )}
      </main>

      {/* Google Display AdSense Sticky Bottom Anchor Ad */}
      <GoogleStyleAdBanner format="anchor" />

      {/* Clean Bright Modern Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <img src="/channel_avatar.jpg" alt="Supasonic Beats" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-gray-900">SUPASONIC BEATS</span> • Official YouTube Music Portal
              <div className="text-[11px] text-gray-500">Instagram • TikTok • Facebook • YouTube</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
            <button onClick={() => setActiveTab("feed")} className="hover:text-black transition-colors">
              Releases & Audio
            </button>
            <button onClick={() => setActiveTab("tips")} className="hover:text-black transition-colors">
              Tips & Tricks
            </button>
            <button onClick={() => setActiveTab("seo")} className="hover:text-black transition-colors">
              SEO Generator
            </button>
            <button onClick={() => setActiveTab("competitors")} className="hover:text-black transition-colors">
              Competitor Rankings
            </button>
            <a
              href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff0000] hover:text-[#cc0000] font-bold flex items-center gap-1"
            >
              YouTube Subscribe <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Video Cinema Player Modal */}
      {selectedVideoToPlay && (
        <VideoPlayerModal
          post={selectedVideoToPlay}
          onClose={() => setSelectedVideoToPlay(null)}
          onOpenSEO={(post) => setSelectedVideoForSEO(post)}
        />
      )}

      {/* Tip Reader Modal */}
      {selectedTipToRead && (
        <TipModal
          post={selectedTipToRead}
          onClose={() => setSelectedTipToRead(null)}
        />
      )}

      {/* SEO & Viral Sound Tags Modal */}
      {selectedVideoForSEO && (
        <SEODrawerModal
          post={selectedVideoForSEO}
          onClose={() => setSelectedVideoForSEO(null)}
        />
      )}

      {/* New Post Modal (Video or Tip) */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
