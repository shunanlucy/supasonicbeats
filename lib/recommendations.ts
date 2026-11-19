import { getAllFeedPosts, FeedPost } from "./feedEngine";
import fs from "fs";
import path from "path";

export interface CompetitorRecommendation {
  id: string;
  channelName: string;
  title: string;
  views: number;
  viewsFormatted: string;
  bpm: string;
  thumbnail: string;
  tags: string[];
  daysTo1M: number;
  tacticalNote: string;
}

export function getWatchRecommendations(currentVideoId: string): {
  ourRecommendations: FeedPost[];
  competitorRecommendations: CompetitorRecommendation[];
} {
  const allPosts = getAllFeedPosts();
  // Filter out current video, keep only releases, slice top 8
  const ourRecommendations = allPosts
    .filter((p) => p.type === "release" && p.videoId !== currentVideoId)
    .slice(0, 8);

  const competitorRecommendations: CompetitorRecommendation[] = [
    {
      id: "comp-01",
      channelName: "Singularity Beats",
      title: "Raat Baki | Afro House x Raga Techno x Deep House Playlist | Singularity Beats 👽",
      views: 4546531,
      viewsFormatted: "4.5M",
      bpm: "124 BPM",
      thumbnail: "https://i.ytimg.com/vi/eRTtU1znZI4/hqdefault.jpg",
      tags: ["Singularity Beats", "Afro House", "Bollywood Pop", "Indian Classical Fusion", "Organic House", "Downtempo"],
      daysTo1M: 21,
      tacticalNote: "High retro Bollywood search volume. Supasonic matches with 124 BPM studio master bass.",
    },
    {
      id: "comp-02",
      channelName: "Dhun Music Vibes",
      title: "Aao Na | Deep House x Club Bangers | Afro House | Dhun Music Vibes",
      views: 1425258,
      viewsFormatted: "1.4M",
      bpm: "124 BPM",
      thumbnail: "https://i.ytimg.com/vi/bWZocyszivk/hqdefault.jpg",
      tags: ["Dhun Music Vibes", "Deep House", "Club Bangers", "Afro House", "Hindi Electronic", "Nostalgic Remix"],
      daysTo1M: 14,
      tacticalNote: "Mellow romantic vocal chop style. Supasonic provides heavier club drop energy.",
    },
    {
      id: "comp-03",
      channelName: "Akarsh On Air",
      title: "19 Minutes of Bollywood Afro House Mix | Late Night Chill House Party DJ Mix",
      views: 2769364,
      viewsFormatted: "2.7M",
      bpm: "126 BPM",
      thumbnail: "https://i.ytimg.com/vi/mPjAGJ2Unn8/hqdefault.jpg",
      tags: ["Akarsh On Air", "Bollywood Afro House Mix", "Late Night Chill House", "Party DJ Mix", "Nonstop 2026"],
      daysTo1M: 35,
      tacticalNote: "Long continuous mix. Supasonic focuses on single radio masters for personal playlists.",
    },
    {
      id: "comp-04",
      channelName: "Debb Official 2.O",
      title: "Akhiyaan Gulaab X Dil Keh Raha Hai Dil Se | Mashup | Deep House / Progressive Deep",
      views: 1768089,
      viewsFormatted: "1.7M",
      bpm: "122 BPM",
      thumbnail: "https://i.ytimg.com/vi/i34pFNr42mc/hqdefault.jpg",
      tags: ["Debb Official", "Mashup", "Progressive Deep", "Hindi EDM", "Mitraz", "Club Remix"],
      daysTo1M: 40,
      tacticalNote: "Mashup vocal strategy. Supasonic offers original royalty-friendly electronic drops.",
    },
    {
      id: "comp-05",
      channelName: "DJ SYNCHRONIC",
      title: "Bollywood Afro Mix 2026 | Non Stop Bollywood Live Mix | Bollywood Afro Indo Music",
      views: 3200000,
      viewsFormatted: "3.2M",
      bpm: "124 BPM",
      thumbnail: "https://i.ytimg.com/vi/pgJIMI4Ihzw/hqdefault.jpg",
      tags: ["DJ Synchronic", "Afro Indo Music", "Live DJ Mix", "Festival EDM", "Bollywood Club 2026"],
      daysTo1M: 40,
      tacticalNote: "Festival EDM sound. Supasonic captures modern late-night melodic driving sets.",
    },
    {
      id: "comp-06",
      channelName: "Sukh Sapra",
      title: "Afro Bollywood House Mix 2026 | Nonstop DJ Mix | Deep Afro x Bollywood Vibes",
      views: 4100000,
      viewsFormatted: "4.1M",
      bpm: "122 BPM",
      thumbnail: "https://i.ytimg.com/vi/1suK9qPK_ds/hqdefault.jpg",
      tags: ["Sukh Sapra", "Sunset Mix", "Afro Bollywood", "Keinemusik Vibe", "Desi House"],
      daysTo1M: 35,
      tacticalNote: "Sunset chill mood. Supasonic brings punchy 808 sub-bass tuned for headphones & cars.",
    },
  ];

  return {
    ourRecommendations,
    competitorRecommendations,
  };
}
