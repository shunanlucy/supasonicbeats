import { NextRequest, NextResponse } from "next/server";
import { evaluateTitleCTR } from "@/lib/trendEngine";
import { evaluateThreeSystemReadiness } from "@/lib/competitorRadar";

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    const result = evaluateTitleCTR(title || "");
    const threeSystem = evaluateThreeSystemReadiness(title || "");

    return NextResponse.json({
      success: true,
      result: {
        ...result,
        threeSystem,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
