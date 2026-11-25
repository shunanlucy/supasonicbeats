"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FeedPost } from "@/lib/feedEngine";
import { ChannelPlaylist } from "@/lib/playlists";
import SubscribeUnlockModal from "@/components/SubscribeUnlockModal";
import { useGlobalMusic, SleepTimerMode } from "@/components/GlobalMusicProvider";
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Trash2,
  Check,
  X,
  ExternalLink,
  Disc3,
  Radio,
  MonitorPlay,
  Music2,
  Car,
  Moon,
  Share2,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Download,
  FileAudio,
  Youtube,
  BookmarkPlus,
} from "lucide-react";

type MusicView = "home" | "search" | "library" | "playlist" | "shared";

interface SharedPayload {
  n: string;
  d: string;
  t: string[];
}

function encodeSharedPlaylist(payload: SharedPayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeSharedPlaylist(token: string): SharedPayload | null {
  try {
    const pad = token.length % 4 === 0 ? "" : "=".repeat(4 - (token.length % 4));
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.n === "string" && Array.isArray(parsed.t)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function MusicPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#09090b] text-white flex items-center justify-center text-sm font-medium">
          Loading Supasonic Music...
        </div>
      }
    >
      <MusicAppContent />
    </Suspense>
  );
}

function MusicAppContent() {
  const searchParams = useSearchParams();
  const {
    queueTracks,
    queueTitle,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    repeatMode,
    shuffleEnabled,
    currentTime,
    duration,
    volume,
    isMuted,
    favoriteIds,
    customPlaylists,
    showVideoStage,
    sleepTimerMode,
    sleepSecondsLeft,
    setShowVideoStage,
    setCarModeOpen,
    setShuffleEnabled,
    setSleepTimer,
    cycleRepeatMode,
    playCollection,
    seedInitialQueue,
    togglePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleFavorite,
    createCustomPlaylist,
    toggleTrackInCustomPlaylist,
    moveTrackInCustomPlaylist,
    deleteCustomPlaylist,
    importSharedPlaylist,
  } = useGlobalMusic();

  // Catalog & Channel Playlists
  const [channelPlaylists, setChannelPlaylists] = useState<ChannelPlaylist[]>([]);
  const [allTracks, setAllTracks] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // View State
  const [activeView, setActiveView] = useState<MusicView>("home");
  const [selectedPlaylistKey, setSelectedPlaylistKey] = useState<string>("favorites");
  const [sharedPlaylist, setSharedPlaylist] = useState<SharedPayload | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenreChip, setActiveGenreChip] = useState<string>("all");

  // Modals & Popovers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<FeedPost | null>(null);
  const [expandedPlayerOpen, setExpandedPlayerOpen] = useState(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [sharedSavedNotice, setSharedSavedNotice] = useState(false);

  // Download Subscribe Unlock Modal inside Music App
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  // Fetch live channel playlists + all public catalog tracks
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/playlists", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data.success) {
          setChannelPlaylists(data.playlists || []);
          const tracks: FeedPost[] = data.allTracks || [];
          setAllTracks(tracks);
          if (tracks.length > 0) {
            seedInitialQueue(
              tracks.slice(0, 20),
              data.playlists?.[0]?.title || "Supasonic Latest Releases"
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [seedInitialQueue]);

  // Handle deep links ?playlist=ID or ?share=TOKEN
  useEffect(() => {
    const plParam = searchParams?.get("playlist");
    const shareParam = searchParams?.get("share");

    if (shareParam) {
      const decoded = decodeSharedPlaylist(shareParam);
      if (decoded) {
        setSharedPlaylist(decoded);
        setActiveView("shared");
        return;
      }
    }

    if (plParam) {
      setSelectedPlaylistKey(plParam);
      setActiveView("playlist");
    }
  }, [searchParams]);

  const trackMap = useMemo(() => {
    const map = new Map<string, FeedPost>();
    for (const t of allTracks) {
      if (t.videoId) map.set(t.videoId, t);
    }
    return map;
  }, [allTracks]);

  const favoriteTracks = useMemo(
    () =>
      favoriteIds
        .map((id) => trackMap.get(id))
        .filter((t): t is FeedPost => Boolean(t)),
    [favoriteIds, trackMap]
  );

  const sharedResolvedTracks = useMemo(() => {
    if (!sharedPlaylist) return [];
    return sharedPlaylist.t
      .map((id) => trackMap.get(id))
      .filter((t): t is FeedPost => Boolean(t));
  }, [sharedPlaylist, trackMap]);

  const openPlaylistView = (key: string) => {
    setSelectedPlaylistKey(key);
    setActiveView("playlist");
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const created = createCustomPlaylist(
      newPlaylistName,
      newPlaylistDesc,
      addToPlaylistTrack?.videoId
    );
    setNewPlaylistName("");
    setNewPlaylistDesc("");
    setShowCreateModal(false);

    if (!addToPlaylistTrack) {
      setSelectedPlaylistKey(created.id);
      setActiveView("playlist");
    } else {
      setAddToPlaylistTrack(null);
    }
  };

  const handleShareCustomPlaylist = (
    key: string,
    title: string,
    desc: string,
    tracks: FeedPost[]
  ) => {
    if (typeof window === "undefined") return;
    const token = encodeSharedPlaylist({
      n: title,
      d: desc,
      t: tracks.map((t) => t.videoId!).filter(Boolean),
    });
    const url = `${window.location.origin}/music?share=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedShareId(key);
    setTimeout(() => setCopiedShareId(null), 2200);
  };

  const openDownloadFunnel = (track: FeedPost, format: "mp3" | "wav") => {
    const cleanName = track.title
      .split("|")[0]
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "_");
    setUnlockModal({
      isOpen: true,
      trackTitle: track.title.split("|")[0].trim(),
      formatLabel:
        format === "wav" ? "Studio 48kHz Master WAV" : "320 kbps Stereo MP3",
      downloadUrl:
        (format === "wav" ? track.wavDownloadUrl : track.mp3DownloadUrl) ||
        track.audioUrl ||
        "/audio/clover_clip.mp3",
      filename: `${cleanName}_${
        format === "wav" ? "StudioMaster.wav" : "320kbps.mp3"
      }`,
    });
  };

  // Active Playlist Detail Resolver
  const activePlaylistData = useMemo(() => {
    if (selectedPlaylistKey === "favorites") {
      return {
        key: "favorites",
        kind: "favorites" as const,
        title: "Liked Songs",
        subtitle: "Your saved Supasonic Beats favorites • Instant loop queue",
        cover: favoriteTracks[0]?.thumbnail || "/channel_avatar.jpg",
        tracks: favoriteTracks,
        youtubeUrl: null as string | null,
      };
    }

    if (selectedPlaylistKey.startsWith("custom:")) {
      const custom = customPlaylists.find((c) => c.id === selectedPlaylistKey);
      if (custom) {
        const tracks = custom.trackIds
          .map((id) => trackMap.get(id))
          .filter((t): t is FeedPost => Boolean(t));
        return {
          key: custom.id,
          kind: "custom" as const,
          title: custom.name,
          subtitle: custom.description,
          cover: tracks[0]?.thumbnail || "/channel_banner.jpg",
          tracks,
          youtubeUrl: null as string | null,
        };
      }
    }

    const yt = channelPlaylists.find((p) => p.id === selectedPlaylistKey);
    if (yt) {
      return {
        key: yt.id,
        kind: "channel" as const,
        title: yt.title,
        subtitle: yt.description,
        cover: yt.thumbnail,
        tracks: yt.tracks,
        youtubeUrl: yt.youtubeUrl,
      };
    }

    return null;
  }, [selectedPlaylistKey, favoriteTracks, customPlaylists, channelPlaylists, trackMap]);

  // Mood / Genre Presets
  const genreChips = [
    { label: "All Tracks", value: "all" },
    { label: "Night Drive 124 BPM", value: "drive_preset" },
    { label: "Gym 52Hz Bass", value: "gym_preset" },
    { label: "Afro House", value: "Afro House" },
    { label: "Deep House", value: "Deep House" },
    { label: "Phonk & Drift", value: "Phonk" },
    { label: "Anime & Cinematic", value: "Anime" },
    { label: "Indie Pop", value: "Indie" },
  ];

  const filteredCatalogTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTracks.filter((t) => {
      let matchesGenre = true;
      if (activeGenreChip === "drive_preset") {
        matchesGenre =
          (t.bpm >= 120 && t.bpm <= 128) ||
          (t.mood || "").toLowerCase().includes("drive") ||
          t.title.toLowerCase().includes("drive");
      } else if (activeGenreChip === "gym_preset") {
        matchesGenre =
          t.bpm >= 126 ||
          t.subgenre.toLowerCase().includes("phonk") ||
          t.subgenre.toLowerCase().includes("techno");
      } else if (activeGenreChip !== "all") {
        matchesGenre =
          t.subgenre.toLowerCase().includes(activeGenreChip.toLowerCase()) ||
          t.title.toLowerCase().includes(activeGenreChip.toLowerCase());
      }

      if (!matchesGenre) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.subgenre.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        String(t.bpm).includes(q)
      );
    });
  }, [allTracks, searchQuery, activeGenreChip]);

  const filteredChannelPlaylists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return channelPlaylists;
    return channelPlaylists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [channelPlaylists, searchQuery]);

  const formatTime = (sec: number) => {
    if (!isFinite(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const sleepOptions: Array<{ mode: SleepTimerMode; label: string }> = [
    { mode: "off", label: "Sleep Timer Off" },
    { mode: "15", label: "15 Minutes" },
    { mode: "30", label: "30 Minutes" },
    { mode: "60", label: "60 Minutes" },
    { mode: "track_end", label: "End of Current Track" },
  ];

  return (
    <div className="h-screen w-full bg-[#09090b] text-white flex flex-col overflow-hidden select-none">
      {/* ================================================================ */}
      {/* TOP SPOTIFY / YT MUSIC APP BAR                                   */}
      {/* ================================================================ */}
      <header className="h-14 flex-shrink-0 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube Channel</span>
            <span className="sm:hidden">Site</span>
          </Link>

          <button
            onClick={() => setActiveView("home")}
            className="flex items-center gap-2 min-w-0 text-left"
          >
            <span className="w-7 h-7 rounded-full bg-[#ff0033] flex items-center justify-center flex-shrink-0 shadow-md">
              <Disc3 className="w-4 h-4 text-white" />
            </span>
            <span className="font-bold text-sm sm:text-base tracking-tight truncate">
              Supasonic Music
            </span>
          </button>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center bg-[#1c1c21] hover:bg-[#232329] focus-within:bg-[#232329] focus-within:ring-1 focus-within:ring-white/30 rounded-full px-3.5 h-9 transition-all">
          <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (activeView !== "search") setActiveView("search");
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== "search") setActiveView("search");
            }}
            placeholder="Search tracks, playlists, BPM, or genre..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Car Mode + Create + Favorites */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setCarModeOpen(true)}
            title="Car Drive OLED WakeLock Mode"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-xs font-semibold text-zinc-200 transition-colors"
          >
            <Car className="w-3.5 h-3.5 text-[#ff0033]" />
            <span className="hidden sm:inline">Car Mode</span>
          </button>

          <button
            onClick={() => {
              setAddToPlaylistTrack(null);
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Playlist</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            onClick={() => openPlaylistView("favorites")}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.1] hover:bg-white/[0.18] text-xs font-semibold transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-[#ff0033] fill-[#ff0033]" />
            <span>{favoriteTracks.length}</span>
          </button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* BODY SPLIT: SPOTIFY LEFT LIBRARY SIDEBAR + MAIN SCROLL CANVAS    */}
      {/* ================================================================ */}
      <div className="flex-1 flex min-h-0 overflow-hidden gap-2 p-0 lg:p-2">
        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-68 xl:w-72 flex-col gap-2 flex-shrink-0 min-h-0">
          <div className="rounded-xl bg-[#121216] p-3 space-y-1">
            <button
              onClick={() => setActiveView("home")}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeView === "home"
                  ? "bg-white/[0.12] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView("search")}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeView === "search"
                  ? "bg-white/[0.12] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Search Catalog</span>
            </button>
          </div>

          <div className="flex-1 min-h-0 rounded-xl bg-[#121216] flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
              <button
                onClick={() => setActiveView("library")}
                className="flex items-center gap-2.5 text-sm font-bold text-zinc-300 hover:text-white"
              >
                <Library className="w-5 h-5" />
                <span>Your Library</span>
              </button>
              <button
                onClick={() => {
                  setAddToPlaylistTrack(null);
                  setShowCreateModal(true);
                }}
                title="Create new playlist"
                className="p-1.5 rounded-full hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
              <button
                onClick={() => openPlaylistView("favorites")}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                  activeView === "playlist" && selectedPlaylistKey === "favorites"
                    ? "bg-white/[0.14]"
                    : "hover:bg-white/[0.07]"
                }`}
              >
                <div className="w-11 h-11 rounded-md bg-gradient-to-br from-[#ff0033] via-rose-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    Liked Songs
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    Favorites • {favoriteTracks.length} songs
                  </p>
                </div>
              </button>

              {customPlaylists.map((pl) => {
                const count = pl.trackIds.filter((id) => trackMap.has(id)).length;
                const firstThumb =
                  trackMap.get(pl.trackIds[0])?.thumbnail || "/channel_banner.jpg";
                return (
                  <button
                    key={pl.id}
                    onClick={() => openPlaylistView(pl.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                      activeView === "playlist" && selectedPlaylistKey === pl.id
                        ? "bg-white/[0.14]"
                        : "hover:bg-white/[0.07]"
                    }`}
                  >
                    <img
                      src={firstThumb}
                      alt={pl.name}
                      className="w-11 h-11 rounded-md object-cover flex-shrink-0 bg-zinc-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {pl.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        Playlist • {count} tracks
                      </p>
                    </div>
                  </button>
                );
              })}

              <div className="pt-3 pb-1 px-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Channel Playlists ({channelPlaylists.length})
                </p>
              </div>

              {channelPlaylists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => openPlaylistView(pl.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    activeView === "playlist" && selectedPlaylistKey === pl.id
                      ? "bg-white/[0.14]"
                      : "hover:bg-white/[0.07]"
                  }`}
                >
                  <img
                    src={pl.thumbnail}
                    alt={pl.title}
                    className="w-11 h-11 rounded-md object-cover flex-shrink-0 bg-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {pl.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      Official • {pl.tracks.length} tracks
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE WORKSPACE */}
        <main className="flex-1 min-w-0 rounded-none lg:rounded-xl bg-[#121216] relative overflow-y-auto no-scrollbar">
          {/* Dynamic Ambient Gradient Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-80 opacity-30 pointer-events-none transition-all duration-700 blur-3xl"
            style={{
              backgroundImage: currentTrack?.thumbnail
                ? `radial-gradient(circle at 20% 10%, rgba(255, 0, 51, 0.45), transparent 55%), url(${currentTrack.thumbnail})`
                : "radial-gradient(circle at 20% 10%, rgba(255, 0, 51, 0.35), transparent 60%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 p-4 sm:p-6 pb-44 lg:pb-32 max-w-6xl mx-auto space-y-8">
            {loading && (
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-16 rounded-lg bg-white/[0.07]" />
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="aspect-square rounded-xl bg-white/[0.07]" />
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 1: HOME                                                 */}
            {/* ============================================================ */}
            {!loading && activeView === "home" && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Listen on Loop
                    </h1>
                    <button
                      onClick={() =>
                        playCollection(allTracks, 0, "Supasonic Non-Stop Mix", true)
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ff0033] hover:bg-[#d9002b] text-xs font-bold text-white transition-colors"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Shuffle All</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    <div
                      onClick={() => openPlaylistView("favorites")}
                      className="group cursor-pointer rounded-lg bg-white/[0.08] hover:bg-white/[0.15] transition-colors overflow-hidden flex items-center gap-3 pr-2"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#ff0033] via-rose-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          Liked Songs
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {favoriteTracks.length} Favorites
                        </p>
                      </div>
                      {favoriteTracks.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playCollection(favoriteTracks, 0, "Liked Songs");
                          }}
                          aria-label="Play Liked Songs"
                          className="w-9 h-9 rounded-full bg-[#ff0033] text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      )}
                    </div>

                    {customPlaylists.slice(0, 2).map((pl) => {
                      const plTracks = pl.trackIds
                        .map((id) => trackMap.get(id))
                        .filter((t): t is FeedPost => Boolean(t));
                      return (
                        <div
                          key={pl.id}
                          onClick={() => openPlaylistView(pl.id)}
                          className="group cursor-pointer rounded-lg bg-white/[0.08] hover:bg-white/[0.15] transition-colors overflow-hidden flex items-center gap-3 pr-2"
                        >
                          <img
                            src={plTracks[0]?.thumbnail || "/channel_banner.jpg"}
                            alt={pl.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {pl.name}
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              {plTracks.length} tracks
                            </p>
                          </div>
                          {plTracks.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playCollection(plTracks, 0, pl.name);
                              }}
                              aria-label={`Play ${pl.name}`}
                              className="w-9 h-9 rounded-full bg-[#ff0033] text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0"
                            >
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {channelPlaylists
                      .slice(0, Math.max(3, 5 - Math.min(customPlaylists.length, 2)))
                      .map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => openPlaylistView(pl.id)}
                          className="group cursor-pointer rounded-lg bg-white/[0.08] hover:bg-white/[0.15] transition-colors overflow-hidden flex items-center gap-3 pr-2"
                        >
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover flex-shrink-0"
                          />
                          <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2 flex-1">
                            {pl.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playCollection(pl.tracks, 0, pl.title);
                            }}
                            aria-label={`Play ${pl.title}`}
                            className="w-9 h-9 rounded-full bg-[#ff0033] text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0"
                          >
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Official Channel Playlists Grid */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                        Official Channel Playlists
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Live synced from @SupasonicBeatsOfficial — only public songs shown
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView("library")}
                      className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {channelPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => openPlaylistView(pl.id)}
                        className="group cursor-pointer rounded-xl bg-white/[0.04] hover:bg-white/[0.1] p-3 transition-all"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-3 shadow-lg">
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playCollection(pl.tracks, 0, pl.title);
                            }}
                            aria-label={`Play ${pl.title}`}
                            className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#ff0033] hover:bg-[#ff1a47] text-white flex items-center justify-center shadow-xl translate-y-1 opacity-95 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                          {pl.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          {pl.tracks.length} tracks • Loop Ready
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* All Public Releases + Mood / Preset Chips */}
                <section className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      All Public Releases ({filteredCatalogTracks.length})
                    </h2>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                      {genreChips.map((chip) => (
                        <button
                          key={chip.value}
                          onClick={() => setActiveGenreChip(chip.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                            activeGenreChip === chip.value
                              ? "bg-white text-black"
                              : "bg-white/[0.08] text-zinc-300 hover:bg-white/[0.15]"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TrackListTable
                    tracks={filteredCatalogTracks}
                    currentVideoId={currentTrack?.videoId}
                    isPlaying={isPlaying}
                    favoriteIds={favoriteIds}
                    onPlayTrack={(idx) =>
                      playCollection(
                        filteredCatalogTracks,
                        idx,
                        "Supasonic Beats Public Catalog"
                      )
                    }
                    onToggleFavorite={toggleFavorite}
                    onAddToPlaylist={setAddToPlaylistTrack}
                    onDownloadTrack={openDownloadFunnel}
                  />
                </section>
              </>
            )}

            {/* ============================================================ */}
            {/* VIEW 2: SEARCH                                               */}
            {/* ============================================================ */}
            {!loading && activeView === "search" && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 bg-[#222228] rounded-full px-4 h-11 border border-white/10">
                  <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type song name, 124 BPM, Afro House, Phonk..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {filteredChannelPlaylists.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-zinc-200">
                      Matching Playlists
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {filteredChannelPlaylists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => openPlaylistView(pl.id)}
                          className="cursor-pointer rounded-xl bg-white/[0.06] hover:bg-white/[0.12] p-3 transition-colors"
                        >
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="aspect-square w-full rounded-lg object-cover mb-2.5"
                          />
                          <p className="text-xs sm:text-sm font-bold line-clamp-2">
                            {pl.title}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {pl.tracks.length} tracks
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h2 className="text-base font-bold text-zinc-200">
                    Matching Tracks ({filteredCatalogTracks.length})
                  </h2>
                  <TrackListTable
                    tracks={filteredCatalogTracks}
                    currentVideoId={currentTrack?.videoId}
                    isPlaying={isPlaying}
                    favoriteIds={favoriteIds}
                    onPlayTrack={(idx) =>
                      playCollection(
                        filteredCatalogTracks,
                        idx,
                        searchQuery ? `Search: ${searchQuery}` : "Catalog Tracks"
                      )
                    }
                    onToggleFavorite={toggleFavorite}
                    onAddToPlaylist={setAddToPlaylistTrack}
                    onDownloadTrack={openDownloadFunnel}
                  />
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* VIEW 3: LIBRARY                                              */}
            {/* ============================================================ */}
            {!loading && activeView === "library" && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-bold">Your Library</h1>
                  <button
                    onClick={() => {
                      setAddToPlaylistTrack(null);
                      setShowCreateModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Playlist</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div
                    onClick={() => openPlaylistView("favorites")}
                    className="cursor-pointer rounded-xl bg-gradient-to-br from-[#ff0033]/25 via-rose-500/10 to-white/[0.06] border border-white/10 p-4 flex items-center gap-4 hover:border-white/25 transition-all"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#ff0033] via-rose-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-base">Liked Songs</p>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        Pinned Favorites • {favoriteTracks.length} tracks
                      </p>
                    </div>
                  </div>

                  {customPlaylists.map((pl) => {
                    const count = pl.trackIds.filter((id) => trackMap.has(id)).length;
                    const thumb =
                      trackMap.get(pl.trackIds[0])?.thumbnail ||
                      "/channel_banner.jpg";
                    return (
                      <div
                        key={pl.id}
                        onClick={() => openPlaylistView(pl.id)}
                        className="cursor-pointer rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] p-4 flex items-center gap-4 transition-all"
                      >
                        <img
                          src={thumb}
                          alt={pl.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-base truncate">{pl.name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5 truncate">
                            Custom Playlist • {count} tracks
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-lg font-bold">
                    Supasonic Beats Channel Playlists ({channelPlaylists.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {channelPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => openPlaylistView(pl.id)}
                        className="cursor-pointer rounded-xl bg-white/[0.05] hover:bg-white/[0.1] p-3 flex items-center gap-3.5 transition-colors"
                      >
                        <img
                          src={pl.thumbnail}
                          alt={pl.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm line-clamp-2">
                            {pl.title}
                          </p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Official YouTube • {pl.tracks.length} tracks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* VIEW 4: SHARED PLAYLIST VIEW (?share=...)                    */}
            {/* ============================================================ */}
            {!loading && activeView === "shared" && sharedPlaylist && (
              <section className="space-y-6">
                <button
                  onClick={() => setActiveView("home")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Music Home</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-end gap-5 pb-4 border-b border-white/[0.08]">
                  <img
                    src={
                      sharedResolvedTracks[0]?.thumbnail || "/channel_banner.jpg"
                    }
                    alt={sharedPlaylist.n}
                    className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl object-cover shadow-2xl flex-shrink-0 bg-zinc-900"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                      Shared Supasonic Playlist
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      {sharedPlaylist.n}
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-300">
                      {sharedPlaylist.d}
                    </p>
                    <p className="text-xs font-semibold text-zinc-400">
                      {sharedResolvedTracks.length} public tracks
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={sharedResolvedTracks.length === 0}
                    onClick={() =>
                      playCollection(sharedResolvedTracks, 0, sharedPlaylist.n)
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff0033] hover:bg-[#ff1a47] text-white text-sm font-bold shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play on Loop</span>
                  </button>

                  <button
                    onClick={() => {
                      const imported = importSharedPlaylist(
                        sharedPlaylist.n,
                        sharedPlaylist.d,
                        sharedResolvedTracks
                          .map((t) => t.videoId!)
                          .filter(Boolean)
                      );
                      setSharedSavedNotice(true);
                      setSelectedPlaylistKey(imported.id);
                      setActiveView("playlist");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-bold"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>
                      {sharedSavedNotice
                        ? "Saved to Library"
                        : "Save to My Library"}
                    </span>
                  </button>
                </div>

                <TrackListTable
                  tracks={sharedResolvedTracks}
                  currentVideoId={currentTrack?.videoId}
                  isPlaying={isPlaying}
                  favoriteIds={favoriteIds}
                  onPlayTrack={(idx) =>
                    playCollection(sharedResolvedTracks, idx, sharedPlaylist.n)
                  }
                  onToggleFavorite={toggleFavorite}
                  onAddToPlaylist={setAddToPlaylistTrack}
                  onDownloadTrack={openDownloadFunnel}
                />
              </section>
            )}

            {/* ============================================================ */}
            {/* VIEW 5: PLAYLIST DETAIL VIEW (FAVORITES / CUSTOM / CHANNEL)  */}
            {/* ============================================================ */}
            {!loading && activeView === "playlist" && activePlaylistData && (
              <section className="space-y-6">
                <button
                  onClick={() => setActiveView("home")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Music Home</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-end gap-5 pb-4 border-b border-white/[0.08]">
                  {activePlaylistData.kind === "favorites" ? (
                    <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl bg-gradient-to-br from-[#ff0033] via-rose-500 to-purple-600 flex items-center justify-center shadow-2xl flex-shrink-0">
                      <Heart className="w-16 h-16 text-white fill-white" />
                    </div>
                  ) : (
                    <img
                      src={activePlaylistData.cover}
                      alt={activePlaylistData.title}
                      className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl object-cover shadow-2xl flex-shrink-0 bg-zinc-900"
                    />
                  )}

                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#ff0033]">
                      {activePlaylistData.kind === "favorites"
                        ? "Personal Favorites"
                        : activePlaylistData.kind === "custom"
                        ? "Custom User Playlist"
                        : "Official YouTube Channel Playlist"}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                      {activePlaylistData.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
                      {activePlaylistData.subtitle}
                    </p>
                    <p className="text-xs font-semibold text-zinc-400">
                      Supasonic Beats • {activePlaylistData.tracks.length} songs
                    </p>
                  </div>
                </div>

                {/* Playlist Action Bar */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    disabled={activePlaylistData.tracks.length === 0}
                    onClick={() =>
                      playCollection(
                        activePlaylistData.tracks,
                        0,
                        activePlaylistData.title
                      )
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff0033] hover:bg-[#ff1a47] disabled:opacity-40 text-white text-sm font-bold shadow-lg transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play on Loop</span>
                  </button>

                  <button
                    disabled={activePlaylistData.tracks.length === 0}
                    onClick={() =>
                      playCollection(
                        activePlaylistData.tracks,
                        0,
                        activePlaylistData.title,
                        true
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.09] hover:bg-white/[0.16] disabled:opacity-40 text-sm font-semibold transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Shuffle</span>
                  </button>

                  {activePlaylistData.tracks.length > 0 && (
                    <button
                      onClick={() =>
                        handleShareCustomPlaylist(
                          activePlaylistData.key,
                          activePlaylistData.title,
                          activePlaylistData.subtitle,
                          activePlaylistData.tracks
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.09] hover:bg-white/[0.16] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      {copiedShareId === activePlaylistData.key ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Share Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Share Playlist</span>
                        </>
                      )}
                    </button>
                  )}

                  {activePlaylistData.youtubeUrl && (
                    <a
                      href={activePlaylistData.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs sm:text-sm font-semibold text-zinc-200 transition-colors"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {activePlaylistData.kind === "custom" && (
                    <button
                      onClick={() => {
                        deleteCustomPlaylist(activePlaylistData.key);
                        setActiveView("home");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs sm:text-sm font-semibold ml-auto transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Playlist</span>
                    </button>
                  )}
                </div>

                {activePlaylistData.tracks.length === 0 ? (
                  <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 text-center space-y-3">
                    <Music2 className="w-8 h-8 text-zinc-500 mx-auto" />
                    <h3 className="text-base font-bold">
                      This playlist has no songs yet
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                      Go to Home or Search and tap the Heart ❤️ icon for Favorites or + button to add any song here.
                    </p>
                    <button
                      onClick={() => setActiveView("home")}
                      className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200"
                    >
                      Browse All Songs
                    </button>
                  </div>
                ) : (
                  <TrackListTable
                    tracks={activePlaylistData.tracks}
                    currentVideoId={currentTrack?.videoId}
                    isPlaying={isPlaying}
                    favoriteIds={favoriteIds}
                    onPlayTrack={(idx) =>
                      playCollection(
                        activePlaylistData.tracks,
                        idx,
                        activePlaylistData.title
                      )
                    }
                    onToggleFavorite={toggleFavorite}
                    onAddToPlaylist={setAddToPlaylistTrack}
                    onDownloadTrack={openDownloadFunnel}
                    onMoveTrack={
                      activePlaylistData.kind === "custom"
                        ? (idx, dir) =>
                            moveTrackInCustomPlaylist(
                              activePlaylistData.key,
                              idx,
                              dir
                            )
                        : undefined
                    }
                    onRemoveFromPlaylist={
                      activePlaylistData.kind === "custom"
                        ? (vid) =>
                            toggleTrackInCustomPlaylist(
                              activePlaylistData.key,
                              vid
                            )
                        : undefined
                    }
                  />
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {/* ================================================================ */}
      {/* SPOTIFY / YT MUSIC DOCKED BOTTOM PLAYER BAR                      */}
      {/* ================================================================ */}
      <div className="flex-shrink-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/[0.1] z-40 relative">
        {/* Top Seek Line */}
        <div className="px-3 sm:px-4 pt-1">
          <input
            type="range"
            min={0}
            max={duration || 200}
            value={Math.min(currentTime, duration || 200)}
            onChange={(e) => handleSeek(Number(e.target.value))}
            aria-label="Seek track position"
            className="w-full h-1 accent-[#ff0033] cursor-pointer bg-white/20 rounded-full"
          />
        </div>

        <div className="px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
          {/* Left: Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-[30%]">
            {currentTrack ? (
              <>
                <button
                  onClick={() => setExpandedPlayerOpen(true)}
                  className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 group"
                >
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ChevronUp className="w-4 h-4 text-white" />
                  </span>
                </button>
                <div
                  onClick={() => setExpandedPlayerOpen(true)}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentTrack.title.split("|")[0].trim()}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {currentTrack.subgenre} • {currentTrack.bpm} BPM
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(currentTrack.videoId)}
                  aria-label="Favorite current track"
                  className="p-1.5 rounded-full hover:bg-white/[0.08] flex-shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      currentTrack.videoId && favoriteIds.includes(currentTrack.videoId)
                        ? "text-[#ff0033] fill-[#ff0033]"
                        : "text-zinc-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setAddToPlaylistTrack(currentTrack)}
                  aria-label="Add current track to playlist"
                  className="hidden sm:flex p-1.5 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            ) : (
              <p className="text-xs text-zinc-400">Select any track to start playing</p>
            )}
          </div>

          {/* Center: Transport */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShuffleEnabled((s) => !s)}
                title={shuffleEnabled ? "Shuffle On" : "Shuffle Off"}
                className={`hidden sm:flex p-1.5 rounded-full transition-colors ${
                  shuffleEnabled ? "text-[#ff0033]" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevTrack}
                aria-label="Previous track"
                className="p-1.5 rounded-full text-zinc-200 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:scale-105 transition-transform flex items-center justify-center shadow-md"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                aria-label="Next track"
                className="p-1.5 rounded-full text-zinc-200 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={cycleRepeatMode}
                title={
                  repeatMode === "all"
                    ? "Looping Playlist"
                    : repeatMode === "one"
                    ? "Looping Single Track"
                    : "Repeat Off"
                }
                className={`p-1.5 rounded-full transition-colors relative ${
                  repeatMode !== "off"
                    ? "text-[#ff0033]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
                {repeatMode !== "off" && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff0033]" />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-400 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>•</span>
              <span>{formatTime(duration)}</span>
              <span>•</span>
              <span className="text-[#ff0033] font-medium">
                {repeatMode === "all"
                  ? "Loop Playlist"
                  : repeatMode === "one"
                  ? "Loop Track"
                  : "Loop Off"}
              </span>
              {sleepTimerMode !== "off" && (
                <>
                  <span>•</span>
                  <span className="text-amber-300 font-medium">
                    {sleepSecondsLeft !== null
                      ? `Sleep ${formatTime(sleepSecondsLeft)}`
                      : "Sleep Track End"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Sleep Timer, Car Mode, Video Stage, Queue & Volume */}
          <div className="hidden md:flex items-center justify-end gap-1.5 w-[30%]">
            <button
              onClick={() => setShowSleepMenu((s) => !s)}
              title="Sleep Timer"
              className={`p-2 rounded-full transition-colors ${
                sleepTimerMode !== "off"
                  ? "bg-amber-400/15 text-amber-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCarModeOpen(true)}
              title="Car Drive OLED Mode (Keeps Screen Awake)"
              className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <Car className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowVideoStage((v) => !v)}
              title="Toggle Floating Video Preview"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                showVideoStage
                  ? "bg-[#ff0033]/20 text-[#ff0033]"
                  : "bg-white/[0.08] text-zinc-300 hover:text-white"
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>

            <button
              onClick={() => setShowQueueDrawer((q) => !q)}
              title="Queue"
              className={`p-2 rounded-full transition-colors ${
                showQueueDrawer
                  ? "bg-white/[0.15] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ListMusic className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                aria-label="Toggle Mute"
                className="p-1.5 text-zinc-300 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label="Volume"
                className="w-16 h-1 accent-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SLEEP TIMER POPOVER */}
        {showSleepMenu && (
          <div className="absolute bottom-20 right-4 sm:right-24 z-50 w-52 rounded-2xl bg-[#1a1a21] border border-white/15 shadow-2xl p-2 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Sleep Timer</span>
              <button onClick={() => setShowSleepMenu(false)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {sleepOptions.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => {
                  setSleepTimer(opt.mode);
                  setShowSleepMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  sleepTimerMode === opt.mode
                    ? "bg-[#ff0033]/20 text-[#ff0033] font-bold"
                    : "hover:bg-white/10 text-zinc-200"
                }`}
              >
                <span>{opt.label}</span>
                {sleepTimerMode === opt.mode && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        )}

        {/* MOBILE BOTTOM APP TAB BAR (< lg) */}
        <nav className="lg:hidden grid grid-cols-4 border-t border-white/[0.07] bg-black/90 h-12">
          <button
            onClick={() => setActiveView("home")}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
              activeView === "home" ? "text-white font-bold" : "text-zinc-500"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveView("search")}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
              activeView === "search" ? "text-white font-bold" : "text-zinc-500"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setActiveView("library")}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
              activeView === "library" ||
              activeView === "playlist" ||
              activeView === "shared"
                ? "text-white font-bold"
                : "text-zinc-500"
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Playlists</span>
          </button>
          <button
            onClick={() => setExpandedPlayerOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] text-[#ff0033] font-semibold"
          >
            <Radio className="w-4 h-4" />
            <span>Now Playing</span>
          </button>
        </nav>
      </div>

      {/* ================================================================ */}
      {/* FULL-SCREEN NOW PLAYING + LOOP & QUEUE SHEET                     */}
      {/* ================================================================ */}
      {expandedPlayerOpen && currentTrack && (
        <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-35 blur-3xl pointer-events-none"
            style={{
              backgroundImage: `url(${currentTrack.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/[0.08]">
            <button
              onClick={() => setExpandedPlayerOpen(false)}
              className="p-2 -ml-2 rounded-full hover:bg-white/[0.1]"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="text-center min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Playing From Playlist
              </p>
              <p className="text-xs font-semibold text-white truncate max-w-[190px] sm:max-w-sm">
                {queueTitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setExpandedPlayerOpen(false);
                  setCarModeOpen(true);
                }}
                className="px-2.5 py-1 rounded-full bg-white/[0.1] text-xs font-semibold flex items-center gap-1"
              >
                <Car className="w-3.5 h-3.5 text-[#ff0033]" />
                <span>Drive</span>
              </button>
              <button
                onClick={() => setShowSleepMenu((s) => !s)}
                className="p-2 rounded-full bg-white/[0.1]"
                aria-label="Sleep timer"
              >
                <Moon
                  className={`w-3.5 h-3.5 ${
                    sleepTimerMode !== "off" ? "text-amber-300" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl w-full mx-auto">
            <div className="space-y-5 w-full max-w-md mx-auto">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    {currentTrack.title.split("|")[0].trim()}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                    Supasonic Beats • {currentTrack.subgenre} • {currentTrack.bpm} BPM
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleFavorite(currentTrack.videoId)}
                    className="p-2 rounded-full hover:bg-white/[0.1]"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        currentTrack.videoId && favoriteIds.includes(currentTrack.videoId)
                          ? "text-[#ff0033] fill-[#ff0033]"
                          : "text-zinc-300"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setAddToPlaylistTrack(currentTrack)}
                    className="p-2 rounded-full hover:bg-white/[0.1] text-zinc-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 200}
                  value={Math.min(currentTime, duration || 200)}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-1.5 accent-[#ff0033] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-zinc-400 tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setShuffleEnabled((s) => !s)}
                  className={`p-2 rounded-full ${
                    shuffleEnabled ? "text-[#ff0033]" : "text-zinc-400"
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <button onClick={handlePrevTrack} className="p-2 rounded-full text-white">
                  <SkipBack className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  )}
                </button>
                <button onClick={handleNextTrack} className="p-2 rounded-full text-white">
                  <SkipForward className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={cycleRepeatMode}
                  className={`p-2 rounded-full ${
                    repeatMode !== "off" ? "text-[#ff0033]" : "text-zinc-400"
                  }`}
                >
                  {repeatMode === "one" ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 max-h-[420px] flex flex-col">
              <h3 className="text-sm font-bold mb-3 flex items-center justify-between">
                <span>Up Next Queue ({queueTracks.length})</span>
                <span className="text-[11px] font-semibold text-[#ff0033]">
                  {repeatMode === "all"
                    ? "Auto-Looping Playlist"
                    : repeatMode === "one"
                    ? "Repeating Track"
                    : "Single Pass"}
                </span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
                {queueTracks.map((qt, idx) => {
                  const active = idx === currentTrackIndex;
                  return (
                    <button
                      key={`${qt.id}-${idx}`}
                      onClick={() => playCollection(queueTracks, idx, queueTitle)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        active ? "bg-white/[0.15]" : "hover:bg-white/[0.07]"
                      }`}
                    >
                      <img
                        src={qt.thumbnail}
                        alt={qt.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-bold truncate ${
                            active ? "text-[#ff0033]" : "text-white"
                          }`}
                        >
                          {qt.title.split("|")[0].trim()}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {qt.subgenre} • {qt.bpm} BPM
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* DESKTOP QUEUE POPOVER DRAWER                                     */}
      {/* ================================================================ */}
      {showQueueDrawer && !expandedPlayerOpen && (
        <div className="fixed bottom-24 right-4 z-40 w-80 max-h-96 rounded-2xl bg-[#18181d] border border-white/15 shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Up Next ({queueTracks.length})</h3>
            <button
              onClick={() => setShowQueueDrawer(false)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
            {queueTracks.map((qt, idx) => {
              const active = idx === currentTrackIndex;
              return (
                <button
                  key={`drawer-${qt.id}-${idx}`}
                  onClick={() => playCollection(queueTracks, idx, queueTitle)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left ${
                    active ? "bg-white/[0.15]" : "hover:bg-white/[0.08]"
                  }`}
                >
                  <img
                    src={qt.thumbnail}
                    alt={qt.title}
                    className="w-9 h-9 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate ${
                        active ? "text-[#ff0033]" : "text-white"
                      }`}
                    >
                      {qt.title.split("|")[0].trim()}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{qt.bpm} BPM</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* CREATE PLAYLIST MODAL                                            */}
      {/* ================================================================ */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreatePlaylist}
            className="w-full max-w-md rounded-2xl bg-[#1a1a20] border border-white/15 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Create Custom Playlist</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g., Night Highway Loop, Gym Sub-Bass"
                  className="w-full rounded-lg bg-[#272730] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Vibe / Notes (optional)
                </label>
                <input
                  type="text"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="124 BPM late-night driving vibes"
                  className="w-full rounded-lg bg-[#272730] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#ff0033] hover:bg-[#ff1a47] text-white text-xs font-bold"
              >
                Create Playlist
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================================ */}
      {/* ADD TO PLAYLIST MODAL                                            */}
      {/* ================================================================ */}
      {addToPlaylistTrack && !showCreateModal && (
        <div
          onClick={() => setAddToPlaylistTrack(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#1a1a20] border border-white/15 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-bold">Save to Playlist</h2>
                <p className="text-xs text-zinc-400 truncate">
                  {addToPlaylistTrack.title.split("|")[0].trim()}
                </p>
              </div>
              <button
                onClick={() => setAddToPlaylistTrack(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
              <button
                onClick={() => toggleFavorite(addToPlaylistTrack.videoId)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Heart className="w-4 h-4 text-[#ff0033] fill-[#ff0033]" />
                  <span>Liked Songs (Favorites)</span>
                </span>
                {addToPlaylistTrack.videoId &&
                  favoriteIds.includes(addToPlaylistTrack.videoId) && (
                    <Check className="w-4 h-4 text-[#ff0033]" />
                  )}
              </button>

              {customPlaylists.map((pl) => {
                const inList = Boolean(
                  addToPlaylistTrack.videoId &&
                    pl.trackIds.includes(addToPlaylistTrack.videoId)
                );
                return (
                  <button
                    key={pl.id}
                    onClick={() =>
                      toggleTrackInCustomPlaylist(pl.id, addToPlaylistTrack.videoId)
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] transition-colors"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium truncate">
                      <ListMusic className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                      <span className="truncate">{pl.name}</span>
                    </span>
                    {inList && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Playlist with This Track</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBSCRIBE TO UNLOCK DOWNLOAD MODAL */}
      {unlockModal && (
        <SubscribeUnlockModal
          isOpen={unlockModal.isOpen}
          trackTitle={unlockModal.trackTitle}
          formatLabel={unlockModal.formatLabel}
          downloadUrl={unlockModal.downloadUrl}
          filename={unlockModal.filename}
          onClose={() => setUnlockModal(null)}
        />
      )}
    </div>
  );
}

/* ============================================================================
   REUSABLE SPOTIFY / YT MUSIC TRACKLIST TABLE WITH MP3/WAV + REORDER MENU
   ============================================================================ */
function TrackListTable({
  tracks,
  currentVideoId,
  isPlaying,
  favoriteIds,
  onPlayTrack,
  onToggleFavorite,
  onAddToPlaylist,
  onDownloadTrack,
  onMoveTrack,
  onRemoveFromPlaylist,
}: {
  tracks: FeedPost[];
  currentVideoId?: string;
  isPlaying: boolean;
  favoriteIds: string[];
  onPlayTrack: (index: number) => void;
  onToggleFavorite: (videoId?: string) => void;
  onAddToPlaylist: (track: FeedPost) => void;
  onDownloadTrack: (track: FeedPost, format: "mp3" | "wav") => void;
  onMoveTrack?: (index: number, direction: "up" | "down") => void;
  onRemoveFromPlaylist?: (videoId?: string) => void;
}) {
  const [menuOpenKey, setMenuOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {tracks.map((track, idx) => {
        const key = `${track.id}-${idx}`;
        const isCurrent = Boolean(track.videoId && track.videoId === currentVideoId);
        const isFav = Boolean(track.videoId && favoriteIds.includes(track.videoId));
        const menuOpen = menuOpenKey === key;

        return (
          <div
            key={key}
            onClick={() => onPlayTrack(idx)}
            className={`group relative cursor-pointer flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors ${
              isCurrent ? "bg-white/[0.14]" : "hover:bg-white/[0.08]"
            }`}
          >
            <div className="w-6 text-center text-xs font-semibold text-zinc-400 flex-shrink-0">
              {isCurrent && isPlaying ? (
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff0033] animate-pulse" />
              ) : (
                <span className="group-hover:hidden">{idx + 1}</span>
              )}
              {!(isCurrent && isPlaying) && (
                <Play className="w-3.5 h-3.5 fill-current text-white hidden group-hover:inline-block mx-auto" />
              )}
            </div>

            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-11 h-11 rounded-md object-cover flex-shrink-0 bg-zinc-900"
              loading="lazy"
            />

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold truncate ${
                  isCurrent ? "text-[#ff0033]" : "text-white"
                }`}
              >
                {track.title.split("|")[0].trim()}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {track.subgenre} • {track.bpm} BPM • {track.key}
              </p>
            </div>

            <span className="hidden sm:inline-block text-xs text-zinc-400 tabular-nums mr-1">
              {track.duration}
            </span>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0"
            >
              {onMoveTrack && (
                <div className="hidden sm:flex items-center">
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveTrack(idx, "up")}
                    aria-label="Move track up"
                    className="p-1.5 rounded-full hover:bg-white/[0.1] disabled:opacity-25 text-zinc-400 hover:text-white"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === tracks.length - 1}
                    onClick={() => onMoveTrack(idx, "down")}
                    aria-label="Move track down"
                    className="p-1.5 rounded-full hover:bg-white/[0.1] disabled:opacity-25 text-zinc-400 hover:text-white"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={() => onToggleFavorite(track.videoId)}
                aria-label="Toggle favorite"
                className="p-2 rounded-full hover:bg-white/[0.1] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFav ? "text-[#ff0033] fill-[#ff0033]" : "text-zinc-400"
                  }`}
                />
              </button>

              <button
                onClick={() => onAddToPlaylist(track)}
                aria-label="Add to playlist"
                className="p-2 rounded-full hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>

              {onRemoveFromPlaylist && (
                <button
                  onClick={() => onRemoveFromPlaylist(track.videoId)}
                  aria-label="Remove from playlist"
                  className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Context Menu (...) for Download & Watch Video Funnel */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpenKey(menuOpen ? null : key)}
                  aria-label="Track actions"
                  className="p-2 rounded-full hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-9 z-40 w-52 rounded-xl bg-[#1f1f27] border border-white/15 shadow-2xl p-1.5 space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        setMenuOpenKey(null);
                        onDownloadTrack(track, "mp3");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Download 320k MP3</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpenKey(null);
                        onDownloadTrack(track, "wav");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left font-medium text-[#ff0033]"
                    >
                      <FileAudio className="w-3.5 h-3.5" />
                      <span>Download Studio WAV</span>
                    </button>
                    {track.videoId && (
                      <Link
                        href={`/watch/${track.videoId}`}
                        onClick={() => setMenuOpenKey(null)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left font-medium"
                      >
                        <Youtube className="w-3.5 h-3.5 text-zinc-300" />
                        <span>Watch Full Video</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
