import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "tokens.json");

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();

  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Force to get refresh_token
  });
}

export function saveTokens(tokens: any) {
  const dir = path.dirname(TOKEN_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // If old tokens exist, preserve refresh_token if new one is missing
  let currentTokens: any = {};
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      currentTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    } catch (e) {
      currentTokens = {};
    }
  }

  const mergedTokens = {
    ...currentTokens,
    ...tokens,
    updated_at: new Date().toISOString(),
  };

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(mergedTokens, null, 2), "utf-8");
}

export function getStoredTokens() {
  if (!fs.existsSync(TOKEN_PATH)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(TOKEN_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function clearStoredTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

export async function getAuthenticatedClient() {
  const tokens = getStoredTokens();
  if (!tokens || (!tokens.access_token && !tokens.refresh_token)) {
    return null;
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  oauth2Client.on("tokens", (newTokens) => {
    saveTokens(newTokens);
  });

  return oauth2Client;
}
