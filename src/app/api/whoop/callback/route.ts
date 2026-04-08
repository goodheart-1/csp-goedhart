import { NextRequest, NextResponse } from "next/server";
import { getClientCredentials, storeTokens } from "../token-store";
import { cookies } from "next/headers";

const WHOOP_API = "https://api.prod.whoop.com/developer/v2";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const { clientId, clientSecret } = getClientCredentials();
  const redirectUri = process.env.WHOOP_REDIRECT_URI || "https://protect.goodheart.earth/api/whoop/callback";

  // Exchange code for tokens
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
    return NextResponse.json({ error: "Token exchange failed", details: error }, { status: 500 });
  }

  const data = await res.json();
  await storeTokens(data);

  // Immediately fetch sleep + recovery data with the fresh access token
  const headers = { Authorization: `Bearer ${data.access_token}` };

  const [sleepRes, recoveryRes] = await Promise.all([
    fetch(`${WHOOP_API}/activity/sleep?limit=25`, { headers }),
    fetch(`${WHOOP_API}/recovery?limit=25`, { headers }),
  ]);

  let sleepCache = "";

  if (sleepRes.ok && recoveryRes.ok) {
    const sleepData = await sleepRes.json();
    const recoveryData = await recoveryRes.json();

    const sleeps = (sleepData.records || [])
      .filter((s: { nap: boolean; score_state: string }) => !s.nap && s.score_state === "SCORED");

    const recoveries = (recoveryData.records || [])
      .filter((r: { score_state: string }) => r.score_state === "SCORED");

    const nights = sleeps.slice(0, 21).map((sleep: Record<string, unknown>) => {
      const score = sleep.score as Record<string, number>;
      const end = sleep.end as string;
      const date = end.split("T")[0];
      const totalSleep = (score.total_in_bed_time_milli || 0) - (score.total_awake_time_milli || 0);
      const hoursSlept = Math.round(Math.max(0, totalSleep) / 3600000 * 10) / 10;

      return {
        date,
        sleepScore: score.sleep_performance_percentage || 0,
        efficiency: score.sleep_efficiency_percentage || 0,
        hoursSlept,
        rem: Math.round((score.total_rem_sleep_time_milli || 0) / 60000),
        deep: Math.round((score.total_slow_wave_sleep_time_milli || 0) / 60000),
        light: Math.round((score.total_light_sleep_time_milli || 0) / 60000),
        respiratoryRate: score.respiratory_rate || 0,
        disturbances: score.disturbance_count || 0,
      };
    }).reverse();

    const latestRecovery = recoveries[0]?.score
      ? {
          score: (recoveries[0] as { score: Record<string, number> }).score.recovery_score,
          restingHR: (recoveries[0] as { score: Record<string, number> }).score.resting_heart_rate,
          hrv: Math.round((recoveries[0] as { score: Record<string, number> }).score.hrv_rmssd_milli * 10) / 10,
        }
      : null;

    sleepCache = JSON.stringify({
      nights,
      recovery: latestRecovery,
      updatedAt: new Date().toISOString(),
    });
  }

  // Return JSON so it can be saved as static file
  if (sleepCache) {
    return NextResponse.json(JSON.parse(sleepCache));
  }

  return NextResponse.json({ error: "Failed to fetch sleep data from Whoop" }, { status: 502 });
}
