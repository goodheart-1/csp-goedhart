"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { defaultCSPData, type CSPData, type Phase } from "./csp-data";

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
      <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${percentage}% ingevuld`}>
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
    <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden transition-all duration-200`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`phase-${phase.id}-content`}
        className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 cursor-pointer hover:brightness-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-2xl"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.accent} text-white font-bold text-lg sm:text-xl shadow-sm`}
          >
            {phase.id}
          </div>
          <div className="text-left">
            <div className={`text-[11px] font-bold uppercase tracking-[2px] ${colors.accentText} opacity-80`}>
              Fase {phase.id}
            </div>
            <h3 className="font-serif font-semibold text-base sm:text-lg text-stone-900 mt-0.5">
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
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-4">
            <div className={`h-px ${colors.border} bg-current opacity-30`} />
            {phase.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1.5">
                <label className={`flex items-center gap-2 text-[13px] font-semibold ${colors.accentText}`}>
                  <span>{field.icon}</span>
                  {field.label}
                </label>
                <textarea
                  value={field.value}
                  onChange={(e) => onFieldChange(fieldIndex, e.target.value)}
                  className={`w-full rounded-xl border ${colors.border} bg-white/70 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 transition-colors duration-200 resize-y leading-relaxed`}
                  placeholder={`Vul in...`}
                  rows={3}
                />
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            🛡️ Bescherm Plan
          </h2>
          <p className="text-sm text-stone-500">🍀 Daantje Goedhart</p>
        </div>
      </div>

      {/* Protectors */}
      <ProtectorsCard />

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[700px] border-collapse text-[13px]">
          {/* Phase header row */}
          <thead>
            <tr>
              <th className="w-[120px] p-2 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide align-bottom" />
              {data.phases.map((phase) => {
                const c = phaseColors[phase.colorKey as keyof typeof phaseColors];
                return (
                  <th
                    key={phase.id}
                    className={`p-3 text-left align-bottom rounded-t-xl ${c.bg} border-2 border-b-0 ${c.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${c.accent} text-white font-bold text-xs`}>
                        {phase.id}
                      </div>
                      <div>
                        <div className={`text-[10px] font-bold uppercase tracking-[1.5px] ${c.accentText} opacity-80`}>
                          Fase {phase.id}
                        </div>
                        <div className="text-xs font-semibold text-stone-700 mt-0.5 leading-tight">
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
                <td className="p-2 text-xs font-semibold text-stone-500 align-top leading-tight">
                  {data.phases[0]?.fields[fieldIndex]?.icon} {label}
                </td>
                {data.phases.map((phase) => {
                  const c = phaseColors[phase.colorKey as keyof typeof phaseColors];
                  const isLast = fieldIndex === fieldLabels.length - 1;
                  return (
                    <td
                      key={phase.id}
                      className={`p-3 align-top ${c.bg} border-x-2 ${c.border} ${isLast ? `border-b-2 rounded-b-xl` : ""}`}
                    >
                      <div className="text-[12px] text-stone-800 whitespace-pre-wrap leading-relaxed">
                        {phase.fields[fieldIndex]?.value || ""}
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
  { nr: 1, emoji: "💚", name: "Aad Goedhart", role: "Vader", phone: "+31646102228", primary: true },
  { nr: 2, emoji: "🌹", name: "Roosje Goedhart", role: "Zus", phone: "+31622309990" },
  { nr: 3, emoji: "👩🏼‍🚒", name: "Sanne Goedhart", role: "Tweelingzus", phone: "+31621388020" },
  { nr: 4, emoji: "🍀", name: "Margha Klaver", role: "Mama", phone: "+31617421388" },
];

const inlaws: typeof family = [
  { nr: 0, emoji: "🪚", name: "Sven Morsman", role: "Zwager (Sanne)", phone: "+31614604129" },
  { nr: 0, emoji: "🦌", name: "Niels de Nijs", role: "Zwager (Roosje)", phone: "+31628717258" },
];

const friends: typeof family = [
  { nr: 0, emoji: "🪖", name: "Daan Bruin", role: "", phone: "+31615672234" },
  { nr: 0, emoji: "🔱", name: "Don Mehrow", role: "", phone: "+31636311764" },
];

function ContactRow({ p }: { p: typeof family[0] }) {
  return (
    <div className={`flex items-center justify-between py-3 ${p.primary ? "py-4" : ""}`}>
      <div className="flex items-center gap-3">
        {p.nr > 0 && (
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
            p.nr === 1 ? "bg-phase-0 text-white" :
            p.nr === 2 ? "bg-phase-0-medium text-phase-0" :
            "bg-stone-100 text-stone-500"
          }`}>
            {p.nr}
          </div>
        )}
        <span className="text-xl">{p.emoji}</span>
        <div>
          <div className={`${p.primary ? "text-base font-bold text-stone-900" : "text-sm font-medium text-stone-700"}`}>
            {p.name}
          </div>
          {p.role && (
            <div className={`text-xs ${p.primary ? "text-phase-0 font-semibold uppercase tracking-wide" : "text-stone-400"}`}>
              {p.primary ? "Primair contactpersoon" : p.role}
            </div>
          )}
        </div>
      </div>
      <a
        href={`tel:${p.phone}`}
        className={`font-medium hover:underline tabular-nums ${p.primary ? "text-base text-phase-0" : "text-sm text-phase-0"}`}
      >
        {p.phone.replace("+31", "06 ").replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}
      </a>
    </div>
  );
}

function ProtectorsCard() {
  return (
    <div className="space-y-4">
      {/* Family */}
      <div className="bg-white rounded-2xl border-2 border-phase-0-border bg-phase-0-light p-5 sm:p-6 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-phase-0 mb-3">
          🏡 Familie
        </h2>
        <div className="divide-y divide-phase-0-border/40">
          {family.map((p) => <ContactRow key={p.phone} p={p} />)}
        </div>
      </div>

      {/* In-laws */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400 mb-3">
          💍 Aangetrouwd
        </h2>
        <div className="divide-y divide-stone-100">
          {inlaws.map((p) => <ContactRow key={p.phone} p={p} />)}
        </div>
      </div>

      {/* Friends */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400 mb-3">
          🛡️ Vrienden
        </h2>
        <div className="divide-y divide-stone-100">
          {friends.map((p) => <ContactRow key={p.phone} p={p} />)}
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
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-stone-200 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/avatar.png"
              alt="Daantje Goedhart"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[3px] text-stone-400">🛡️ Bescherm Plan</div>
              <h1 className="font-serif font-bold text-lg text-stone-900">
                🍀 Daantje Goedhart
              </h1>
            </div>
          </div>

          {/* Segmented toggle */}
          <div className="flex bg-stone-100 rounded-xl p-1 border border-stone-200">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                  view === v
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "text-stone-400 hover:text-stone-600 border border-transparent"
                }`}
              >
                {v === "edit" ? "✏️ Invullen" : "👁️ Preview"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {view === "edit" ? (
          <>
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
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
