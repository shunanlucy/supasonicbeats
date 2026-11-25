import { NextResponse } from "next/server";
import { getChannelPlaylists } from "@/lib/playlists";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { playlists, allTracks } = await getChannelPlaylists();
    return NextResponse.json(
      {
        success: true,
        playlists,
        allTracks,
        syncedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("Playlists API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load playlists" },
      { status: 500 }
    );
  }
}
