// Track Velocity & Lifespan Radar for Supasonic Beats

export interface VelocityTrackItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  thumbnail: string;
  ageDays: number;
  viewsPerDay: number;
  category: "Surge Hit" | "Evergreen Slow Burner" | "Sleeping Track";
  actionAdvice: string;
}

export interface VelocityRadarResult {
  averageChannelViewsPerDay: number;
  surgeHits: VelocityTrackItem[];
  evergreenTracks: VelocityTrackItem[];
  sleepingTracks: VelocityTrackItem[];
}

export function calculateVelocityRadar(beats: any[]): VelocityRadarResult {
  const now = new Date();
  let totalDailyVelocity = 0;

  const analyzedTracks: VelocityTrackItem[] = beats.map((b) => {
    const pubDate = new Date(b.publishedAt || now);
    const ageDays = Math.max(1, Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24)));
    const views = b.views || 0;
    const viewsPerDay = parseFloat((views / ageDays).toFixed(1));
    totalDailyVelocity += viewsPerDay;

    let category: "Surge Hit" | "Evergreen Slow Burner" | "Sleeping Track" = "Evergreen Slow Burner";
    let actionAdvice = "";

    if (views >= 500 || viewsPerDay >= 15) {
      category = "Surge Hit";
      actionAdvice = "🔥 Momentum is high! Create a part 2 or a 1-hour extended mix of this track.";
    } else if (views >= 100 && ageDays > 10) {
      category = "Evergreen Slow Burner";
      actionAdvice = "📈 Steady listener retention. Good candidate to feature in your channel playlist.";
    } else {
      category = "Sleeping Track";
      actionAdvice = "💤 Flatline alert. Update thumbnail contrast and add explicit BPM to re-trigger browse impressions.";
    }

    return {
      id: b.id,
      title: b.title,
      views,
      likes: b.likes,
      thumbnail: b.thumbnail,
      ageDays,
      viewsPerDay,
      category,
      actionAdvice,
    };
  });

  const averageChannelViewsPerDay = analyzedTracks.length > 0 ? parseFloat((totalDailyVelocity / analyzedTracks.length).toFixed(1)) : 0;
  const surgeHits = analyzedTracks.filter((t) => t.category === "Surge Hit").sort((a, b) => b.viewsPerDay - a.viewsPerDay);
  const evergreenTracks = analyzedTracks.filter((t) => t.category === "Evergreen Slow Burner").sort((a, b) => b.views - a.views);
  const sleepingTracks = analyzedTracks.filter((t) => t.category === "Sleeping Track").sort((a, b) => a.views - b.views);

  return {
    averageChannelViewsPerDay,
    surgeHits,
    evergreenTracks,
    sleepingTracks,
  };
}
