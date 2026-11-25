"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Share2,
  Check,
  Disc,
  FileAudio,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Bell,
  ThumbsUp,
} from "lucide-react";
import SubscribeAdPoster from "@/components/SubscribeAdPoster";
import SocialLinksIsland from "@/components/SocialLinksIsland";
import GoogleStyleAdBanner from "@/components/GoogleStyleAdBanner";
import SubscribeUnlockModal from "@/components/SubscribeUnlockModal";

interface WatchTrack {
  id: string;
  type?: string;
  videoId: string;
  title: string;
  subgenre: string;
  bpm: number;
  key: string;
  mood: string;
  publishedAt: string;
  formattedDate: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  thumbnail: string;
  audioUrl?: string;
  wavDownloadUrl?: string;
  mp3DownloadUrl?: string;
  coverDownloadUrl?: string;
  youtubeUrl?: string;
  caption: string;
  seoData?: {
    titles: Array<{ type: string; title: string; charCount: number; advantage: string }>;
    tagsString: string;
    tagList: string[];
    totalTagChars: number;
    descriptionTemplate: string;
  };
}

export default function WatchPage() {
  const params = useParams();
  const idParam = params?.id as string;

  const [currentTrack, setCurrentTrack] = useState<WatchTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [ourRecommendations, setOurRecommendations] = useState<WatchTrack[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    trackTitle: string;
    formatLabel: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    if (!idParam) return;
    setLoading(true);
    fetch(`/api/watch/${idParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.track) {
          setCurrentTrack(data.track);
          setLikesCount(data.track.likes || 480);
          setOurRecommendations(data.ourRecommendations || []);
        }
      })
      .catch((e) => console.error("Error loading watch track:", e))
      .finally(() => setLoading(false));
  }, [idParam]);

  const openDownloadFunnel = (type: "mp3" | "wav") => {
    if (!currentTrack) return;
    const cleanName = currentTrack.title.split("|")[0].trim().replace(/[^a-zA-Z0-9]/g, "_");
    setUnlockModal({
      isOpen: true,
      trackTitle: currentTrack.title.split("|")[0].trim(),
      formatLabel: type === "wav" ? "Studio 48kHz Master WAV" : "320 kbps Stereo MP3",
      downloadUrl:
        (type === "wav" ? currentTrack.wavDownloadUrl : currentTrack.mp3DownloadUrl) ||
        currentTrack.audioUrl ||
        "/audio/clover_clip.mp3",
      filename: `${cleanName}_${type === "wav" ? "StudioMaster.wav" : "320kbps.mp3"}`,
    });
  };

  const handleCopyLink = () => {
    if (!currentTrack) return;
    const url = typeof window !== "undefined" ? window.location.href : currentTrack.youtubeUrl || "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTags = () => {
    if (!currentTrack?.seoData?.tagsString) return;
    navigator.clipboard.writeText(currentTrack.seoData.tagsString);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  if (loading && !currentTrack) {
    return (
      <div className="min-h-screen water-ambient-bg text-slate-700 flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#ff3b30] animate-spin" />
        <p className="mt-3 text-xs font-medium tracking-wider text-slate-500 uppercase">
          Loading Track
        </p>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="min-h-screen water-ambient-bg text-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-[#ff3b30]">Track Not Found</h2>
        <p className="text-slate-600 text-xs mb-5">
          The release you requested is not in the catalog.
        </p>
        <Link href="/" className="px-5 py-2.5 rounded-full liquid-btn-red font-semibold text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": ["VideoObject", "MusicRecording"],
    name: currentTrack.title,
    description:
      currentTrack.caption ||
      `${currentTrack.title} produced by SUPASONIC BEATS.`,
    thumbnailUrl: [currentTrack.thumbnail],
    uploadDate: currentTrack.publishedAt,
    duration: "PT3M24S",
    embedUrl: `https://www.youtube.com/embed/${currentTrack.videoId}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: currentTrack.views,
    },
    byArtist: {
      "@type": "MusicGroup",
      name: "SUPASONIC BEATS",
      url: "https://supasonicbeats.vercel.app",
    },
    inLanguage: "hi",
    isFamilyFriendly: true,
  };

  return (
    <div className="min-h-screen water-ambient-bg text-[#0b0f19] relative overflow-x-hidden flex flex-col selection:bg-[#ff3b30] selection:text-white">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute -top-36 -left-32 w-[30rem] h-[30rem] rounded-full bg-sky-200/40 blur-[120px] animate-water-pulse" />
        <div className="absolute top-1/3 -right-32 w-[34rem] h-[34rem] rounded-full bg-blue-100/45 blur-[130px] animate-water-pulse [animation-delay:4s]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      {/* Sticky Liquid Glass Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-pill text-[#0b0f19] text-xs font-semibold flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Catalog</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl liquid-btn-red flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              </div>
              <span className="text-sm font-bold text-[#0b0f19] tracking-tight hidden sm:inline truncate">
                SUPASONIC BEATS
              </span>
            </Link>
          </div>

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

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Primary Cinema Column */}
          <section aria-label="Player and Track Info" className="lg:col-span-8 space-y-5">
            <div className="p-2 rounded-[26px] liquid-glass">
              <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-slate-950 shadow-sm">
                <iframe
                  src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${currentTrack.title} - SUPASONIC BEATS`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0b0f19] tracking-tight leading-snug">
                {currentTrack.title}
              </h1>

              {/* Channel Attribution + Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/80">
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0"
                  >
                    <img
                      src="/channel_avatar.jpg"
                      alt="SUPASONIC BEATS"
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div>
                    <div className="flex items-center gap-1">
                      <Link href="/" className="text-sm font-bold text-[#0b0f19]">
                        SUPASONIC BEATS
                      </Link>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div className="text-xs text-slate-500">
                      141+ subscribers · 59K+ views
                    </div>
                  </div>

                  <a
                    href="https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-4 py-2 rounded-full liquid-btn-red text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Subscribe</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={toggleLike}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      liked ? "liquid-btn-red" : "liquid-pill text-slate-800"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
                    <span>{likesCount.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 rounded-full liquid-pill text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedLink ? "Copied" : "Share"}</span>
                  </button>

                  <button
                    onClick={() => openDownloadFunnel("mp3")}
                    className="px-3.5 py-1.5 rounded-full liquid-pill text-[#0b0f19] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <FileAudio className="w-3.5 h-3.5 text-sky-600" />
                    <span>320k MP3</span>
                  </button>

                  <button
                    onClick={() => openDownloadFunnel("wav")}
                    className="px-3.5 py-1.5 rounded-full liquid-pill text-[#0b0f19] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Disc className="w-3.5 h-3.5 text-[#ff3b30]" />
                    <span>Studio WAV</span>
                  </button>

                  {currentTrack.seoData && (
                    <button
                      onClick={handleCopyTags}
                      className="px-3.5 py-1.5 rounded-full liquid-pill text-slate-700 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {copiedTags ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Tag className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{copiedTags ? "Tags Copied" : "Tags"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Track Notes & Audio Spec Card */}
            <div className="p-5 sm:p-6 rounded-3xl liquid-glass text-xs md:text-sm text-[#0b0f19] space-y-4">
              <div className="flex flex-wrap items-center gap-2 font-semibold text-xs text-slate-700">
                <span>{currentTrack.views.toLocaleString()} views</span>
                <span>·</span>
                <span>{currentTrack.formattedDate}</span>
                <span>·</span>
                <span className="text-[#ff3b30] font-mono">{currentTrack.subgenre}</span>
              </div>

              <p className="leading-relaxed text-slate-600">{currentTrack.caption}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                <span className="px-3 py-1 rounded-full liquid-badge text-slate-800">
                  Tempo: <strong>{currentTrack.bpm} BPM</strong>
                </span>
                <span className="px-3 py-1 rounded-full liquid-badge text-slate-800">
                  Key: <strong>{currentTrack.key}</strong>
                </span>
                <span className="px-3 py-1 rounded-full liquid-badge text-slate-800">
                  Format: <strong>320k MP3 / 48kHz WAV</strong>
                </span>
              </div>

              {currentTrack.seoData && (
                <div className="pt-3 border-t border-white/70 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Sound Tags ({currentTrack.seoData.tagList.length})</span>
                    <button
                      onClick={handleCopyTags}
                      className="text-sky-600 hover:underline font-semibold"
                    >
                      {copiedTags ? "Copied" : "Copy All"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-0.5">
                    {currentTrack.seoData.tagList.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full liquid-badge text-[11px] text-slate-600 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <GoogleStyleAdBanner format="leaderboard" />
            <SubscribeAdPoster variant="billboard" subscriberCount="141+" />
          </section>

          {/* Right Sidebar: Up Next Strictly Keeps Listeners Inside Supasonic Beats */}
          <aside aria-label="Up Next from Supasonic Beats" className="lg:col-span-4 space-y-5">
            <div className="p-4 sm:p-5 rounded-3xl liquid-glass space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/70 pb-2.5">
                <h2 className="text-xs font-bold text-[#0b0f19] uppercase tracking-wider">
                  Up Next · Supasonic Beats
                </h2>
                <span className="text-[10px] font-semibold text-[#ff3b30] uppercase tracking-wider">
                  Queue
                </span>
              </div>

              <div className="space-y-2.5">
                {ourRecommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/watch/${rec.videoId}`}
                    className="flex gap-3 p-2 rounded-2xl liquid-pill hover:bg-white transition-all group"
                  >
                    <div className="relative w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                      <img
                        src={rec.thumbnail}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${rec.videoId}/hqdefault.jpg`;
                        }}
                      />
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black/60 backdrop-blur-md px-1 rounded text-white">
                        {rec.duration || "3:24"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h3 className="text-xs font-bold text-[#0b0f19] group-hover:text-[#ff3b30] line-clamp-2 leading-tight transition-colors">
                        {rec.title}
                      </h3>
                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <div className="font-mono font-medium text-slate-700">
                          {rec.bpm} BPM · {rec.key}
                        </div>
                        <div>{rec.views.toLocaleString()} views</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sticky top-20">
              <SubscribeAdPoster variant="compact" subscriberCount="141+" />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <SocialLinksIsland />
        </div>
      </main>

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
