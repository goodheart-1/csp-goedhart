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

function scoreToPhase(score: number): { color: string; bg: string; border: string; label: string } {
  if (score >= 80) return { color: "var(--color-phase-0)", bg: "var(--color-phase-0-light)", border: "var(--color-phase-0-border)", label: "Stabiel" };
  if (score >= 60) return { color: "var(--color-phase-1)", bg: "var(--color-phase-1-light)", border: "var(--color-phase-1-border)", label: "Aandacht" };
  if (score >= 40) return { color: "var(--color-phase-2)", bg: "var(--color-phase-2-light)", border: "var(--color-phase-2-border)", label: "Waarschuwing" };
  return { color: "var(--color-phase-3)", bg: "var(--color-phase-3-light)", border: "var(--color-phase-3-border)", label: "Crisis" };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function ScoreGauge({ score, label, size = "lg" }: { score: number; label: string; size?: "lg" | "sm" }) {
  const phase = scoreToPhase(score);
  const radius = size === "lg" ? 54 : 32;
  const stroke = size === "lg" ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const viewBox = size === "lg" ? 128 : 78;
  const center = viewBox / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={viewBox} height={viewBox} className="transform -rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-stone-200" />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={phase.color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 4px ${phase.color}40)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: viewBox, height: viewBox }}>
        <span className={`font-bold ${size === "lg" ? "text-3xl" : "text-lg"}`} style={{ color: phase.color }}>
          {score}%
        </span>
      </div>
      <span className="text-xs text-stone-500 font-medium">{label}</span>
    </div>
  );
}

function BarChart({ nights }: { nights: SleepNight[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxScore = 100;

  return (
    <div className="mt-4">
      <div className="flex items-end gap-[3px] h-32" role="img" aria-label="Slaapscores laatste 21 nachten">
        {nights.map((night, i) => {
          const phase = scoreToPhase(night.sleepScore);
          const height = (night.sleepScore / maxScore) * 100;
          const isHovered = hoveredIndex === i;
          const isLatest = i === nights.length - 1;

          return (
            <button
              key={night.date}
              className="relative flex-1 flex flex-col justify-end cursor-pointer group transition-opacity duration-150"
              style={{ opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`${formatDate(night.date)}: ${night.sleepScore}% slaapscore, ${night.hoursSlept} uur`}
            >
              <div
                className="w-full rounded-t-sm transition-all duration-200 ease-out"
                style={{
                  height: `${height}%`,
                  backgroundColor: phase.color,
                  opacity: isLatest ? 1 : 0.75,
                  boxShadow: isHovered ? `0 0 8px ${phase.color}60` : "none",
                }}
              />
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                  <div className="font-semibold">{formatDate(night.date)}</div>
                  <div>{night.sleepScore}% slaapscore</div>
                  <div>{night.hoursSlept}u slaap</div>
                  <div>{night.deep}m diep / {night.rem}m REM</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Date labels */}
      <div className="flex justify-between mt-1 text-[10px] text-stone-400">
        {nights.length > 0 && (
          <>
            <span>{formatShortDate(nights[0].date)}</span>
            {nights.length > 10 && <span>{formatShortDate(nights[Math.floor(nights.length / 2)].date)}</span>}
            <span>{formatShortDate(nights[nights.length - 1].date)}</span>
          </>
        )}
      </div>
    </div>
  );
}

function PhaseIndicator() {
  return (
    <div className="flex gap-3 text-[10px] text-stone-500 mt-3">
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--phase-0-primary)" }} /> &gt;80%</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--phase-1-primary)" }} /> 60-80%</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--phase-2-primary)" }} /> 40-60%</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--phase-3-primary)" }} /> &lt;40%</span>
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
        if (res.status === 401) {
          setError("NOT_AUTHORIZED");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch {
        setError("FETCH_FAILED");
      } finally {
        setLoading(false);
      }
    }
    fetchSleep();
    // Refresh every 15 minutes
    const interval = setInterval(fetchSleep, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-stone-200 rounded" />
          <div className="h-32 bg-stone-100 rounded" />
        </div>
      </div>
    );
  }

  if (error === "NOT_AUTHORIZED") {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900">Slaap & Herstel</h3>
        <p className="text-stone-500 text-sm mt-2">Whoop is nog niet gekoppeld.</p>
        <a
          href="/api/whoop/authorize"
          className="inline-block mt-3 px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Koppel Whoop
        </a>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900">Slaap & Herstel</h3>
        <p className="text-stone-500 text-sm mt-2">Kan slaapdata niet laden. Probeer later opnieuw.</p>
      </div>
    );
  }

  const latest = data.nights[data.nights.length - 1];
  const latestPhase = latest ? scoreToPhase(latest.sleepScore) : null;

  // Calculate 7-day average
  const recentNights = data.nights.slice(-7);
  const avgScore = recentNights.length > 0
    ? Math.round(recentNights.reduce((sum, n) => sum + n.sleepScore, 0) / recentNights.length)
    : 0;
  const avgHours = recentNights.length > 0
    ? Math.round(recentNights.reduce((sum, n) => sum + n.hoursSlept, 0) / recentNights.length * 10) / 10
    : 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-stone-900">Slaap & Herstel</h3>
        <span className="text-[10px] text-stone-400">
          WHOOP @Goodheart
        </span>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Current sleep score */}
        <div className="flex flex-col items-center relative">
          {latest && <ScoreGauge score={latest.sleepScore} label="Vannacht" />}
        </div>

        {/* Recovery */}
        <div className="flex flex-col items-center relative">
          {data.recovery && <ScoreGauge score={data.recovery.score} label="Herstel" />}
          {!data.recovery && (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 text-sm">--</div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col justify-center gap-2 text-sm">
          {latest && (
            <>
              <div>
                <span className="text-stone-500 text-xs">Uren slaap</span>
                <div className="font-semibold text-stone-900">{latest.hoursSlept}u</div>
              </div>
              <div>
                <span className="text-stone-500 text-xs">7d gemiddeld</span>
                <div className="font-semibold" style={{ color: scoreToPhase(avgScore).color }}>{avgScore}% / {avgHours}u</div>
              </div>
              {data.recovery && (
                <div>
                  <span className="text-stone-500 text-xs">HRV</span>
                  <div className="font-semibold text-stone-900">{data.recovery.hrv}ms</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Phase indicator banner */}
      {latestPhase && (
        <div
          className="rounded-lg px-3 py-2 text-sm font-medium mb-4 text-center transition-colors duration-300"
          style={{ backgroundColor: latestPhase.bg, color: latestPhase.color, border: `1px solid ${latestPhase.border}` }}
        >
          Slaapfase: {latestPhase.label}
        </div>
      )}

      {/* Bar chart */}
      <BarChart nights={data.nights} />
      <PhaseIndicator />

      {/* Footer */}
      <div className="mt-3 text-[10px] text-stone-400 text-right">
        Bijgewerkt {new Date(data.updatedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
