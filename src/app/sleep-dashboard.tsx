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

function sleepVerdict(hours: number, score: number): { emoji: string; text: string } {
  if (hours >= 7 && score >= 80) return { emoji: "😴", text: `${hours} uur geslapen vannacht - lekker geslapen` };
  if (hours >= 7 && score >= 60) return { emoji: "🙂", text: `${hours} uur geslapen vannacht - prima` };
  if (hours >= 6 && score >= 60) return { emoji: "😐", text: `${hours} uur geslapen vannacht - kan beter` };
  if (hours >= 5) return { emoji: "😟", text: `${hours} uur geslapen vannacht - te weinig` };
  return { emoji: "⚠️", text: `${hours} uur geslapen vannacht - veel te weinig, let op` };
}

function weekSummary(avgHours: number, goodNights: number, total: number): string {
  if (goodNights >= 5) return `Goede week: ${goodNights} van ${total} nachten goed geslapen`;
  if (goodNights >= 3) return `Redelijke week: ${goodNights} van ${total} nachten goed geslapen`;
  return `Zware week: maar ${goodNights} van ${total} nachten goed geslapen`;
}

function SleepChart({ nights }: { nights: SleepNight[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const w = 600;
  const h = 160;
  const padX = 0;
  const padTop = 20;
  const padBot = 0;
  const chartH = h - padTop - padBot;
  const minScore = 0;
  const maxScore = 100;

  const points = nights.map((n, i) => {
    const x = padX + (i / (nights.length - 1)) * (w - padX * 2);
    const y = padTop + chartH - ((n.sleepScore - minScore) / (maxScore - minScore)) * chartH;
    return { x, y, night: n, index: i };
  });

  // Smooth curve using cardinal spline
  function cardinalSpline(pts: { x: number; y: number }[], tension = 0.3): string {
    if (pts.length < 2) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  }

  const linePath = cardinalSpline(points);
  const areaPath = linePath + ` L ${points[points.length - 1].x},${h} L ${points[0].x},${h} Z`;

  // Threshold lines
  const y80 = padTop + chartH - (80 / 100) * chartH;
  const y60 = padTop + chartH - (60 / 100) * chartH;

  return (
    <div className="mt-5 mb-2 relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="Slaapscores grafiek"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#eab308" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            {points.map((p, i) => (
              <stop key={i} offset={`${(i / (points.length - 1)) * 100}%`} stopColor={scoreColor(p.night.sleepScore)} />
            ))}
          </linearGradient>
        </defs>

        {/* Threshold lines */}
        <line x1={0} y1={y80} x2={w} y2={y80} stroke="rgba(34,197,94,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={0} y1={y60} x2={w} y2={y60} stroke="rgba(234,179,8,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={w - 4} y={y80 - 4} fill="rgba(34,197,94,0.3)" fontSize="9" textAnchor="end">80%</text>
        <text x={w - 4} y={y60 - 4} fill="rgba(234,179,8,0.2)" fontSize="9" textAnchor="end">60%</text>

        {/* Area fill */}
        <path d={areaPath} fill="url(#sleepGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive dots + hover zones */}
        {points.map((p) => (
          <g key={p.index}>
            <rect
              x={p.x - (w / nights.length) / 2}
              y={0}
              width={w / nights.length}
              height={h}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHovered(p.index)}
            />
            <circle
              cx={p.x} cy={p.y} r={hovered === p.index ? 5 : (p.index === nights.length - 1 ? 4 : 0)}
              fill={scoreColor(p.night.sleepScore)}
              stroke="#0f172a" strokeWidth="2"
              className="transition-all duration-150"
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered !== null && points[hovered] && (
        <div
          className="absolute bg-white text-stone-900 text-xs rounded-xl px-3 py-2 whitespace-nowrap z-10 shadow-xl pointer-events-none"
          style={{
            left: `${(points[hovered].x / w) * 100}%`,
            bottom: `${((h - points[hovered].y) / h) * 100 + 8}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-bold">{formatDate(points[hovered].night.date)}</div>
          <div className="text-stone-500">{points[hovered].night.sleepScore}% slaapscore</div>
          <div className="text-stone-500">{points[hovered].night.hoursSlept}u slaap</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}

      {/* Date axis */}
      <div className="flex justify-between mt-1 text-[10px] text-blue-300/30">
        <span>{new Date(nights[0].date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>
        {nights.length > 10 && <span>{new Date(nights[Math.floor(nights.length / 2)].date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>}
        <span>vandaag</span>
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
          <h3 className="text-lg font-bold text-white">Hoe slaapt Daantje?</h3>
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
          <h3 className="text-lg font-bold text-white">Hoe slaapt Daantje?</h3>
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

  const verdict = latest ? sleepVerdict(latest.hoursSlept, latest.sleepScore) : null;
  const weekMsg = weekSummary(avgHours, goodNights, week.length);

  return (
    <div className="relative rounded-2xl overflow-hidden p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <StarField />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Hoe slaapt Daantje?</h3>
          <span className="text-[10px] text-blue-300/30 font-medium">WHOOP @Goodheart</span>
        </div>

        {/* Vannacht - big and clear for mama */}
        {verdict && (
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-2 border border-white/5">
            <div className="text-2xl font-bold text-white">
              {verdict.emoji} {verdict.text}
            </div>
          </div>
        )}

        {/* Week summary */}
        <p className="text-sm text-blue-200/50 mb-1">
          {weekMsg} (gem. {avgHours} uur per nacht)
        </p>

        {/* Bar chart */}
        <SleepChart nights={data.nights} />

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
