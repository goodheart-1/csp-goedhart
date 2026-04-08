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
  if (score >= 80) return "var(--color-phase-0)";
  if (score >= 60) return "var(--color-phase-1)";
  if (score >= 40) return "var(--color-phase-2)";
  return "var(--color-phase-3)";
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nl-NL", { weekday: "short" });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function positiveMessage(avgScore: number, goodNights: number, total: number): string {
  if (avgScore >= 85) return `Top week - ${goodNights} van ${total} nachten goed geslapen`;
  if (avgScore >= 70) return `Solide week - ${goodNights} van ${total} nachten boven 80%`;
  if (avgScore >= 60) return `Oké week - slaap verbetert`;
  return `Zware week - extra rust nodig`;
}

function WeekOverview({ nights }: { nights: SleepNight[] }) {
  const week = nights.slice(-7);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {week.map((night, i) => {
        const color = scoreColor(night.sleepScore);
        const isGood = night.sleepScore >= 80;
        const isHovered = hoveredIndex === i;

        return (
          <button
            key={night.date}
            className="flex flex-col items-center gap-1 cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
            aria-label={`${formatDate(night.date)}: ${night.sleepScore}%, ${night.hoursSlept} uur`}
          >
            <span className="text-[10px] text-stone-400 font-medium">{formatDay(night.date)}</span>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-transform duration-150"
              style={{
                backgroundColor: color,
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                boxShadow: isHovered ? `0 4px 12px ${color}40` : "none",
              }}
            >
              {night.sleepScore}
            </div>
            <span className="text-[10px] text-stone-400">
              {night.hoursSlept > 0 ? `${night.hoursSlept}u` : "-"}
            </span>
            {isGood && (
              <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: "var(--color-phase-0)", color: "white" }}>
                <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M2 6l3 3 5-5"/></svg>
              </div>
            )}
            {isHovered && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                <div className="font-semibold">{formatDate(night.date)}</div>
                <div>{night.deep}m diep / {night.rem}m REM</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-stone-50/80 rounded-xl px-3 py-2.5 text-center">
      <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold mt-0.5" style={{ color: color || "var(--color-foreground)" }}>{value}</div>
      {sub && <div className="text-[10px] text-stone-400 mt-0.5">{sub}</div>}
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
    const interval = setInterval(fetchSleep, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-stone-200 rounded" />
          <div className="h-24 bg-stone-100 rounded" />
        </div>
      </div>
    );
  }

  if (error === "NOT_AUTHORIZED") {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900">Hoe gaat het met Daantje?</h3>
        <p className="text-stone-500 text-sm mt-2">Whoop is nog niet gekoppeld.</p>
        <a href="/api/whoop/authorize" className="inline-block mt-3 px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
          Koppel Whoop
        </a>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900">Hoe gaat het met Daantje?</h3>
        <p className="text-stone-500 text-sm mt-2">Kan gezondheidsdata niet laden.</p>
      </div>
    );
  }

  const latest = data.nights[data.nights.length - 1];
  const week = data.nights.slice(-7);
  const goodNights = week.filter(n => n.sleepScore >= 80).length;
  const avgScore = week.length > 0
    ? Math.round(week.reduce((sum, n) => sum + n.sleepScore, 0) / week.length)
    : 0;
  const avgHours = week.length > 0
    ? Math.round(week.reduce((sum, n) => sum + n.hoursSlept, 0) / week.length * 10) / 10
    : 0;

  const message = positiveMessage(avgScore, goodNights, week.length);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-stone-900">Hoe gaat het met Daantje?</h3>
        <span className="text-[10px] text-stone-400">WHOOP @Goodheart</span>
      </div>

      {/* Positive summary */}
      <p className="text-sm mb-5" style={{ color: scoreColor(avgScore) }}>
        {message}
      </p>

      {/* Week overview - the main visual */}
      <WeekOverview nights={data.nights} />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mt-5">
        <StatCard
          label="Slaap"
          value={`${latest?.sleepScore || 0}%`}
          sub="vannacht"
          color={latest ? scoreColor(latest.sleepScore) : undefined}
        />
        <StatCard
          label="Herstel"
          value={data.recovery ? `${data.recovery.score}%` : "-"}
          sub="vandaag"
          color={data.recovery ? scoreColor(data.recovery.score) : undefined}
        />
        <StatCard
          label="Gem. slaap"
          value={`${avgHours}u`}
          sub="per nacht"
        />
        <StatCard
          label="HRV"
          value={data.recovery ? `${data.recovery.hrv}` : "-"}
          sub="ms"
        />
      </div>

      {/* Footer */}
      <div className="mt-4 text-[10px] text-stone-400 text-right">
        Bijgewerkt {new Date(data.updatedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
