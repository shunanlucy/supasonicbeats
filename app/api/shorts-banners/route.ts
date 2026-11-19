import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, "data", "shorts_banner_manifest.json");

  if (fs.existsSync(manifestPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      return NextResponse.json({ success: true, items: data });
    } catch (e: any) {
      console.warn("Failed to read shorts manifest:", e.message);
    }
  }

  // Fallback items if manifest is still processing
  const fallback = [
    {
      id: "short-jaadu",
      title: "JAADU",
      bpm: 124,
      key: "F Minor",
      genre: "Hindi Afro House",
      views: 18400,
      videoId: "87ndOuq346I",
      gifUrl: "/shorts_banner/jaadu.gif",
      mp4Url: "/shorts_banner/jaadu.mp4",
      posterUrl: "/shorts_banner/jaadu.jpg",
      watchUrl: "/watch/87ndOuq346I?from=short-jaadu",
    },
    {
      id: "short-scene",
      title: "SCENE",
      bpm: 126,
      key: "F Minor",
      genre: "Festival Club Banger",
      views: 53000,
      videoId: "SQzOlmY413Y",
      gifUrl: "/shorts_banner/scene.gif",
      mp4Url: "/shorts_banner/scene.mp4",
      posterUrl: "/shorts_banner/scene.jpg",
      watchUrl: "/watch/SQzOlmY413Y?from=short-scene",
    },
  ];

  return NextResponse.json({ success: true, items: fallback });
}
