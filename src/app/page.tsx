"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { defaultCSPData, type CSPData, type Phase } from "./csp-data";

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => (
        <div key={i} className={line === "" ? "h-2" : ""}>
          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      ))}
    </div>
  );
}

const phaseColors = {
  "0": {
    bg: "bg-phase-0-light",
    border: "border-phase-0-border",
    accent: "bg-phase-0",
    medium: "bg-phase-0-medium",
    text: "text-phase-0",
    ring: "ring-phase-0/30",
    accentText: "text-phase-0",
  },
  "1": {
    bg: "bg-phase-1-light",
    border: "border-phase-1-border",
    accent: "bg-phase-1",
    medium: "bg-phase-1-medium",
    text: "text-phase-1",
    ring: "ring-phase-1/30",
    accentText: "text-phase-1",
  },
  "2": {
    bg: "bg-phase-2-light",
    border: "border-phase-2-border",
    accent: "bg-phase-2",
    medium: "bg-phase-2-medium",
    text: "text-phase-2",
    ring: "ring-phase-2/30",
    accentText: "text-phase-2",
  },
  "3": {
    bg: "bg-phase-3-light",
    border: "border-phase-3-border",
    accent: "bg-phase-3",
    medium: "bg-phase-3-medium",
    text: "text-phase-3",
    ring: "ring-phase-3/30",
    accentText: "text-phase-3",
  },
} as const;

function ProgressBar({ phases }: { phases: Phase[] }) {
  const totalFields = phases.length * 5;
  const filledFields = phases.reduce(
    (acc, phase) => acc + phase.fields.filter((f) => f.value.trim().length > 0).length,
    0
  );
  const percentage = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-stone-500">
        <span>Voortgang</span>
        <span className={`font-semibold ${percentage === 100 ? "text-phase-0" : "text-stone-600"}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-stone-200 overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${percentage}% ingevuld`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              percentage === 100
                ? "var(--color-phase-0)"
                : "linear-gradient(90deg, var(--color-phase-0), var(--color-phase-1), var(--color-phase-2), var(--color-phase-3))",
          }}
        />
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  isOpen,
  onToggle,
  onFieldChange,
}: {
  phase: Phase;
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (fieldIndex: number, value: string) => void;
}) {
  const colors = phaseColors[phase.colorKey as keyof typeof phaseColors];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-200`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`phase-${phase.id}-content`}
        className="w-full flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 cursor-pointer hover:brightness-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.accent} text-white font-bold text-lg sm:text-xl shadow-sm`}
          >
            {phase.id}
          </div>
          <div className="text-left">
            <div className={`text-[11px] font-bold uppercase tracking-[2px] ${colors.accentText} opacity-80`}>
              Fase {phase.id}
            </div>
            <h3 className="font-sans font-semibold text-base sm:text-lg text-stone-900 mt-0.5">
              {phase.emoji} {phase.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {phase.fields.map((field, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${field.value.trim() ? colors.accent : "bg-stone-300"}`}
                title={field.label}
              />
            ))}
          </div>
          <svg
            className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      <div id={`phase-${phase.id}-content`} role="region" aria-label={`${phase.name} details`} className={`accordion-content ${isOpen ? "open" : ""}`}>
        <div>
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
            <div className={`h-px ${colors.border} bg-current opacity-30`} />
            {phase.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1.5">
                <label className={`flex items-center gap-2 text-[13px] font-semibold ${colors.accentText}`}>
                  <span>{field.icon}</span>
                  {field.label}
                </label>
                <div className={`rounded-lg border ${colors.border} bg-white/70 px-4 py-3 text-sm text-stone-800 leading-relaxed`}>
                  <RichText text={field.value || "Nog niet ingevuld"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const fieldLabels = ["Signalen", "Wat kan ik zelf doen?", "Wie kan ik bellen voor hulp?", "Wat kunnen anderen doen?", "Doel"];

function TableView({ data }: { data: CSPData }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col items-center space-y-3">
        <Image
          src="/avatar.png"
          alt="Daantje Goedhart"
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
        <div className="text-center space-y-1">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-stone-900">
            Bescherm Plan
          </h2>
          <p className="text-sm text-stone-500">Daantje Goedhart</p>
        </div>
      </div>

      {/* Protectors */}
      <ProtectorsCard />

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full border-collapse text-[13px]" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="w-[140px] p-3 text-left text-[11px] font-bold text-stone-400 uppercase tracking-[1.5px] align-bottom border border-stone-200/60 bg-stone-50" />
              {data.phases.map((phase) => {
                const c = phaseColors[phase.colorKey as keyof typeof phaseColors];
                return (
                  <th
                    key={phase.id}
                    className={`p-3 text-left align-bottom ${c.bg} border border-stone-200/60`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${c.accent} text-white font-bold text-xs shrink-0`}>
                        {phase.id}
                      </div>
                      <div>
                        <div className={`text-[10px] font-bold uppercase tracking-[1.5px] ${c.accentText} opacity-80`}>
                          Fase {phase.id}
                        </div>
                        <div className="text-[13px] font-semibold text-stone-700 mt-0.5 leading-tight">
                          {phase.emoji} {phase.name}
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {fieldLabels.map((label, fieldIndex) => (
              <tr key={fieldIndex}>
                <td className="p-3 text-[11px] font-bold text-stone-500 uppercase tracking-[1px] align-top leading-tight border border-stone-200/60 bg-stone-50">
                  {data.phases[0]?.fields[fieldIndex]?.icon} {label}
                </td>
                {data.phases.map((phase) => {
                  const c = phaseColors[phase.colorKey as keyof typeof phaseColors];
                  return (
                    <td
                      key={phase.id}
                      className={`p-3 align-top border border-stone-200/60 ${c.bg}`}
                    >
                      <div className="text-[13px] text-stone-800 leading-relaxed">
                        <RichText text={phase.fields[fieldIndex]?.value || ""} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400 pt-2">
        <p>Bij crisis: bel crisisdienst GGZ InGeest of huisartsenpost</p>
      </div>
    </div>
  );
}

const family = [
  { nr: 1, emoji: "🍀", name: "Margha Klaver", role: "Mama", subtitle: "Dagelijks contact, check-ins, hoe gaat het", phone: "+31617421388", primary: true },
  { nr: 2, emoji: "💚", name: "Aad Goedhart", role: "Vader", subtitle: "Alleen bij nood - puur uit voorzorg", info: "Papa staat als #2 puur uit voorzorg. We verwachten niet dat dit punt bereikt wordt. Dit plan bestaat zodat iedereen weet wat te doen, niet omdat het nodig zal zijn.", phone: "+31646102228" },
  { nr: 3, emoji: "🌹", name: "Roosje Goedhart", role: "Zus", phone: "+31622309990" },
  { nr: 4, emoji: "👩🏼‍🚒", name: "Sanne Goedhart", role: "Tweelingzus", phone: "+31621388020" },
];

const inlaws: typeof family = [
  { nr: 0, emoji: "🪚", name: "Sven Morsman", role: "Zwager (Sanne)", phone: "+31614604129" },
  { nr: 0, emoji: "🦌", name: "Niels de Nijs", role: "Zwager (Roosje)", phone: "+31628717258" },
];

const friends: typeof family = [
  { nr: 0, emoji: "🔱", name: "Don Mehrow", role: "", phone: "+31636311764" },
  { nr: 0, emoji: "⛰️", name: "Jeroen Blokzijl", role: "", phone: "+31640998822" },
  { nr: 0, emoji: "🦁", name: "Mats Duijn", role: "", phone: "+31623043383" },
  { nr: 0, emoji: "🐂", name: "Bram Veldhuijs", role: "", phone: "+31612422016" },
];

function ContactCard({ p }: { p: typeof family[0] }) {
  return (
    <a href={`https://wa.me/${p.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-xl p-3 hover:bg-stone-50 transition-colors cursor-pointer ${p.primary ? "bg-phase-0-light border border-phase-0-border" : "border border-stone-200/50"}`}>
      {p.nr > 0 && (
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs shrink-0 ${
          p.nr === 1 ? "bg-phase-0 text-white" :
          p.nr === 2 ? "bg-phase-0-medium text-phase-0" :
          "bg-stone-100 text-stone-500"
        }`}>
          {p.nr}
        </div>
      )}
      <span className="text-xl shrink-0">{p.emoji}</span>
      <div>
        <div className={`${p.primary ? "text-sm font-bold text-stone-900" : "text-sm font-medium text-stone-700"}`}>
          {p.name}
        </div>
        {p.role && (
          <div className={`text-xs ${p.primary ? "text-phase-0 font-semibold" : "text-stone-400"}`}>
            {p.role}
          </div>
        )}
        {"subtitle" in p && p.subtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-stone-400 italic">{p.subtitle}</span>
            {"info" in p && p.info && (
              <span className="relative group cursor-help" onClick={(e) => e.preventDefault()}>
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold">i</span>
                <span className="absolute left-0 top-5 w-56 bg-stone-900 text-white text-[11px] rounded-lg px-3 py-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {p.info}
                </span>
              </span>
            )}
          </div>
        )}
        <div className="text-sm font-medium text-phase-0 tabular-nums mt-0.5">
          {p.phone.replace(/^\+316(\d{2})(\d{2})(\d{2})(\d{2})$/, "06 $1 $2 $3 $4")}
        </div>
      </div>
    </a>
  );
}

function ProtectorsCard() {
  return (
    <div className="space-y-4">
      {/* Family */}
      <div className="bg-white rounded-xl border border-phase-0-border bg-phase-0-light p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-phase-0">
            Familie
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] bg-phase-0 text-white px-2.5 py-1 rounded-full">
            Altijd #1 prioriteit
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {family.map((p) => <ContactCard key={p.phone} p={p} />)}
        </div>
      </div>

      {/* In-laws */}
      <div className="bg-white rounded-xl border border-stone-200/60 p-4 sm:p-6 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400 mb-3">
          Aangetrouwd
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {inlaws.map((p) => <ContactCard key={p.phone} p={p} />)}
        </div>
      </div>

      {/* Friends */}
      <div className="bg-white rounded-xl border border-stone-200/60 p-4 sm:p-6 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400 mb-3">
          Vrienden
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {friends.map((p) => <ContactCard key={p.phone} p={p} />)}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<CSPData>(defaultCSPData);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([0]));

  const togglePhase = useCallback((phaseId: number) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  }, []);

  const updateField = useCallback((phaseId: number, fieldIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              fields: phase.fields.map((field, i) =>
                i === fieldIndex ? { ...field, value } : field
              ),
            }
          : phase
      ),
    }));
  }, []);

  const expandAll = () => setOpenPhases(new Set([0, 1, 2, 3]));
  const collapseAll = () => setOpenPhases(new Set());

  return (
    <div className="flex-1 flex flex-col">
      <a href="#main-content" className="skip-link">Ga naar inhoud</a>

      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-stone-200/50 no-print">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/avatar.png"
              alt="Daantje Goedhart"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[3px] text-stone-400">Bescherm Plan</div>
              <h1 className="font-sans font-semibold text-lg text-stone-900">
                Daantje Goedhart
              </h1>
            </div>
          </div>

          {/* Segmented toggle */}
          <div className="flex bg-stone-100/80 rounded-[10px] p-0.5">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                  view === v
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {v === "edit" ? "Accordion" : "Tabel"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {view === "edit" ? (
          <>
            {/* Progress */}
            <div className="bg-white rounded-xl border border-stone-200/60 p-4 sm:p-6 shadow-sm">
              <ProgressBar phases={data.phases} />
            </div>

            {/* Protectors */}
            <ProtectorsCard />

            {/* Expand/Collapse controls */}
            <div className="flex items-center justify-end gap-2 no-print">
              <button
                onClick={expandAll}
                className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
              >
                Alles openen
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
              >
                Alles sluiten
              </button>
            </div>

            {/* Phase cards */}
            <div className="space-y-4">
              {data.phases.map((phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  isOpen={openPhases.has(phase.id)}
                  onToggle={() => togglePhase(phase.id)}
                  onFieldChange={(fieldIndex, value) => updateField(phase.id, fieldIndex, value)}
                />
              ))}
            </div>
          </>
        ) : (
          <TableView data={data} />
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-stone-400 py-4 space-y-1 no-print">
          <p>Bescherm Plan - Print via Cmd+P</p>
        </footer>
      </main>
    </div>
  );
}
