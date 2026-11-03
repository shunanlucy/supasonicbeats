import { NextResponse } from "next/server";
import { getStoredTokens, clearStoredTokens } from "@/lib/googleAuth";
import { fetchChannelData } from "@/lib/youtube";

export async function GET() {
  const tokens = getStoredTokens();
  if (!tokens || (!tokens.access_token && !tokens.refresh_token)) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const { overview } = await fetchChannelData();
    return NextResponse.json({
      authenticated: true,
      channel: overview,
    });
  } catch (error: any) {
    // If token is invalid or revoked
    return NextResponse.json({
      authenticated: false,
      error: error.message,
    });
  }
}

export async function POST() {
  clearStoredTokens();
  return NextResponse.json({ success: true });
}
