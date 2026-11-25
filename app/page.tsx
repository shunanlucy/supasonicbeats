"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Music,
  BookOpen,
  ShieldCheck,
  Bell,
  ExternalLink,
  Copy,
  Check,
  Sliders,
} from "lucide-react";
import TopRecentVideosCarousel from "@/components/TopRecentVideosCarousel";
import VideoFeed from "@/components/VideoFeed";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import TipModal from "@/components/TipModal";
import SEODrawerModal from "@/components/SEODrawerModal";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import NotificationBanner from "@/components/NotificationBanner";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";
import { FeedPost } from "@/lib/feedEngine";

export default function ChannelWebsite() {
  // Public Listener Tabs Only: 'catalog' | 'vault' | 'license'
  const [activeTab, setActiveTab] = useState<"catalog" | "vault" | "license">("catalog");

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [channelInfo, setChannelInfo] = useState<any>({
    title: "SUPASONIC BEATS",
    customUrl: "@SupasonicBeatsOfficial",
    statistics: {
      subscriberCount: "141+",
      viewCount: "59291",
      videoCount: "98",
    },
  });

  // Modals
  const [selectedVideoToPlay, setSelectedVideoToPlay] = useState<FeedPost | null>(null);
  const [selectedTipToRead, setSelectedTipToRead] = useState<FeedPost | null>(null);
  const [selectedVideoForSEO, setSelectedVideoForSEO] = useState<FeedPost | null>(null);
  const [copiedCredit, setCopiedCredit] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setPostsLoading(true);
        const res = await fetch("/api/feed");
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts || []);
          if (data.channel) setChannelInfo(data.channel);
        }
      } catch (e) {
        console.warn("Using local catalog fallback:", e);
      } finally {
        setPostsLoading(false);
      }
    };
    loadFeed();
  }, []);

  const latestPost = posts.length > 0 ? posts[0] : null;
  const subCount = channelInfo?.statistics?.subscriberCount || "141+";
  const videoCount = channelInfo?.statistics?.videoCount || "98";

  const copyCreditText = () => {
    navigator.clipboard.writeText(
      "Music: SUPASONIC BEATS — https://www.youtube.com/@SupasonicBeatsOfficial"
    );
    setCopiedCredit(true);
    setTimeout(() => setCopiedCredit(false), 2000);
  };

  return (
    <div className="min-h-screen water-ambient-bg text-[#0b0f19] relative overflow-x-hidden flex flex-col pb-24 lg:pb-0 selection:bg-[#ff3b30] selection:text-white">
      {/* Subtle Apple Water Caustics Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-36 -left-32 w-[30rem] h-[30rem] rounded-full bg-sky-200/40 blur-[120px] animate-water-pulse" />
        <div className="absolute top-1/3 -right-32 w-[34rem] h-[34rem] rounded-full bg-blue-100/45 blur-[130px] animate-water-pulse [animation-delay:4s]" />
        <div className="absolute -bottom-32 left-[18%] w-[28rem] h-[28rem] rounded-full bg-rose-100/30 blur-[120px] animate-water-pulse [animation-delay:7s]" />
      </div>

      {/* Non-Colliding Top Notification Capsule */}
      <NotificationBanner
        latestPost={latestPost}
        onOpenPost={(post) => {
          if (post.type === "tip") setSelectedTipToRead(post);
          else setSelectedVideoToPlay(post);
        }}
      />

      {/* Sticky Crystal Frosted Navbar (Desktop & Mobile) */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl liquid-btn-red flex items-center justify-center flex-shrink-0">
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-[#0b0f19] text-sm tracking-tight truncate">
                SUPASONIC BEATS
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block truncate">
                Official Sound Vault · Afro House &amp; Car Bass
              </div>
            </div>
          </Link>

          {/* Desktop Public Navigation Pills */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 bg-slate-900/5 p-1 rounded-xl"
          >
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "catalog"
                  ? "liquid-pill-active"
                  : "text-slate-600 hover:text-[#0b0f19]"
              }`}
            >
              Releases ({posts.filter((p) => p.type === "release").length || 64})
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "vault"
                  ? "liquid-pill-active"
                  : "text-slate-600 hover:text-[#0b0f19]"
              }`}
            >
              Studio Vault
            </button>
            <button
              onClick={() => setActiveTab("license")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "license"
                  ? "liquid-pill-active"
                  : "text-slate-600 hover:text-[#0b0f19]"
              }`}
            >
              Creator Use
            </button>
          </nav>

          <a
            href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full liquid-btn-red font-semibold text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Subscribe</span>
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full space-y-8">
        {/* Top Split Editorial Showcase (Latest 5 Widescreen Videos — Unblocked Art) */}
        <TopRecentVideosCarousel
          subscriberCount={subCount}
          videoCount={videoCount}
          onPlayVideo={(post) => setSelectedVideoToPlay(post)}
        />

        {/* Tab 1: Full Releases Catalog */}
        {activeTab === "catalog" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-[#0b0f19] tracking-tight">
                  Audio &amp; Visual Releases
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Watch in HD and unlock 320kbps MP3s or Car-Ready WAV masters.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("license")}
                className="self-start sm:self-auto text-xs font-semibold text-[#ff3b30] hover:underline flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Free for Reels &amp; Vlogs (Usage Terms)</span>
              </button>
            </div>

            <VideoFeed
              posts={posts}
              loading={postsLoading}
              onPlayVideo={(post) => setSelectedVideoToPlay(post)}
              onOpenSEO={(post) => setSelectedVideoForSEO(post)}
              onOpenTip={(post) => setSelectedTipToRead(post)}
              currentlyPlayingId={selectedVideoToPlay?.id}
              postTypeFilter="release"
            />

            {/* Single Clean Editorial Ad Slot */}
            <GoogleStyleAdBanner format="leaderboard" />

            <SocialLinksIsland />
          </div>
        )}

        {/* Tab 2: Producer Studio Vault (Tips & Mixing Breakdowns) */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="px-1">
              <h2 className="text-lg sm:text-2xl font-bold text-[#0b0f19] tracking-tight">
                Studio Mixing &amp; Production Vault
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Low-end bass tuning, -14 LUFS mastering standards, and sound design breakdowns.
              </p>
            </div>

            <VideoFeed
              posts={posts}
              loading={postsLoading}
              onPlayVideo={(post) => setSelectedVideoToPlay(post)}
              onOpenSEO={(post) => setSelectedVideoForSEO(post)}
              onOpenTip={(post) => setSelectedTipToRead(post)}
              currentlyPlayingId={selectedVideoToPlay?.id}
              postTypeFilter="tip"
            />

            <SubscribeAdPoster variant="billboard" subscriberCount={subCount} />
          </div>
        )}

        {/* Tab 3: Creator Use / Reels & DJ License Guide */}
        {activeTab === "license" && (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[28px] p-6 sm:p-8 space-y-5">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff3b30]">
                  Creator Safe-Use Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0b0f19]">
                  Use Supasonic Beats in Your Reels, YouTube Vlogs &amp; DJ Sets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Car enthusiasts, travel vloggers, and independent DJs can feature our 124–128 BPM masters in short-form videos and mixes. Simply credit the official channel in your caption or video description.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/75 border border-white space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Required Credit Line
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <code className="text-xs font-mono text-[#0b0f19] break-all">
                    Music: SUPASONIC BEATS — https://www.youtube.com/@SupasonicBeatsOfficial
                  </code>
                  <button
                    onClick={copyCreditText}
                    className="self-start sm:self-center px-3.5 py-1.5 rounded-full liquid-pill text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                  >
                    {copiedCredit ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Credit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <SubscribeAdPoster variant="billboard" subscriberCount={subCount} />
            <SocialLinksIsland />
          </div>
        )}
      </main>

      {/* Mobile Floating Control-Center Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Floating Dock"
        className="lg:hidden fixed bottom-3 inset-x-4 z-40 flex justify-center pointer-events-none"
      >
        <div className="liquid-glass rounded-full px-2 py-1.5 flex items-center gap-1 shadow-xl pointer-events-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "catalog" ? "liquid-pill-active" : "text-slate-600"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "vault" ? "liquid-pill-active" : "text-slate-600"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>

          <button
            onClick={() => setActiveTab("license")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "license" ? "liquid-pill-active" : "text-slate-600"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Creators</span>
          </button>
        </div>
      </nav>

      {/* Frosted Liquid Glass Footer (With Discreet Creator Studio Link) */}
      <footer className="mt-10 px-3 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto liquid-glass rounded-3xl px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
              <img src="/channel_avatar.jpg" alt="Supasonic Beats" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-[#0b0f19]">SUPASONIC BEATS</span> · Official Audio &amp; Music Hub
              <div className="text-[11px] text-slate-500">YouTube · Instagram · TikTok · Facebook</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <button onClick={() => setActiveTab("catalog")} className="hover:text-[#0b0f19] transition-colors">
              Releases
            </button>
            <button onClick={() => setActiveTab("vault")} className="hover:text-[#0b0f19] transition-colors">
              Studio Vault
            </button>
            <button onClick={() => setActiveTab("license")} className="hover:text-[#0b0f19] transition-colors">
              Creator Use
            </button>
            <Link href="/studio" className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
              <Sliders className="w-3 h-3" />
              <span>Artist Studio</span>
            </Link>
            <a
              href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff3b30] font-semibold flex items-center gap-1"
            >
              <span>Subscribe</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedVideoToPlay && (
        <VideoPlayerModal
          post={selectedVideoToPlay}
          onClose={() => setSelectedVideoToPlay(null)}
          onOpenSEO={(post) => setSelectedVideoForSEO(post)}
        />
      )}

      {selectedTipToRead && (
        <TipModal
          post={selectedTipToRead}
          onClose={() => setSelectedTipToRead(null)}
        />
      )}

      {selectedVideoForSEO && (
        <SEODrawerModal
          post={selectedVideoForSEO}
          onClose={() => setSelectedVideoForSEO(null)}
        />
      )}
    </div>
  );
}
