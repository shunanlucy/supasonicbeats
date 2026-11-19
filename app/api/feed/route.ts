import { NextRequest, NextResponse } from "next/server";
import { getAllFeedPosts, saveNewCustomPost } from "@/lib/feedEngine";
import { fetchChannelData } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const refresh = searchParams.get("refresh") === "true";

    let liveSynced = false;
    let channelOverview: any = {
      title: "SUPASONIC BEATS",
      customUrl: "@SupasonicBeatsOfficial",
      description: "Official Studio Hub • Hindi Afro House, Desi Deep House & Club Bangers",
      statistics: {
        subscriberCount: "114+",
        viewCount: "46000",
        videoCount: "78",
      },
    };

    if (refresh) {
      try {
        const live = await fetchChannelData();
        if (live && live.overview) {
          channelOverview = live.overview;
          liveSynced = true;
        }
      } catch (e) {
        console.warn("Live channel fetch on refresh:", e);
      }
    }

    const posts = getAllFeedPosts();

    return NextResponse.json({
      success: true,
      channel: channelOverview,
      posts,
      totalPosts: posts.length,
      liveSynced,
    });
  } catch (error: any) {
    console.error("Feed API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, videoId, title, subgenre, bpm, key, mood } = body;

    let targetVideoId = videoId;
    if (!targetVideoId && videoUrl) {
      // Parse YouTube URL (youtube.com/watch?v=... or youtu.be/... or shorts/...)
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match) targetVideoId = match[1];
      else targetVideoId = videoUrl.trim();
    }

    if (!targetVideoId) {
      return NextResponse.json({ error: "Valid YouTube Video URL or Video ID is required" }, { status: 400 });
    }

    const newPost = saveNewCustomPost({
      videoId: targetVideoId,
      title: title || `NEW RELEASE [${bpm || 124} BPM] - Hindi Afro House | Supasonic Beats`,
      subgenre: subgenre || "Hindi Afro House",
      bpm: parseInt(bpm || "124", 10),
      key: key || "F Minor",
      mood: mood || "Late Night Drive",
    });

    return NextResponse.json({
      success: true,
      message: "New post published successfully to channel feed!",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Create post API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
