"use client";

import { useState, useEffect } from "react";

interface SleepNight {
  date: string;
  sleepScore: number;
  efficiency: number;
  hoursSlept: number;
  rem: number;
  deep: number;
  light: number;
  respiratoryRate: number;
  disturbances: number;
}

interface SleepData {
  nights: SleepNight[];
  recovery: { score: number; restingHR: number; hrv: number } | null;
  updatedAt: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function scoreBg(score: number): string {
  if (score >= 80) return "rgba(34,197,94,0.15)";
  if (score >= 60) return "rgba(234,179,8,0.15)";
  if (score >= 40) return "rgba(249,115,22,0.15)";
  return "rgba(239,68,68,0.15)";
}

function formatDay(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("nl-NL", { weekday: "short" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function positiveMessage(avgScore: number, goodNights: number, total: number): string {
  if (avgScore >= 85) return `Uitstekende week - ${goodNights}/${total} nachten goed geslapen`;
  if (avgScore >= 70) return `Goede week - ${goodNights}/${total} nachten boven 80%`;
  if (avgScore >= 55) return `Redelijke week - slaap is stabiel`;
  return `Zware week - extra rust nodig`;
}

function SleepBarChart({ nights }: { nights: SleepNight[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mt-6 mb-2">
      <div className="flex items-end gap-[3px] h-36" role="img" aria-label="Slaapscores">
        {nights.map((night, i) => {
          const height = Math.max(8, (night.sleepScore / 100) * 100);
          const color = scoreColor(night.sleepScore);
          const isHovered = hovered === i;
          const isLatest = i === nights.length - 1;

          return (
            <button
              key={night.date}
              className="relative flex-1 flex flex-col justify-end cursor-pointer transition-opacity duration-150"
              style={{ opacity: hovered !== null && !isHovered ? 0.4 : 1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              aria-label={`${formatDate(night.date)}: ${night.sleepScore}%`}
            >
              <div
                className="w-full rounded-t transition-all duration-200 ease-out"
                style={{
                  height: `${height}%`,
                  background: isLatest
                    ? `linear-gradient(to top, ${color}, ${color}cc)`
                    : `linear-gradient(to top, ${color}90, ${color}50)`,
                  boxShadow: isHovered ? `0 0 12px ${color}60` : "none",
                }}
              />
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-xs rounded-xl px-3 py-2 whitespace-nowrap z-10 shadow-xl pointer-events-none">
                  <div className="font-bold">{formatDate(night.date)}</div>
                  <div className="text-stone-500">{night.sleepScore}% slaapscore</div>
                  <div className="text-stone-500">{night.hoursSlept}u slaap</div>
                  {night.deep > 0 && <div className="text-stone-400">{night.deep}m diep / {night.rem}m REM</div>}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Date axis */}
      <div className="flex justify-between mt-2 text-[10px] text-blue-300/40">
        {nights.length > 0 && (
          <>
            <span>{new Date(nights[0].date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>
            {nights.length > 10 && <span>{new Date(nights[Math.floor(nights.length / 2)].date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>}
            <span>vandaag</span>
          </>
        )}
      </div>
    </div>
  );
}

function StarField() {
  // CSS-only stars via radial gradients
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.4) 50%, transparent 50%),
          radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.3) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.5) 50%, transparent 50%),
          radial-gradient(1px 1px at 55% 42%, rgba(255,255,255,0.25) 50%, transparent 50%),
          radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,0.35) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 85% 28%, rgba(255,255,255,0.45) 50%, transparent 50%),
          radial-gradient(1px 1px at 15% 65%, rgba(255,255,255,0.2) 50%, transparent 50%),
          radial-gradient(1px 1px at 35% 78%, rgba(255,255,255,0.3) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 60% 72%, rgba(255,255,255,0.4) 50%, transparent 50%),
          radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.2) 50%, transparent 50%),
          radial-gradient(1px 1px at 92% 48%, rgba(255,255,255,0.35) 50%, transparent 50%),
          radial-gradient(1px 1px at 48% 88%, rgba(255,255,255,0.25) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 5% 92%, rgba(255,255,255,0.3) 50%, transparent 50%),
          radial-gradient(1px 1px at 72% 85%, rgba(255,255,255,0.2) 50%, transparent 50%)
        `,
      }} />
      {/* Moon glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{
        background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
      }} />
    </div>
  );
}

function StatPill({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/5">
      <div className="text-[10px] text-blue-200/50 font-medium uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold mt-0.5" style={{ color: color || "#e2e8f0" }}>{value}</div>
      {sub && <div className="text-[10px] text-blue-200/40 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function SleepDashboard() {
  const [data, setData] = useState<SleepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSleep() {
      try {
        const res = await fetch("/api/whoop/sleep");
        if (res.status === 401) { setError("NOT_AUTHORIZED"); setLoading(false); return; }
        if (!res.ok) throw new Error("Failed to fetch");
        setData(await res.json());
      } catch { setError("FETCH_FAILED"); }
      finally { setLoading(false); }
    }
    fetchSleep();
    const interval = setInterval(fetchSleep, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-white/10 rounded" />
          <div className="h-36 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (error === "NOT_AUTHORIZED") {
    return (
      <div className="relative rounded-2xl overflow-hidden p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <StarField />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white">Hoe gaat het met Daantje?</h3>
          <p className="text-blue-200/50 text-sm mt-2">Whoop is nog niet gekoppeld.</p>
          <a href="/api/whoop/authorize" className="inline-block mt-3 px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
            Koppel Whoop
          </a>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="relative rounded-2xl overflow-hidden p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <StarField />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white">Hoe gaat het met Daantje?</h3>
          <p className="text-blue-200/50 text-sm mt-2">Kan gezondheidsdata niet laden.</p>
        </div>
      </div>
    );
  }

  const latest = data.nights[data.nights.length - 1];
  const week = data.nights.slice(-7);
  const goodNights = week.filter(n => n.sleepScore >= 80).length;
  const avgScore = week.length > 0 ? Math.round(week.reduce((s, n) => s + n.sleepScore, 0) / week.length) : 0;
  const avgHours = week.length > 0 ? Math.round(week.reduce((s, n) => s + n.hoursSlept, 0) / week.length * 10) / 10 : 0;

  return (
    <div className="relative rounded-2xl overflow-hidden p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <StarField />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-white">Hoe gaat het met Daantje?</h3>
          <span className="text-[10px] text-blue-300/30 font-medium">WHOOP @Goodheart</span>
        </div>

        {/* Positive message */}
        <p className="text-sm font-medium" style={{ color: scoreColor(avgScore) }}>
          {positiveMessage(avgScore, goodNights, week.length)}
        </p>

        {/* Bar chart */}
        <SleepBarChart nights={data.nights} />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <StatPill label="Slaap" value={`${latest?.sleepScore || 0}%`} sub="vannacht" color={latest ? scoreColor(latest.sleepScore) : undefined} />
          <StatPill label="Herstel" value={data.recovery ? `${data.recovery.score}%` : "-"} sub="vandaag" color={data.recovery ? scoreColor(data.recovery.score) : undefined} />
          <StatPill label="Gem. slaap" value={`${avgHours}u`} sub="per nacht" />
          <StatPill label="HRV" value={data.recovery ? `${data.recovery.hrv}` : "-"} sub="ms" />
        </div>

        {/* Footer */}
        <div className="mt-4 text-[10px] text-blue-300/25 text-right">
          Bijgewerkt {new Date(data.updatedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
