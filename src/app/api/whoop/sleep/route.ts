import { NextResponse } from "next/server";
import { getAccessToken } from "../token-store";

const WHOOP_API = "https://api.prod.whoop.com/developer/v1";

interface WhoopSleep {
  id: number;
  start: string;
  end: string;
  score_state: string;
  score?: {
    sleep_performance_percentage: number;
    sleep_efficiency_percentage: number;
    sleep_consistency_percentage: number;
    total_in_bed_time_milli: number;
    total_awake_time_milli: number;
    total_light_sleep_time_milli: number;
    total_slow_wave_sleep_time_milli: number;
    total_rem_sleep_time_milli: number;
    respiratory_rate: number;
    sleep_cycle_count: number;
    disturbance_count: number;
  };
  nap: boolean;
}

interface WhoopRecovery {
  cycle_id: number;
  score_state: string;
  score?: {
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
    user_calibrating: boolean;
  };
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Fetch sleep and recovery in parallel
    const [sleepRes, recoveryRes] = await Promise.all([
      fetch(`${WHOOP_API}/activity/sleep?limit=25`, { headers }),
      fetch(`${WHOOP_API}/recovery?limit=25`, { headers }),
    ]);

    if (!sleepRes.ok || !recoveryRes.ok) {
      const sleepErr = !sleepRes.ok ? await sleepRes.text() : "";
      const recErr = !recoveryRes.ok ? await recoveryRes.text() : "";
      console.error("Whoop API error:", { sleep: sleepRes.status, sleepErr, recovery: recoveryRes.status, recErr });
      return NextResponse.json({
        error: "Failed to fetch Whoop data",
        debug: { sleepStatus: sleepRes.status, recoveryStatus: recoveryRes.status, sleepErr, recErr }
      }, { status: 502 });
    }

    const sleepData = await sleepRes.json();
    const recoveryData = await recoveryRes.json();

    // Filter out naps, only scored sleeps
    const sleeps: WhoopSleep[] = (sleepData.records || [])
      .filter((s: WhoopSleep) => !s.nap && s.score_state === "SCORED");

    const recoveries: WhoopRecovery[] = (recoveryData.records || [])
      .filter((r: WhoopRecovery) => r.score_state === "SCORED");

    // Transform to simple format
    const nights = sleeps.slice(0, 21).map((sleep) => {
      const date = sleep.end.split("T")[0]; // Use end date as the "night of"
      const score = sleep.score!;
      const hoursSlept = Math.round((score.total_in_bed_time_milli - score.total_awake_time_milli) / 3600000 * 10) / 10;

      return {
        date,
        sleepScore: score.sleep_performance_percentage,
        efficiency: score.sleep_efficiency_percentage,
        hoursSlept,
        rem: Math.round(score.total_rem_sleep_time_milli / 60000),
        deep: Math.round(score.total_slow_wave_sleep_time_milli / 60000),
        light: Math.round(score.total_light_sleep_time_milli / 60000),
        respiratoryRate: score.respiratory_rate,
        disturbances: score.disturbance_count,
      };
    });

    // Latest recovery
    const latestRecovery = recoveries[0]?.score
      ? {
          score: recoveries[0].score.recovery_score,
          restingHR: recoveries[0].score.resting_heart_rate,
          hrv: Math.round(recoveries[0].score.hrv_rmssd_milli * 10) / 10,
        }
      : null;

    return NextResponse.json(
      {
        nights: nights.reverse(), // Oldest first for chart
        recovery: latestRecovery,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message === "NO_REFRESH_TOKEN" || message === "TOKEN_REFRESH_FAILED") {
      const details = (err as unknown as Record<string, unknown>).details;
      return NextResponse.json(
        { error: message, authorizeUrl: "/api/whoop/authorize", debug: details },
        { status: 401 }
      );
    }

    console.error("Sleep API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
