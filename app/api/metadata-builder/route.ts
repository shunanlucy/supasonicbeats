import { NextRequest, NextResponse } from "next/server";
import { generateSongMetadata } from "@/lib/metadataGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const metadata = generateSongMetadata(body);
    return NextResponse.json({ success: true, metadata });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
