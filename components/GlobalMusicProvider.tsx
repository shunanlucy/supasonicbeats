"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeedPost } from "@/lib/feedEngine";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
  X,
  ChevronDown,
  Car,
  Moon,
  ExternalLink,
  Disc3,
} from "lucide-react";

export interface UserPlaylist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
  createdAt: string;
}

export type RepeatMode = "all" | "one" | "off";
export type SleepTimerMode = "off" | "15" | "30" | "60" | "track_end";

const FAVORITES_STORAGE_KEY = "supasonic_music_favorites_v1";
const PLAYLISTS_STORAGE_KEY = "supasonic_music_playlists_v1";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface GlobalMusicContextValue {
  queueTracks: FeedPost[];
  queueTitle: string;
  currentTrackIndex: number;
  currentTrack: FeedPost | null;
  isPlaying: boolean;
  hasStartedSession: boolean;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  favoriteIds: string[];
  customPlaylists: UserPlaylist[];
  showVideoStage: boolean;
  carModeOpen: boolean;
  sleepTimerMode: SleepTimerMode;
  sleepSecondsLeft: number | null;
  setShowVideoStage: React.Dispatch<React.SetStateAction<boolean>>;
  setCarModeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShuffleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setSleepTimer: (mode: SleepTimerMode) => void;
  cycleRepeatMode: () => void;
  playCollection: (
    tracks: FeedPost[],
    startIndex: number,
    title: string,
    useShuffle?: boolean
  ) => void;
  seedInitialQueue: (tracks: FeedPost[], title: string) => void;
  togglePlayPause: () => void;
  handleNextTrack: () => void;
  handlePrevTrack: () => void;
  handleSeek: (seconds: number) => void;
  handleVolumeChange: (val: number) => void;
  toggleMute: () => void;
  stopPlayback: () => void;
  toggleFavorite: (videoId?: string) => void;
  createCustomPlaylist: (
    name: string,
    description: string,
    initialTrackId?: string
  ) => UserPlaylist;
  toggleTrackInCustomPlaylist: (playlistId: string, videoId?: string) => void;
  moveTrackInCustomPlaylist: (
    playlistId: string,
    fromIndex: number,
    direction: "up" | "down"
  ) => void;
  deleteCustomPlaylist: (playlistId: string) => void;
  importSharedPlaylist: (name: string, description: string, trackIds: string[]) => UserPlaylist;
}

const GlobalMusicContext = createContext<GlobalMusicContextValue | null>(null);

export function useGlobalMusic() {
  const ctx = useContext(GlobalMusicContext);
  if (!ctx) {
    throw new Error("useGlobalMusic must be used inside GlobalMusicProvider");
  }
  return ctx;
}

export default function GlobalMusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMusicRoute = pathname === "/music";
  const isStudioRoute = pathname === "/studio";

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<UserPlaylist[]>([]);
  const [hydratedStorage, setHydratedStorage] = useState(false);

  const [queueTracks, setQueueTracks] = useState<FeedPost[]>([]);
  const [queueTitle, setQueueTitle] = useState<string>("Supasonic Beats Radio");
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoStage, setShowVideoStage] = useState(false);
  const [carModeOpen, setCarModeOpen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Sleep Timer state
  const [sleepTimerMode, setSleepTimerMode] = useState<SleepTimerMode>("off");
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);

  const playerRef = useRef<any>(null);
  const playerReadyRef = useRef(false);
  const ytContainerId = "supasonic-global-yt-engine";

  const queueRef = useRef<FeedPost[]>([]);
  const indexRef = useRef<number>(0);
  const repeatRef = useRef<RepeatMode>("all");
  const shuffleRef = useRef<boolean>(false);
  const sleepModeRef = useRef<SleepTimerMode>("off");

  useEffect(() => {
    queueRef.current = queueTracks;
  }, [queueTracks]);

  useEffect(() => {
    indexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    repeatRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    shuffleRef.current = shuffleEnabled;
  }, [shuffleEnabled]);

  useEffect(() => {
    sleepModeRef.current = sleepTimerMode;
  }, [sleepTimerMode]);

  const currentTrack = queueTracks[currentTrackIndex] || null;

  // Hydrate favorites & custom playlists from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavoriteIds(parsed);
      }
      const savedPl = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (savedPl) {
        const parsed = JSON.parse(savedPl);
        if (Array.isArray(parsed)) setCustomPlaylists(parsed);
      }
    } catch {
      // Ignore storage error
    } finally {
      setHydratedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hydratedStorage) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds, hydratedStorage]);

  useEffect(() => {
    if (!hydratedStorage) return;
    try {
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists));
    } catch {}
  }, [customPlaylists, hydratedStorage]);

  const playTrackInPlayer = useCallback((videoId: string) => {
    setHasStartedSession(true);
    if (playerRef.current && playerReadyRef.current) {
      try {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.error("Global YT load error:", e);
      }
    }
  }, []);

  const handleNextTrack = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    const currentIdx = indexRef.current;
    let nextIdx = currentIdx + 1;

    if (shuffleRef.current && q.length > 1) {
      let randIdx = Math.floor(Math.random() * q.length);
      if (randIdx === currentIdx) randIdx = (currentIdx + 1) % q.length;
      nextIdx = randIdx;
    } else if (nextIdx >= q.length) {
      if (repeatRef.current === "all") {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentTrackIndex(nextIdx);
    const nextTrack = q[nextIdx];
    if (nextTrack?.videoId) {
      playTrackInPlayer(nextTrack.videoId);
    }
  }, [playTrackInPlayer]);

  const handlePrevTrack = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    if (playerRef.current && playerReadyRef.current) {
      try {
        const cur = playerRef.current.getCurrentTime?.() || 0;
        if (cur > 4) {
          playerRef.current.seekTo(0, true);
          return;
        }
      } catch {}
    }

    const currentIdx = indexRef.current;
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : q.length - 1;
    setCurrentTrackIndex(prevIdx);
    const prevTrack = q[prevIdx];
    if (prevTrack?.videoId) {
      playTrackInPlayer(prevTrack.videoId);
    }
  }, [playTrackInPlayer]);

  // Mount global YT.Player once across entire app
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initPlayer = () => {
      if (playerRef.current || !document.getElementById(ytContainerId)) return;
      const initialVideoId = queueRef.current[0]?.videoId || "UzLfMApeA-4";

      playerRef.current = new window.YT.Player(ytContainerId, {
        height: "100%",
        width: "100%",
        videoId: initialVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (e: any) => {
            playerReadyRef.current = true;
            try {
              e.target.setVolume(volume);
            } catch {}
          },
          onStateChange: (event: any) => {
            const YTState = window.YT?.PlayerState;
            if (!YTState) return;
            if (event.data === YTState.PLAYING) {
              setIsPlaying(true);
              try {
                const dur = event.target.getDuration?.() || 0;
                if (dur > 0) setDuration(dur);
              } catch {}
            } else if (event.data === YTState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === YTState.ENDED) {
              if (sleepModeRef.current === "track_end") {
                setSleepTimerMode("off");
                setSleepSecondsLeft(null);
                setIsPlaying(false);
                return;
              }
              if (repeatRef.current === "one") {
                try {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } catch {}
              } else {
                handleNextTrack();
              }
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }
  }, [handleNextTrack, volume]);

  // Smooth progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying || !playerRef.current || !playerReadyRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime?.() || 0;
        const dur = playerRef.current.getDuration?.() || 0;
        setCurrentTime(cur);
        if (dur > 0) setDuration(dur);
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepSecondsLeft === null) return;
    if (sleepSecondsLeft <= 0) {
      try {
        playerRef.current?.pauseVideo?.();
      } catch {}
      setIsPlaying(false);
      setSleepTimerMode("off");
      setSleepSecondsLeft(null);
      return;
    }

    const timer = setTimeout(() => {
      setSleepSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [sleepSecondsLeft]);

  const setSleepTimer = useCallback((mode: SleepTimerMode) => {
    setSleepTimerMode(mode);
    if (mode === "15") setSleepSecondsLeft(15 * 60);
    else if (mode === "30") setSleepSecondsLeft(30 * 60);
    else if (mode === "60") setSleepSecondsLeft(60 * 60);
    else setSleepSecondsLeft(null);
  }, []);

  // WakeLock API when Car Drive Dashboard Mode is open
  useEffect(() => {
    if (!carModeOpen || typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      setWakeLockActive(false);
      return;
    }

    let sentinel: any = null;
    let cancelled = false;

    async function acquireWakeLock() {
      try {
        sentinel = await (navigator as any).wakeLock.request("screen");
        if (!cancelled) setWakeLockActive(true);
      } catch {
        if (!cancelled) setWakeLockActive(false);
      }
    }

    acquireWakeLock();
    const handleVis = () => {
      if (document.visibilityState === "visible" && carModeOpen) {
        acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVis);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVis);
      if (sentinel) {
        try {
          sentinel.release();
        } catch {}
      }
      setWakeLockActive(false);
    };
  }, [carModeOpen]);

  // Media Session API for Bluetooth, Car Stereos & Media Keys
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !currentTrack)
      return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title.split("|")[0].trim(),
        artist: "Supasonic Beats",
        album: queueTitle,
        artwork: [
          {
            src:
              currentTrack.thumbnail ||
              `https://i.ytimg.com/vi/${currentTrack.videoId}/hqdefault.jpg`,
            sizes: "480x360",
            type: "image/jpeg",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("play", () => {
        playerRef.current?.playVideo?.();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        playerRef.current?.pauseVideo?.();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler("nexttrack", handleNextTrack);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrevTrack);
    } catch {}
  }, [currentTrack, queueTitle, handleNextTrack, handlePrevTrack]);

  // If user watches a track cleanly inside /watch/[id], auto-pause background music so audio never clashes
  useEffect(() => {
    if (pathname?.startsWith("/watch/") && isPlaying) {
      try {
        playerRef.current?.pauseVideo?.();
        setIsPlaying(false);
      } catch {}
    }
  }, [pathname, isPlaying]);

  const seedInitialQueue = useCallback(
    (tracks: FeedPost[], title: string) => {
      if (queueRef.current.length === 0 && tracks.length > 0) {
        setQueueTracks(tracks);
        setQueueTitle(title);
        setCurrentTrackIndex(0);
      }
    },
    []
  );

  const playCollection = useCallback(
    (
      tracks: FeedPost[],
      startIndex: number,
      title: string,
      useShuffle = false
    ) => {
      const valid = tracks.filter((t) => Boolean(t.videoId));
      if (valid.length === 0) return;

      const idx = useShuffle
        ? Math.floor(Math.random() * valid.length)
        : Math.max(0, Math.min(startIndex, valid.length - 1));

      setShuffleEnabled(useShuffle);
      setQueueTracks(valid);
      setQueueTitle(title);
      setCurrentTrackIndex(idx);
      setCurrentTime(0);

      const target = valid[idx];
      if (target?.videoId) {
        playTrackInPlayer(target.videoId);
      }
    },
    [playTrackInPlayer]
  );

  const togglePlayPause = useCallback(() => {
    if (!currentTrack?.videoId || !playerRef.current || !playerReadyRef.current)
      return;
    setHasStartedSession(true);
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        const loadedData = playerRef.current.getVideoData?.();
        if (loadedData?.video_id && loadedData.video_id !== currentTrack.videoId) {
          playerRef.current.loadVideoById(currentTrack.videoId);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {}
  }, [currentTrack, isPlaying]);

  const stopPlayback = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch {}
    setIsPlaying(false);
    setHasStartedSession(false);
    setShowVideoStage(false);
    setCarModeOpen(false);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current && playerReadyRef.current) {
      try {
        playerRef.current.seekTo(seconds, true);
      } catch {}
    }
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    setIsMuted(val === 0);
    if (playerRef.current && playerReadyRef.current) {
      try {
        if (val === 0) playerRef.current.mute();
        else {
          playerRef.current.unMute();
          playerRef.current.setVolume(val);
        }
      } catch {}
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (playerRef.current && playerReadyRef.current) {
        try {
          if (next) playerRef.current.mute();
          else {
            playerRef.current.unMute();
            playerRef.current.setVolume(volume || 80);
          }
        } catch {}
      }
      return next;
    });
  }, [volume]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) =>
      prev === "all" ? "one" : prev === "one" ? "off" : "all"
    );
  }, []);

  const toggleFavorite = useCallback((videoId?: string) => {
    if (!videoId) return;
    setFavoriteIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [videoId, ...prev]
    );
  }, []);

  const createCustomPlaylist = useCallback(
    (name: string, description: string, initialTrackId?: string): UserPlaylist => {
      const created: UserPlaylist = {
        id: `custom:${Date.now()}`,
        name: name.trim(),
        description: description.trim() || "Personal Supasonic Loop Mix",
        trackIds: initialTrackId ? [initialTrackId] : [],
        createdAt: new Date().toISOString(),
      };
      setCustomPlaylists((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const toggleTrackInCustomPlaylist = useCallback(
    (playlistId: string, videoId?: string) => {
      if (!videoId) return;
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id !== playlistId) return pl;
          const exists = pl.trackIds.includes(videoId);
          return {
            ...pl,
            trackIds: exists
              ? pl.trackIds.filter((id) => id !== videoId)
              : [...pl.trackIds, videoId],
          };
        })
      );
    },
    []
  );

  const moveTrackInCustomPlaylist = useCallback(
    (playlistId: string, fromIndex: number, direction: "up" | "down") => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id !== playlistId) return pl;
          const targetIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
          if (targetIndex < 0 || targetIndex >= pl.trackIds.length) return pl;
          const nextIds = [...pl.trackIds];
          const [moved] = nextIds.splice(fromIndex, 1);
          nextIds.splice(targetIndex, 0, moved);
          return { ...pl, trackIds: nextIds };
        })
      );
    },
    []
  );

  const deleteCustomPlaylist = useCallback((playlistId: string) => {
    setCustomPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  }, []);

  const importSharedPlaylist = useCallback(
    (name: string, description: string, trackIds: string[]): UserPlaylist => {
      const created: UserPlaylist = {
        id: `custom:${Date.now()}`,
        name: name.trim() || "Shared Supasonic Mix",
        description: description.trim() || "Imported via Share Link",
        trackIds: Array.from(new Set(trackIds)),
        createdAt: new Date().toISOString(),
      };
      setCustomPlaylists((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const value = useMemo<GlobalMusicContextValue>(
    () => ({
      queueTracks,
      queueTitle,
      currentTrackIndex,
      currentTrack,
      isPlaying,
      hasStartedSession,
      repeatMode,
      shuffleEnabled,
      currentTime,
      duration,
      volume,
      isMuted,
      favoriteIds,
      customPlaylists,
      showVideoStage,
      carModeOpen,
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
      stopPlayback,
      toggleFavorite,
      createCustomPlaylist,
      toggleTrackInCustomPlaylist,
      moveTrackInCustomPlaylist,
      deleteCustomPlaylist,
      importSharedPlaylist,
    }),
    [
      queueTracks,
      queueTitle,
      currentTrackIndex,
      currentTrack,
      isPlaying,
      hasStartedSession,
      repeatMode,
      shuffleEnabled,
      currentTime,
      duration,
      volume,
      isMuted,
      favoriteIds,
      customPlaylists,
      showVideoStage,
      carModeOpen,
      sleepTimerMode,
      sleepSecondsLeft,
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
      stopPlayback,
      toggleFavorite,
      createCustomPlaylist,
      toggleTrackInCustomPlaylist,
      moveTrackInCustomPlaylist,
      deleteCustomPlaylist,
      importSharedPlaylist,
    ]
  );

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <GlobalMusicContext.Provider value={value}>
      {children}

      {/* ALWAYS-MOUNTED PERSISTENT YOUTUBE AUDIO ENGINE */}
      <div
        className={
          showVideoStage && isMusicRoute
            ? "fixed bottom-28 sm:bottom-24 right-3 sm:right-5 z-40 w-64 sm:w-80 aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black"
            : "fixed bottom-0 right-0 w-px h-px opacity-[0.01] pointer-events-none overflow-hidden"
        }
      >
        <div id={ytContainerId} className="w-full h-full" />
        {showVideoStage && isMusicRoute && (
          <button
            onClick={() => setShowVideoStage(false)}
            aria-label="Minimize video to background audio"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CROSS-ROUTE FLOATING MINI PLAYER (Visible on Home / Watch while playing from /music) */}
      {!isMusicRoute && !isStudioRoute && hasStartedSession && currentTrack && (
        <div className="fixed bottom-16 lg:bottom-4 right-3 left-3 sm:left-auto sm:w-[400px] z-40 rounded-2xl bg-[#0f0f13]/95 text-white backdrop-blur-xl border border-white/15 shadow-2xl p-2.5 flex items-center gap-3">
          <Link
            href="/music"
            className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0"
          >
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </Link>

          <Link href="/music" className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {currentTrack.title.split("|")[0].trim()}
            </p>
            <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff0033] animate-pulse" />
              <span>{queueTitle}</span>
            </p>
          </Link>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toggleFavorite(currentTrack.videoId)}
              aria-label="Favorite"
              className="p-1.5 rounded-full hover:bg-white/10"
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
              onClick={handlePrevTrack}
              aria-label="Previous track"
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-200"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-8 h-8 rounded-full bg-[#ff0033] text-white flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNextTrack}
              aria-label="Next track"
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-200"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
            <Link
              href="/music"
              aria-label="Open Music Player"
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={stopPlayback}
              aria-label="Stop and close mini player"
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* OLED CAR DRIVE DASHBOARD MODE (WakeLock Screen-Keep-Awake)       */}
      {/* ================================================================ */}
      {carModeOpen && currentTrack && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-5 sm:p-8 select-none">
          {/* Top Car HUD Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#ff0033]/20 text-[#ff0033] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff0033]">
                  Drive Mode {wakeLockActive ? "• Screen Awake" : ""}
                </p>
                <p className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-md">
                  {queueTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sleepTimerMode !== "off" && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold flex items-center gap-1.5 text-amber-300">
                  <Moon className="w-3.5 h-3.5" />
                  <span>
                    {sleepSecondsLeft !== null
                      ? formatTimer(sleepSecondsLeft)
                      : "End of track"}
                  </span>
                </span>
              )}
              <button
                onClick={() => setCarModeOpen(false)}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-xs sm:text-sm font-bold flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Exit Drive</span>
              </button>
            </div>
          </div>

          {/* Center Giant Touch-Friendly Art & Song Details */}
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full gap-6 py-4">
            <div className="w-44 h-44 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 w-full">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight line-clamp-2">
                {currentTrack.title.split("|")[0].trim()}
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Supasonic Beats • {currentTrack.subgenre} • {currentTrack.bpm} BPM •{" "}
                {currentTrack.key}
              </p>
            </div>

            {/* Scrubber */}
            <div className="w-full space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 200}
                value={Math.min(currentTime, duration || 200)}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2 accent-[#ff0033] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-semibold tabular-nums">
                <span>{formatTimer(Math.floor(currentTime))}</span>
                <span>{formatTimer(Math.floor(duration))}</span>
              </div>
            </div>
          </div>

          {/* Bottom Oversized Safe Touch Controls for Car / Night Use */}
          <div className="max-w-lg mx-auto w-full flex items-center justify-between gap-3 pb-2">
            <button
              onClick={() => toggleFavorite(currentTrack.videoId)}
              aria-label="Favorite"
              className="w-14 h-14 rounded-2xl bg-white/[0.08] active:scale-95 flex items-center justify-center"
            >
              <Heart
                className={`w-6 h-6 ${
                  currentTrack.videoId && favoriteIds.includes(currentTrack.videoId)
                    ? "text-[#ff0033] fill-[#ff0033]"
                    : "text-zinc-300"
                }`}
              />
            </button>

            <button
              onClick={handlePrevTrack}
              aria-label="Previous"
              className="w-16 h-16 rounded-2xl bg-white/[0.1] active:scale-95 flex items-center justify-center"
            >
              <SkipBack className="w-8 h-8 fill-current" />
            </button>

            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-24 h-20 rounded-3xl bg-[#ff0033] text-white active:scale-95 flex items-center justify-center shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 fill-current" />
              ) : (
                <Play className="w-10 h-10 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              aria-label="Next"
              className="w-16 h-16 rounded-2xl bg-white/[0.1] active:scale-95 flex items-center justify-center"
            >
              <SkipForward className="w-8 h-8 fill-current" />
            </button>

            <button
              onClick={cycleRepeatMode}
              aria-label="Loop Mode"
              className={`w-14 h-14 rounded-2xl bg-white/[0.08] active:scale-95 flex items-center justify-center ${
                repeatMode !== "off" ? "text-[#ff0033]" : "text-zinc-400"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-6 h-6" />
              ) : (
                <Repeat className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      )}
    </GlobalMusicContext.Provider>
  );
}
