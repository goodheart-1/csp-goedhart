"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { defaultCSPData, type CSPData, type Phase } from "./csp-data";

const LocationMap = dynamic(() => import("./map"), { ssr: false });
const FacilitiesMap = dynamic(() => import("./map").then(mod => ({ default: mod.FacilitiesMap })), { ssr: false });

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
    <div className={`rounded-xl border border-stone-200/20 ${colors.bg} overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]`} style={{ borderLeftWidth: '4px', borderLeftColor: `var(--color-phase-${phase.colorKey})` }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phase.fields.slice(0, 4).map((field, fieldIndex) => (
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
            {phase.fields.length > 4 && (
              <div className="space-y-1.5">
                <label className={`flex items-center gap-2 text-[13px] font-semibold ${colors.accentText}`}>
                  <span>{phase.fields[4].icon}</span>
                  {phase.fields[4].label}
                </label>
                <div className={`rounded-lg border ${colors.border} bg-white/70 px-4 py-3 text-sm text-stone-800 leading-relaxed`}>
                  <RichText text={phase.fields[4].value || "Nog niet ingevuld"} />
                </div>
              </div>
            )}
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

      {/* Map */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
          Locaties (Live)
        </h2>
        <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
          <LocationMap />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
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

      {/* Facilities map */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
          🏥 Faciliteiten
        </h2>
        <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
          <FacilitiesMap />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400 pt-2">
        <p>Bij crisis: bel crisisdienst GGZ InGeest of huisartsenpost</p>
      </div>
    </div>
  );
}

const family = [
  { nr: 1, emoji: "💚", name: "Aad Goedhart", role: "Vader", subtitle: "Dezelfde brein - begrijpt het als geen ander", phone: "+31646102228", primary: true },
  { nr: 2, emoji: "🍀", name: "Margha Klaver", role: "Mama", subtitle: "Dagelijks contact, check-ins", phone: "+31617421388" },
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
  { nr: 0, emoji: "🎠", name: "Luca Mehrow", role: "", phone: "+31681505806" },
  { nr: 0, emoji: "🌞", name: "Max Zonneveld", role: "", phone: "+31631675943" },
  { nr: 0, emoji: "🦊", name: "Robin Kalmeijer", role: "", phone: "+31626995705" },
  { nr: 0, emoji: "🕺🏽", name: "Samuel Hoekstra", role: "", phone: "+31614986071" },
  { nr: 0, emoji: "💙", name: "Tim Jacobsen", role: "", phone: "+31648880599" },
  { nr: 0, emoji: "🪖", name: "Daan Bruin", role: "", phone: "+31615672234" },
];

const moreGoodFriends: typeof family = [
  { nr: 0, emoji: "🏂", name: "Patrick de Hart", role: "", phone: "+31653676907" },
  { nr: 0, emoji: "🎯", name: "Jan Jaap Rixten", role: "", phone: "+31682914795" },
  { nr: 0, emoji: "💪", name: "Bas Bults", role: "", phone: "+31640502444" },
  { nr: 0, emoji: "🎬", name: "Daaf de Jonge", role: "", phone: "+31627356938" },
  { nr: 0, emoji: "🎵", name: "Jonne Krom", role: "Begrijpt manie uit eigen ervaring", phone: "+31624531189" },
];

const teamClearly: typeof family = [
  { nr: 0, emoji: "🦩", name: "Christoph Rottier", role: "", phone: "+31631239040" },
  { nr: 0, emoji: "🌑", name: "Damien Donker", role: "", phone: "+31628867077" },
  { nr: 0, emoji: "🍱", name: "Jurjen Lanting", role: "", phone: "+31640249983" },
  { nr: 0, emoji: "🌳", name: "Michel Boom", role: "", phone: "+31642653343" },
  { nr: 0, emoji: "🖥️", name: "Miles Jacobs", role: "", phone: "+31624408441" },
  { nr: 0, emoji: "🐏", name: "Mats Rammers", role: "", phone: "+31639899464" },
  { nr: 0, emoji: "🕵🏼‍♂️", name: "Robin Keijzer", role: "", phone: "+31683945615" },
  { nr: 0, emoji: "🧞‍♂️", name: "Stefan Broekman", role: "", phone: "+31621198049" },
];

function ContactCard({ p }: { p: typeof family[0] }) {
  return (
    <a href={`https://wa.me/${p.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-xl p-3 hover:bg-stone-50 transition-colors cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${p.primary ? "bg-phase-0-light border border-stone-200/30" : "border border-stone-200/30"}`}>
      {p.nr > 0 && (
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs shrink-0 ${
          p.nr === 1 ? "bg-phase-0 text-white" :
          p.nr === 2 ? "bg-phase-0-medium text-phase-0" :
          "bg-stone-100 text-stone-500"
        }`}>
          {p.nr}
        </div>
      )}
      <div className="relative shrink-0">
        <img
          src={`/contacts/${p.name}.png`}
          alt={p.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
        />
        <span className="hidden flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-xl">{p.emoji}</span>
        <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] text-[11px]">{p.emoji}</span>
      </div>
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
            {"info" in p && (p as {info?: string}).info && (
              <span className="relative group cursor-help" onClick={(e) => e.preventDefault()}>
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold">i</span>
                <span className="absolute left-0 top-5 w-56 bg-stone-900 text-white text-[11px] rounded-lg px-3 py-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {(p as {info?: string}).info}
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

function CollapsibleGroup({ title, count, children, defaultOpen = false }: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-stone-200/20 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:px-6 cursor-pointer hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
            {title}
          </h2>
          <span className="text-[10px] font-medium text-stone-300 bg-stone-100 px-1.5 py-0.5 rounded-full">{count}</span>
        </div>
        <svg className={`w-4 h-4 text-stone-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function ProtectorsCard() {
  return (
    <div className="space-y-4">
      {/* DNA - Primary contact */}
      <a href={`https://wa.me/31646102228`} target="_blank" rel="noopener noreferrer" className="block bg-phase-0-light rounded-xl border-2 border-phase-0-border p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:brightness-[0.98] transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-phase-0">
            🧬 DNA - Eerste Contactpersoon
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] bg-phase-0 text-white px-2.5 py-1 rounded-full">
            #1 Bel altijd eerst
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img src="/contacts/Aad Goedhart.png" alt="Aad Goedhart" width={56} height={56} className="w-14 h-14 rounded-full object-cover shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] text-sm">💚</span>
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900">Aad Goedhart</div>
            <div className="text-sm text-phase-0 font-semibold">Vader</div>
            <div className="text-xs text-stone-500 mt-0.5">Dezelfde brein - begrijpt het als geen ander</div>
            <div className="text-sm font-medium text-phase-0 tabular-nums mt-1">06 46 10 22 28</div>
          </div>
        </div>
      </a>

      {/* Family */}
      <div className="bg-white rounded-xl border border-stone-200/20 bg-phase-0-light p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-phase-0">
            🩸 Familie
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] bg-phase-0 text-white px-2.5 py-1 rounded-full">
            Altijd #1 prioriteit
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {family.map((p) => <ContactCard key={p.phone} p={p} />)}
        </div>
      </div>

      <CollapsibleGroup title="💍 Aangetrouwd" count={inlaws.length}>
        {inlaws.map((p) => <ContactCard key={p.phone} p={p} />)}
      </CollapsibleGroup>

      <CollapsibleGroup title="👊 Best Brothers" count={friends.length}>
        {friends.map((p) => <ContactCard key={p.phone} p={p} />)}
      </CollapsibleGroup>

      <CollapsibleGroup title="🤙 More Good Friends" count={moreGoodFriends.length}>
        {moreGoodFriends.map((p) => <ContactCard key={p.phone} p={p} />)}
      </CollapsibleGroup>

      <CollapsibleGroup title="🩵 Team Clearly" count={teamClearly.length}>
        {teamClearly.map((p) => <ContactCard key={p.phone} p={p} />)}
      </CollapsibleGroup>
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

        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* View toggle */}
        <div className="flex bg-stone-100/80 rounded-[10px] p-0.5 w-fit">
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

        {view === "edit" ? (
          <>
            {/* Progress */}
            <div className="bg-white rounded-xl border border-stone-200/20 p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
              <ProgressBar phases={data.phases} />
            </div>

            {/* Protectors */}
            <ProtectorsCard />

            {/* Map */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
                Locaties (Live)
              </h2>
              <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
                <LocationMap />
              </div>
            </div>

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

            {/* Facilities map */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
                🏥 Faciliteiten
              </h2>
              <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
                <FacilitiesMap />
              </div>
            </div>
          </>
        ) : (
          <TableView data={data} />
        )}

        {/* Crisis banner */}
        <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-2xl">📞</span>
          <div>
            <div className="text-sm font-bold text-red-700">Noodsituatie of acute crisis?</div>
            <div className="text-sm text-red-600">Bel direct de crisisdienst GGZ InGeest of de huisartsenpost.</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-stone-400 py-4 space-y-1 no-print">
          <p>Bescherm Plan - Print via Cmd+P</p>
        </footer>
      </main>
    </div>
  );
}
