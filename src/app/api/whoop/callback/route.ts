import { NextRequest, NextResponse } from "next/server";
import { getClientCredentials, storeTokens } from "../token-store";

const VERCEL_PROJECT_ID = "prj_3jjAej2ab1wkrYqmCCxsgAILg6SW";

async function upsertVercelEnv(key: string, value: string) {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    console.warn("No VERCEL_API_TOKEN, skipping env var update");
    return;
  }

  // First try to find existing env var
  const listRes = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (listRes.ok) {
    const { envs } = await listRes.json();
    const existing = envs?.find((e: { key: string }) => e.key === key);

    if (existing) {
      // Update existing
      const res = await fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${existing.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        }
      );
      console.log(`[Vercel] Updated ${key}:`, res.status);
      return;
    }
  }

  // Create new
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production"],
      }),
    }
  );
  console.log(`[Vercel] Created ${key}:`, res.status);
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const { clientId, clientSecret } = getClientCredentials();
  const redirectUri = process.env.WHOOP_REDIRECT_URI || "https://protect.goodheart.earth/api/whoop/callback";

  const res = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Token exchange failed:", error);
    return NextResponse.json({ error: "Token exchange failed", details: error }, { status: 500 });
  }

  const data = await res.json();
  await storeTokens(data);

  // Persist refresh token as Vercel env var (survives cold starts)
  await upsertVercelEnv("WHOOP_REFRESH_TOKEN", data.refresh_token);

  // Also store the access token directly so the sleep endpoint can use it without refreshing
  await upsertVercelEnv("WHOOP_ACCESS_TOKEN", data.access_token);
  await upsertVercelEnv("WHOOP_TOKEN_EXPIRES_AT", String(Date.now() + data.expires_in * 1000 - 60000));

  // Redirect to the main page
  return NextResponse.redirect(new URL("/?whoop=connected", req.url));
}
