import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client, saveTokens } from "@/lib/googleAuth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=No_code_provided", request.url));
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    saveTokens(tokens);

    return NextResponse.redirect(new URL("/?connected=true", request.url));
  } catch (err: any) {
    console.error("Token exchange failed:", err);
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(err.message)}`, request.url));
  }
}
