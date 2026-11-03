import { NextRequest, NextResponse } from "next/server";
import { searchNicheCompetitors } from "@/lib/competitorRadar";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "Hindi Afro House";

    const data = await searchNicheCompetitors(query);
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Competitor radar API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
