import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/googleAuth";

export async function GET() {
  try {
    const url = getAuthUrl();
    return NextResponse.redirect(url);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
