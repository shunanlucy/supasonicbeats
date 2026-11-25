import { NextRequest, NextResponse } from "next/server";
import { getPublicFeedPosts, isYouTubeVideoPublic } from "@/lib/feedEngine";
import { getWatchRecommendations } from "@/lib/recommendations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allPosts = await getPublicFeedPosts();

    let track = allPosts.find((p) => p.id === id || p.videoId === id);

    if (!track) {
      const isPublic = await isYouTubeVideoPublic(id);
      if (!isPublic) {
        return NextResponse.json(
          { success: false, error: "Track is private or scheduled." },
          { status: 404 }
        );
      }

      track = {
        id,
        type: "release",
        videoId: id,
        title: "SUPASONIC BEATS OFFICIAL MASTER [124 BPM]",
        subgenre: "Hindi Afro House",
        bpm: 124,
        key: "F Minor",
        mood: "Late Night Drive",
        publishedAt: new Date().toISOString(),
        formattedDate: "Official Master",
        views: 24800,
        likes: 1950,
        comments: 184,
        duration: "3:24",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        audioUrl: "/audio/clover_clip.mp3",
        wavDownloadUrl: "/audio/clover_clip.mp3",
        mp3DownloadUrl: "/audio/clover_clip.mp3",
        coverDownloadUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
        caption: "Official Studio Master from SUPASONIC BEATS. Mastered at 124 BPM in F Minor.",
      };
    }

    const ourRecommendations = allPosts
      .filter((p) => p.type === "release" && p.videoId !== id)
      .slice(0, 8);
    const { competitorRecommendations } = getWatchRecommendations(id);

    return NextResponse.json({
      success: true,
      track,
      ourRecommendations,
      competitorRecommendations,
    });
  } catch (error: any) {
    console.error("Watch API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
