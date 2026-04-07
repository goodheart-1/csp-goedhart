import { NextResponse } from "next/server";
import { getClientCredentials } from "../token-store";

export async function GET() {
  const { clientId } = getClientCredentials();
  const redirectUri = process.env.WHOOP_REDIRECT_URI || "https://protect.goodheart.earth/api/whoop/callback";

  const scopes = [
    "read:recovery",
    "read:cycles",
    "read:sleep",
    "read:workout",
    "read:profile",
    "read:body_measurement",
    "offline",
  ].join(" ");

  const authUrl = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(authUrl.toString());
}
