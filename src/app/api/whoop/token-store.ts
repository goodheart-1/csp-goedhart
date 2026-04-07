// Simple token store: in-memory cache with env var fallback
// For a single-user personal app, this works. Upgrade to Vercel KV for robustness.

interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp in ms
}

let cachedTokens: TokenPair | null = null;

const WHOOP_TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";

export function getClientCredentials() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing WHOOP_CLIENT_ID or WHOOP_CLIENT_SECRET");
  }
  return { clientId, clientSecret };
}

export async function storeTokens(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  cachedTokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000 - 60_000, // 1 min buffer
  };
}

export async function getAccessToken(): Promise<string> {
  // If we have a valid cached token, use it
  if (cachedTokens && cachedTokens.expires_at > Date.now()) {
    return cachedTokens.access_token;
  }

  // Need to refresh
  const refreshToken = cachedTokens?.refresh_token || process.env.WHOOP_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("NO_REFRESH_TOKEN");
  }

  const { clientId, clientSecret } = getClientCredentials();

  const res = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Token refresh failed:", error);
    throw new Error("TOKEN_REFRESH_FAILED");
  }

  const data = await res.json();
  await storeTokens(data);

  // Persist new refresh token to Vercel env var (fire-and-forget)
  persistRefreshToken(data.refresh_token).catch((err) =>
    console.error("[WHOOP] Failed to persist refresh token:", err)
  );

  return data.access_token;
}

const VERCEL_PROJECT_ID = "prj_3jjAej2ab1wkrYqmCCxsgAILg6SW";

async function persistRefreshToken(refreshToken: string) {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return;

  const listRes = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!listRes.ok) return;

  const { envs } = await listRes.json();
  const existing = envs?.find((e: { key: string }) => e.key === "WHOOP_REFRESH_TOKEN");

  if (existing) {
    await fetch(
      `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${existing.id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value: refreshToken }),
      }
    );
  } else {
    await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "WHOOP_REFRESH_TOKEN",
          value: refreshToken,
          type: "encrypted",
          target: ["production"],
        }),
      }
    );
  }
  console.log("[WHOOP] Refresh token persisted to Vercel env");
}
