"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FeedPost } from "@/lib/feedEngine";
import { ChannelPlaylist } from "@/lib/playlists";
import NotificationBanner from "@/components/NotificationBanner";
import TopRecentVideosCarousel from "@/components/TopRecentVideosCarousel";
import VideoFeed from "@/components/VideoFeed";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import TipModal from "@/components/TipModal";
import SEODrawerModal from "@/components/SEODrawerModal";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import {
  Menu,
  Search,
  X,
  ArrowLeft,
  Home,
  PlaySquare,
  BookOpen,
  ShieldCheck,
  Bell,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Music2,
  Radio,
  Disc3,
  ListMusic,
} from "lucide-react";

type TabId = "home" | "releases" | "vault" | "license";

export default function HomePage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Desktop collapsible YouTube Guide Rail & Mobile Slide Drawer
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Channel stats fetched dynamically with clean defaults
  const [subscriberCount, setSubscriberCount] = useState("114+ Subscribers");
  const [videoCount, setVideoCount] = useState("70+ Releases");

  // Modal state
  const [selectedVideoPost, setSelectedVideoPost] = useState<FeedPost | null>(null);
  const [selectedTipPost, setSelectedTipPost] = useState<FeedPost | null>(null);
  const [selectedSeoPost, setSelectedSeoPost] = useState<FeedPost | null>(null);
  const [copiedCredit, setCopiedCredit] = useState(false);
  const [channelPlaylists, setChannelPlaylists] = useState<ChannelPlaylist[]>([]);

  useEffect(() => {
    let active = true;

    async function loadPlaylists() {
      try {
        const res = await fetch("/api/playlists");
        if (!res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data.playlists)) {
          setChannelPlaylists(data.playlists);
        }
      } catch {}
    }

    async function loadFeed() {
      try {
        const res = await fetch("/api/feed", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load feed");
        const data = await res.json();
        if (active && Array.isArray(data.posts)) {
          setPosts(data.posts);
          const releasesOnly = data.posts.filter((p: FeedPost) => p.type === "release");
          if (releasesOnly.length > 0) {
            setVideoCount(`${releasesOnly.length} Videos`);
          }
        }
      } catch (err) {
        console.error("Feed fetch error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadChannelStats() {
      try {
        const res = await fetch("/api/channel");
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.subscriberCount) {
          setSubscriberCount(`${data.subscriberCount} Subscribers`);
        }
      } catch {
        // Silently keep default
      }
    }

    loadFeed();
    loadChannelStats();
    loadPlaylists();

    return () => {
      active = false;
    };
  }, []);

  const releasePosts = useMemo(
    () => posts.filter((p) => p.type === "release"),
    [posts]
  );

  const handlePlayPost = (post: FeedPost) => {
    setSelectedVideoPost(post);
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && (activeTab === "vault" || activeTab === "license")) {
      setActiveTab("releases");
    }
  };

  const handleCopyCredit = () => {
    navigator.clipboard.writeText(
      "Music by Supasonic Beats (@SupasonicBeatsOfficial) — https://www.youtube.com/@SupasonicBeatsOfficial"
    );
    setCopiedCredit(true);
    setTimeout(() => setCopiedCredit(false), 2000);
  };

  const navItems: Array<{
    id: TabId;
    label: string;
    mobileLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "home", label: "Home", mobileLabel: "Home", icon: Home },
    { id: "releases", label: "Videos", mobileLabel: "Videos", icon: PlaySquare },
    { id: "vault", label: "Studio Vault", mobileLabel: "Vault", icon: BookOpen },
    { id: "license", label: "Creators & Stems", mobileLabel: "Creators", icon: ShieldCheck },
  ];

  const adBannerReleases = useMemo(
    () =>
      releasePosts.slice(0, 6).map((p) => ({
        id: p.id,
        videoId: p.videoId,
        title: p.title,
        bpm: p.bpm,
        key: p.key,
        subgenre: p.subgenre,
        thumbnail: p.thumbnail,
      })),
    [releasePosts]
  );

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f] flex flex-col">
      {/* ================================================================ */}
      {/* YOUTUBE 2026 TOP HEADER (56px Sticky Frosted Bar)                */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-40 h-14 yt-frosted-bar border-b border-black/[0.06] px-2 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
        {mobileSearchOpen ? (
          /* Expanded Mobile YouTube Search Row */
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f]"
              aria-label="Close search"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center h-10 rounded-full bg-[#f2f2f2] border border-transparent focus-within:border-[#065fd4] focus-within:bg-white px-3.5 transition-colors">
              <Search className="w-4 h-4 text-[#606060] mr-2 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Supasonic Beats, BPM, or genre..."
                className="w-full bg-transparent text-sm text-[#0f0f0f] placeholder:text-[#606060] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#606060] hover:text-[#0f0f0f]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Left: Hamburger + YouTube Brand Mark */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                    setSidebarExpanded((prev) => !prev);
                  } else {
                    setMobileDrawerOpen(true);
                  }
                }}
                className="p-2 rounded-full hover:bg-[#f2f2f2] active:bg-[#e5e5e5] transition-colors text-[#0f0f0f]"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleSelectTab("home")}
                className="flex items-center gap-2 py-1 pr-2 group text-left"
              >
                <span className="w-8 h-5.5 sm:w-8 sm:h-[22px] rounded-[6px] bg-[#ff0033] flex items-center justify-center shadow-xs group-hover:bg-[#d9002b] transition-colors">
                  <svg className="w-3.5 h-3.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0f0f0f] leading-none">
                  Supasonic
                </span>
                <span className="hidden xl:inline-block text-[10px] font-semibold text-[#606060] uppercase tracking-wider -mt-2">
                  IN
                </span>
              </button>
            </div>

            {/* Center: Authentic YouTube Pill Search Bar (Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-[600px] items-center">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (activeTab !== "releases" && activeTab !== "home") {
                    setActiveTab("releases");
                  }
                }}
                className="flex w-full h-10"
              >
                <div className="flex-1 flex items-center rounded-l-full border border-black/15 bg-white focus-within:border-[#065fd4] focus-within:shadow-inner pl-4 pr-2 transition-colors">
                  <Search className="w-4 h-4 text-[#606060] mr-2.5 hidden sm:block flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search beats, Afro House, 125 BPM, car bass..."
                    className="w-full bg-transparent text-sm text-[#0f0f0f] placeholder:text-[#606060] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 rounded-full hover:bg-[#f2f2f2] text-[#606060]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 rounded-r-full border border-l-0 border-black/15 bg-[#f8f8f8] hover:bg-[#f0f0f0] flex items-center justify-center text-[#0f0f0f] transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right: Mobile Search Icon + Studio + Subscribe */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f]"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/music"
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#ff0033]/10 hover:bg-[#ff0033]/15 text-[12px] sm:text-[13px] font-semibold text-[#ff0033] transition-colors"
              >
                <Disc3 className="w-3.5 h-3.5" />
                <span>Music</span>
              </Link>

              <Link
                href="/studio"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[13px] font-medium text-[#0f0f0f] transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Studio</span>
              </Link>

              <a
                href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0f0f0f] hover:bg-[#272727] text-white text-[12px] sm:text-[13px] font-semibold transition-colors"
              >
                <Bell className="w-3.5 h-3.5 hidden sm:block" />
                <span>Subscribe</span>
              </a>
            </div>
          </>
        )}
      </header>

      {/* ================================================================ */}
      {/* MOBILE SLIDE-OVER GUIDE DRAWER (< lg)                             */}
      {/* ================================================================ */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-64 h-full bg-white shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="h-14 px-4 border-b border-black/[0.06] flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 -ml-2 rounded-full hover:bg-[#f2f2f2]"
                aria-label="Close menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="w-7 h-5 rounded-[5px] bg-[#ff0033] flex items-center justify-center">
                <svg className="w-3 h-3 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="font-bold text-[16px] tracking-tight">Supasonic</span>
            </div>

            <div className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      active
                        ? "bg-[#f2f2f2] font-semibold text-[#0f0f0f]"
                        : "hover:bg-[#f2f2f2]/70 font-medium text-[#0f0f0f]"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <Link
                href="/music"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#ff0033] bg-[#ff0033]/[0.07] hover:bg-[#ff0033]/[0.12] transition-colors"
              >
                <Disc3 className="w-5 h-5 flex-shrink-0" />
                <span>Music & Playlists</span>
              </Link>
            </div>

            <div className="border-t border-black/[0.08] mx-3 my-2" />

            <div className="p-3 space-y-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#606060]">
                Studio & Channel
              </p>
              <Link
                href="/studio"
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#f2f2f2]"
              >
                <Sliders className="w-5 h-5 flex-shrink-0" />
                <span>Artist Studio</span>
              </Link>
              <a
                href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#f2f2f2] text-[#ff0033]"
              >
                <Radio className="w-5 h-5 flex-shrink-0" />
                <span>YouTube Channel</span>
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ================================================================ */}
      {/* DESKTOP SHELL: COLLAPSIBLE GUIDE RAIL + MAIN FLUID CANVAS        */}
      {/* ================================================================ */}
      <div className="flex flex-1 min-w-0">
        {/* Desktop Collapsible Left Guide Rail */}
        <aside
          className={`hidden lg:flex flex-col flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar bg-white border-r border-black/[0.05] transition-all duration-200 ${
            sidebarExpanded ? "w-60 px-3 py-3" : "w-[72px] px-1.5 py-3 items-center"
          }`}
        >
          <nav className="w-full space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex ${
                    sidebarExpanded
                      ? "flex-row items-center gap-5 px-3 py-2.5 rounded-xl text-[14px]"
                      : "flex-col items-center justify-center gap-1.5 py-3.5 px-1 rounded-xl text-[10px]"
                  } transition-colors ${
                    active
                      ? "bg-[#f2f2f2] font-semibold text-[#0f0f0f]"
                      : "hover:bg-[#f2f2f2]/80 font-normal text-[#0f0f0f]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">
                    {sidebarExpanded ? item.label : item.mobileLabel}
                  </span>
                </button>
              );
            })}

            <Link
              href="/music"
              className={`w-full flex ${
                sidebarExpanded
                  ? "flex-row items-center gap-5 px-3 py-2.5 rounded-xl text-[14px]"
                  : "flex-col items-center justify-center gap-1.5 py-3.5 px-1 rounded-xl text-[10px]"
              } text-[#ff0033] font-semibold hover:bg-[#ff0033]/[0.08] transition-colors`}
            >
              <Disc3 className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">
                {sidebarExpanded ? "Music & Playlists" : "Music"}
              </span>
            </Link>
          </nav>

          {sidebarExpanded ? (
            <>
              <div className="border-t border-black/[0.08] my-3" />
              <div className="px-3 mb-1.5">
                <span className="text-[13px] font-semibold text-[#0f0f0f]">
                  Artist Channels
                </span>
              </div>
              <div className="space-y-0.5 text-[13px]">
                <a
                  href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#f2f2f2] text-[#0f0f0f]"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#ff0033] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      YT
                    </span>
                    <span className="truncate">Supasonic Beats</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#065fd4] flex-shrink-0" />
                </a>
                <a
                  href="https://www.instagram.com/supasonicbeats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f2f2f2] text-[#0f0f0f]"
                >
                  <Music2 className="w-4 h-4 text-[#606060] flex-shrink-0" />
                  <span className="truncate">Instagram Reels</span>
                </a>
                <a
                  href="https://www.tiktok.com/@supasonicbeats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f2f2f2] text-[#0f0f0f]"
                >
                  <Radio className="w-4 h-4 text-[#606060] flex-shrink-0" />
                  <span className="truncate">TikTok Sounds</span>
                </a>
              </div>

              <div className="border-t border-black/[0.08] my-3" />
              <Link
                href="/studio"
                className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-[#f2f2f2] text-[13px] font-medium text-[#0f0f0f]"
              >
                <Sliders className="w-4 h-4 text-[#606060]" />
                <span>Artist Studio Workspace</span>
              </Link>

              <div className="mt-auto pt-4 px-3 text-[11px] text-[#606060] leading-relaxed">
                <p className="font-medium text-[#0f0f0f]">Supasonic Beats Official</p>
                <p>52Hz Car Sub • Indian Afro House • Raga Techno</p>
              </div>
            </>
          ) : (
            <div className="mt-2 w-full">
              <Link
                href="/studio"
                className="w-full flex flex-col items-center justify-center gap-1.5 py-3.5 px-1 rounded-xl text-[10px] hover:bg-[#f2f2f2]/80 text-[#0f0f0f]"
              >
                <Sliders className="w-5 h-5" />
                <span>Studio</span>
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-12">
          {/* Discreet Live Release Capsule */}
          <NotificationBanner
            latestPost={posts[0] || null}
            onOpenPost={(p) =>
              p.type === "tip" ? setSelectedTipPost(p) : handlePlayPost(p)
            }
          />

          {/* Sticky / Compact Channel Header Tabs when not on Home */}
          {activeTab !== "home" && (
            <div className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-3 pb-1 border-b border-black/[0.08]">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/channel_avatar.jpg"
                    alt="Supasonic Beats"
                    className="w-9 h-9 rounded-full object-cover border border-black/10"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-base sm:text-lg font-bold text-[#0f0f0f]">
                        Supasonic Beats
                      </h1>
                      <CheckCircle2 className="w-4 h-4 text-[#606060]" />
                    </div>
                    <p className="text-xs text-[#606060]">
                      @SupasonicBeatsOfficial • {subscriberCount} • {videoCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar">
                {navItems.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`pb-2.5 pt-1 text-sm whitespace-nowrap border-b-2 transition-colors ${
                        active
                          ? "border-[#0f0f0f] font-semibold text-[#0f0f0f]"
                          : "border-transparent font-medium text-[#606060] hover:text-[#0f0f0f]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === "home" && (
            <>
              <TopRecentVideosCarousel
                releases={releasePosts.slice(0, 5)}
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onOpenSEO={setSelectedSeoPost}
                onOpenTip={setSelectedTipPost}
                onPlayVideo={handlePlayPost}
                subscriberCount={subscriberCount}
                videoCount={videoCount}
              />

              {/* Authentic YouTube Home Channel Playlists Shelf */}
              {channelPlaylists.length > 0 && (
                <section className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-2 pb-4 border-b border-black/[0.06]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ListMusic className="w-5 h-5 text-[#ff0033] flex-shrink-0" />
                      <h2 className="text-base sm:text-lg font-bold text-[#0f0f0f] truncate">
                        Channel Playlists • Loop Mode
                      </h2>
                    </div>
                    <Link
                      href="/music"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-xs font-semibold text-[#0f0f0f] flex-shrink-0 transition-colors"
                    >
                      <Disc3 className="w-3.5 h-3.5 text-[#ff0033]" />
                      <span>Open Music App</span>
                    </Link>
                  </div>

                  <div className="flex items-start gap-3.5 overflow-x-auto no-scrollbar pb-2">
                    {channelPlaylists.map((pl) => (
                      <Link
                        key={pl.id}
                        href={`/music?playlist=${encodeURIComponent(pl.id)}`}
                        className="w-[210px] sm:w-[235px] flex-shrink-0 group"
                      >
                        {/* YouTube Stacked Playlist Card Effect */}
                        <div className="mx-2 h-1.5 rounded-t-lg bg-black/15" />
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-black/[0.06]">
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold flex items-center gap-1">
                            <ListMusic className="w-3 h-3" />
                            <span>{pl.tracks.length} tracks</span>
                          </div>
                        </div>
                        <h3 className="text-[13px] font-semibold text-[#0f0f0f] line-clamp-2 leading-snug mt-2 group-hover:text-[#ff0033] transition-colors">
                          {pl.title}
                        </h3>
                        <p className="text-[11px] text-[#606060] mt-0.5">
                          Play playlist on loop
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <VideoFeed
                posts={posts}
                loading={loading}
                externalSearchQuery={searchQuery}
                onPlayVideo={handlePlayPost}
                onOpenSEO={setSelectedSeoPost}
                onOpenTip={setSelectedTipPost}
                currentlyPlayingId={selectedVideoPost?.id || null}
                postTypeFilter="all"
              />

              <div className="max-w-[1600px] mx-auto px-3 sm:px-6 my-4">
                <GoogleStyleAdBanner
                  format="leaderboard"
                  releases={adBannerReleases}
                />
              </div>

              <SocialLinksIsland />
            </>
          )}

          {activeTab === "releases" && (
            <>
              <VideoFeed
                posts={posts}
                loading={loading}
                externalSearchQuery={searchQuery}
                onPlayVideo={handlePlayPost}
                onOpenSEO={setSelectedSeoPost}
                onOpenTip={setSelectedTipPost}
                currentlyPlayingId={selectedVideoPost?.id || null}
                postTypeFilter="release"
              />
              <div className="max-w-[1600px] mx-auto px-3 sm:px-6 my-4">
                <GoogleStyleAdBanner
                  format="leaderboard"
                  releases={adBannerReleases}
                />
              </div>
            </>
          )}

          {activeTab === "vault" && (
            <VideoFeed
              posts={posts}
              loading={loading}
              externalSearchQuery={searchQuery}
              onPlayVideo={handlePlayPost}
              onOpenSEO={setSelectedSeoPost}
              onOpenTip={setSelectedTipPost}
              currentlyPlayingId={selectedVideoPost?.id || null}
              postTypeFilter="tip"
            />
          )}

          {activeTab === "license" && (
            <section className="max-w-[1280px] mx-auto px-3 sm:px-6 py-6 space-y-6">
              <div className="rounded-2xl bg-[#f2f2f2] p-5 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-white text-[11px] font-semibold uppercase tracking-wider text-[#0f0f0f] mb-2">
                      Creator Attribution & Stems
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0f0f0f]">
                      Free for YouTube, Reels, Shorts & Car Audio Edits
                    </h2>
                    <p className="text-sm text-[#606060] mt-1 max-w-2xl">
                      Use Supasonic Beats tracks in your vlogs, gym reels, driving POVs, and DJ sets. Subscribe on YouTube and copy the credit line below in your description.
                    </p>
                  </div>
                  <a
                    href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ff0033] hover:bg-[#d9002b] text-white text-sm font-semibold flex-shrink-0 transition-colors"
                  >
                    <span>Subscribe to Unlock</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white rounded-xl p-4 border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <code className="text-xs sm:text-sm text-[#0f0f0f] break-all">
                    Music by Supasonic Beats (@SupasonicBeatsOfficial) — https://www.youtube.com/@SupasonicBeatsOfficial
                  </code>
                  <button
                    onClick={handleCopyCredit}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#0f0f0f] hover:bg-[#272727] text-white text-xs font-semibold flex-shrink-0 transition-colors"
                  >
                    {copiedCredit ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
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

              <SubscribeAdPoster />
            </section>
          )}

          {/* Clean YouTube-Style Footer */}
          <footer className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-8 pb-6 mt-6 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#606060]">
            <p className="font-medium text-[#0f0f0f]">
              © {new Date().getFullYear()} Supasonic Beats • Engineered for 52Hz Sub-Bass & Car Audio
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSelectTab("releases")}
                className="hover:text-[#0f0f0f] transition-colors"
              >
                All Releases
              </button>
              <button
                onClick={() => handleSelectTab("license")}
                className="hover:text-[#0f0f0f] transition-colors"
              >
                Creator License
              </button>
              <Link href="/studio" className="hover:text-[#0f0f0f] transition-colors">
                Artist Studio
              </Link>
            </div>
          </footer>
        </main>
      </div>

      {/* ================================================================ */}
      {/* YOUTUBE MOBILE APP BOTTOM NAVIGATION BAR (< lg)                  */}
      {/* ================================================================ */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 yt-frosted-bar border-t border-black/[0.08] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
                  active ? "text-[#0f0f0f] font-semibold" : "text-[#606060] font-normal"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
                <span>{item.mobileLabel}</span>
              </button>
            );
          })}

          <Link
            href="/music"
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-[#ff0033]"
          >
            <Disc3 className="w-5 h-5 stroke-[2]" />
            <span>Music</span>
          </Link>
        </div>
      </nav>

      {/* ================================================================ */}
      {/* MODALS                                                           */}
      {/* ================================================================ */}
      <VideoPlayerModal
        post={selectedVideoPost}
        onClose={() => setSelectedVideoPost(null)}
        onOpenSEO={(post) => {
          setSelectedVideoPost(null);
          setSelectedSeoPost(post);
        }}
      />

      <TipModal
        post={selectedTipPost}
        onClose={() => setSelectedTipPost(null)}
      />

      <SEODrawerModal
        post={selectedSeoPost}
        onClose={() => setSelectedSeoPost(null)}
      />
    </div>
  );
}
