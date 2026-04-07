"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { defaultCSPData, type CSPData, type Phase, experiences } from "./csp-data";
import SleepDashboard from "./sleep-dashboard";

const LocationMap = dynamic(() => import("./map"), { ssr: false });
const FacilitiesMap = dynamic(() => import("./map").then(mod => ({ default: mod.FacilitiesMap })), { ssr: false });

const amstelmerePhotos = Array.from({ length: 11 }, (_, i) => `/amstelmere/${String(i + 1).padStart(2, "0")}.jpg`);

function PhotoGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
        {amstelmerePhotos.map((src, i) => (
          <button key={src} onClick={() => setSelected(i)} className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-400">
            <Image src={src} alt={`Amstelmeren foto ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 33vw, 25vw" />
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl z-10 transition-colors" aria-label="Sluiten">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + 11) % 11); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl z-10 transition-colors" aria-label="Vorige">&lsaquo;</button>
          <button onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % 11); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl z-10 transition-colors" aria-label="Volgende">&rsaquo;</button>
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={amstelmerePhotos[selected]} alt={`Amstelmeren foto ${selected + 1}`} fill className="object-contain" sizes="100vw" priority />
          </div>
          <div className="absolute bottom-4 text-white/40 text-sm">{selected + 1} / {amstelmerePhotos.length}</div>
        </div>
      )}
    </>
  );
}

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

function PhaseCard({
  phase,
  isOpen,
  onToggle,
}: {
  phase: Phase;
  isOpen: boolean;
  onToggle: () => void;
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

      {/* Ervaringen */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
          📖 Ervaringen & Lessen
        </h2>
        {experiences.map((exp) => (
          <div key={exp.facility} className={`rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${exp.verdict === "bad" ? "bg-red-50 border border-red-200/50" : "bg-white border border-stone-200/20"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{exp.emoji}</span>
              <h3 className="text-sm font-bold text-stone-900">{exp.facility}</h3>
            </div>
            <div className={`text-sm font-medium mb-2 ${exp.verdict === "bad" ? "text-red-700" : "text-phase-0"}`}>
              {exp.summary}
            </div>
            <div className="text-[13px] text-stone-600 leading-relaxed whitespace-pre-wrap">
              {exp.details}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400 pt-2">
        <p>Bij crisis: bel crisisdienst GGZ InGeest of huisartsenpost</p>
      </div>
    </div>
  );
}

const family = [
  { nr: 1, emoji: "💚", name: "Aad Goedhart", role: "Papa / Vader", subtitle: "Hetzelfde brein - begrijpt het als geen ander", phone: "+31646102228", primary: true },
  { nr: 2, emoji: "🍀", name: "Margha Klaver", role: "Mama / Moeder", subtitle: "Dagelijks contact, check-ins", phone: "+31617421388" },
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
          loading="lazy"
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
        <div className="text-sm font-medium text-phase-0 tabular-nums mt-0.5 whitespace-nowrap">
          {p.phone.replace(/^\+316(\d{2})(\d{2})(\d{2})(\d{2})$/, "+316 $1 $2 $3 $4")}
        </div>
      </div>
    </a>
  );
}

function CollapsibleGroup({ title, count, children, defaultOpen = false }: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const groupId = title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  return (
    <div className="bg-white rounded-xl border border-stone-200/20 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`group-${groupId}-content`}
        className="w-full flex items-center justify-between p-4 sm:px-6 cursor-pointer hover:bg-stone-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
            {title}
          </h2>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">{count}</span>
        </div>
        <svg className={`w-4 h-4 text-stone-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div id={`group-${groupId}-content`} className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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
      {/* DNA - Familie */}
      <div className="bg-phase-0-light rounded-xl border-2 border-phase-0-border p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-phase-0">
            🧬 DNA - Familie
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] bg-phase-0 text-white px-2.5 py-1 rounded-full">
            #1 Bel altijd eerst
          </span>
        </div>

        {/* Parents - XY & XX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <a href="https://wa.me/31646102228" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/50 transition-colors cursor-pointer">
            <div className="relative shrink-0">
              <img src="/contacts/Aad Goedhart.png" alt="Aad Goedhart" width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
              <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 border border-blue-200 shadow-[0_1px_2px_rgba(0,0,0,0.15)] text-[10px] font-bold text-blue-600 font-mono">XY</span>
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900">Aad Goedhart 💚</div>
              <div className="text-sm text-phase-0 font-semibold">Papa / Vader</div>
              <div className="text-xs text-stone-500 mt-0.5">Hetzelfde brein - begrijpt het als geen ander</div>
              <div className="text-sm font-medium text-phase-0 tabular-nums mt-1 whitespace-nowrap">+316 46 10 22 28</div>
            </div>
          </a>
          <a href="https://wa.me/31617421388" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/50 transition-colors cursor-pointer">
            <div className="relative shrink-0">
              <img src="/contacts/Margha Klaver.png" alt="Margha Klaver" width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
              <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-pink-50 border border-pink-200 shadow-[0_1px_2px_rgba(0,0,0,0.15)] text-[10px] font-bold text-pink-600 font-mono">XX</span>
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900">Margha Klaver 🍀</div>
              <div className="text-sm text-phase-0 font-semibold">Mama / Moeder</div>
              <div className="text-xs text-stone-500 mt-0.5">Dagelijks contact, check-ins</div>
              <div className="text-sm font-medium text-phase-0 tabular-nums mt-1 whitespace-nowrap">+316 17 42 13 88</div>
            </div>
          </a>
        </div>

        {/* Siblings */}
        <div className="border-t border-phase-0-border/30 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {family.filter(p => p.nr >= 3).map((p) => <ContactCard key={p.phone} p={p} />)}
          </div>
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

const sections = [
  { id: "intro", emoji: "👋", label: "Intro" },
  { id: "protectors", emoji: "🛡️", label: "Protectors" },
  { id: "phases", emoji: "📊", label: "Fases" },
  { id: "facilities", emoji: "🏥", label: "Faciliteiten" },
  { id: "experiences", emoji: "📖", label: "Ervaringen" },
  { id: "sleep", emoji: "😴", label: "Slaap" },
  { id: "locations", emoji: "📍", label: "Locaties" },
  { id: "crisis", emoji: "📞", label: "Crisis" },
] as const;

function SideNav() {
  const [active, setActive] = useState("intro");
  const clicking = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (clicking.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    clicking.current = true;
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { clicking.current = false; }, 800);
  };

  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-1 pl-2 no-print" aria-label="Secties">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          className={`group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-r-lg text-xs font-medium transition-all duration-200 cursor-pointer
            ${active === s.id
              ? "bg-white shadow-md text-stone-900 border border-stone-200/60 border-l-2 border-l-phase-0"
              : "text-stone-400 hover:text-stone-600 hover:bg-white/60 border border-transparent"
            }`}
        >
          <span className="text-sm">{s.emoji}</span>
          <span className={`transition-all duration-200 ${active === s.id ? "opacity-100 max-w-24" : "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-24"}`}>
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export default function Home() {
  const [data] = useState<CSPData>(defaultCSPData);
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

  const expandAll = () => setOpenPhases(new Set([0, 1, 2, 3]));
  const collapseAll = () => setOpenPhases(new Set());

  return (
    <div className="flex-1 flex flex-col">
      <a href="#main-content" className="skip-link">Ga naar inhoud</a>
      <SideNav />

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
        {/* Intro Hero */}
        <div id="intro" className="bg-white rounded-2xl border border-stone-200/20 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] scroll-mt-20">
          {/* Hero photo banner */}
          <div className="relative h-36 sm:h-44 overflow-hidden">
            <Image src="/intro/banner.jpg" alt="Daantje Goedhart YouTube banner" fill className="object-cover object-center" sizes="100vw" priority />
          </div>

          {/* Avatar overlapping banner */}
          <div className="relative px-5 sm:px-8 -mt-14">
            <Image
              src="/avatar.png"
              alt="Daantje Goedhart"
              width={112}
              height={112}
              className="rounded-full object-cover ring-4 ring-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            />
          </div>

          {/* Content */}
          <div className="px-5 sm:px-8 pb-6 pt-3">
            <h2 className="text-2xl font-bold text-stone-900">Daantje Goedhart</h2>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              Oprichter van{" "}
              <a href="https://clearly.nl/pages/our-goal" target="_blank" rel="noopener noreferrer" className="text-phase-0 font-medium hover:underline">Clearly</a>
              {" "}- een gezondheidsmerk dat duidelijkheid brengt in supplementen en welzijn. Dit is mijn persoonlijk beschermplan. Soms ga ik in overdrive - dat noemen ze dan een "manie". Dat heb ik 1x meegemaakt in mijn leven, en dat hou ik graag zo. Dit plan is er zodat de mensen om mij heen weten wat ze kunnen doen.
            </p>
            <p className="text-sm text-stone-400 mt-2 leading-relaxed">
              Het beste is gewoon met me praten. Maar ik ben sinds mijn 16e ondernemer en ga soms sneller dan een ander - ik heb moeite om iemands tempo te spiegelen. Mijn kanalen hieronder geven extra context over wie ik ben en hoe ik denk. Uiteindelijk zijn we allemaal anders.
            </p>
            <p className="text-sm text-stone-400 mt-2 leading-relaxed">
              Je hebt mannen van weinig woorden. Je hebt ze van veel woorden. Van heel veel. En nog meer. Ik zit daar ergens boven, soms. Dat is niet nieuw. Dat heb ik al heel mn leven. Ik heb tientallen dagboeken volgeschreven. Je moet wat als je bij niemand je gedachtens echt kwijt kan. Ik heb duizenden uren spraakmemos naar mezelf, dat doe ik al 8 jaar. Iedereen is anders.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: "YouTube", username: "@DaantjeGoedhart", href: "https://www.youtube.com/@DaantjeGoedhart", color: "bg-red-50 text-red-600 hover:bg-red-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { label: "Instagram", username: "@daantjegoedhart", href: "https://www.instagram.com/daantjegoedhart", color: "bg-pink-50 text-pink-600 hover:bg-pink-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { label: "TikTok", username: "@daantjegoedhart", href: "https://www.tiktok.com/@daantjegoedhart", color: "bg-purple-50 text-purple-600 hover:bg-purple-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
                { label: "X", username: "@DaantjeGoedhart", href: "https://x.com/DaantjeGoedhart", color: "bg-stone-100 text-stone-600 hover:bg-stone-200", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: "LinkedIn", username: "daantje-goedhart", href: "https://nl.linkedin.com/in/daantje-goedhart-3b841b152", color: "bg-blue-50 text-blue-700 hover:bg-blue-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer ${s.color}`}>
                  {s.icon}
                  <span>{s.label}{s.username && <span className="opacity-60 ml-0.5">{s.username}</span>}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Clearly */}
        <div className="rounded-xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-blue-100" style={{ background: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 50%, #ffffff 100%)" }}>
          <div className="flex items-start gap-4 sm:gap-5">
            <a href="https://www.instagram.com/clearlynl/" target="_blank" rel="noopener noreferrer" className="shrink-0">
              <img src="/clearly-logo.jpg" alt="Clearly" width={56} height={56} className="rounded-xl object-cover shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.15)] transition-shadow" />
            </a>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#1e3a5f]">Clearly</h2>
              <p className="text-sm text-[#1e3a5f]/60 mt-0.5 italic">Your Health is Clearly #1.</p>
              <p className="text-sm text-[#1e3a5f]/50 mt-2 leading-relaxed">Gezondheidsmerk opgericht door Daantje. Missie: maak gezondheid duidelijk, zodat jij je #1 leven kunt leiden. Geen verborgen formules, geen vage claims - alleen duidelijkheid, kwaliteit en intentie.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { label: "clearly.nl", href: "https://clearly.nl", color: "bg-[#1e3a5f] text-white hover:bg-[#2a4d7a]", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
                  { label: "Instagram", username: "@clearlynl", href: "https://www.instagram.com/clearlynl/", color: "bg-pink-50 text-pink-600 hover:bg-pink-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                  { label: "TikTok", username: "@clearlynl", href: "https://www.tiktok.com/@clearlynl", color: "bg-purple-50 text-purple-600 hover:bg-purple-100", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
                  { label: "Facebook", username: "/clearlynl", href: "https://www.facebook.com/clearlynl/", color: "bg-blue-600 text-white hover:bg-blue-700", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${s.color}`}>
                    {s.icon}
                    <span>{s.label}{s.username && <span className="opacity-60 ml-0.5">{s.username}</span>}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Protectors */}
            <div id="protectors" className="scroll-mt-20"><ProtectorsCard /></div>

        {/* View toggle */}
        <div id="phases" className="flex items-center justify-between no-print scroll-mt-20">
          <div className="flex bg-stone-100/80 rounded-[10px] p-0.5" role="group" aria-label="Weergave wisselen">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
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
          {view === "edit" && (
            <div className="flex items-center gap-2">
              <button onClick={expandAll} className="text-xs text-stone-500 hover:text-stone-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded">Alles openen</button>
              <span className="text-stone-300" aria-hidden="true">|</span>
              <button onClick={collapseAll} className="text-xs text-stone-500 hover:text-stone-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded">Alles sluiten</button>
            </div>
          )}
        </div>

        {view === "edit" ? (
          <>
            {/* Phase cards */}
            <div className="space-y-4">
              {data.phases.map((phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  isOpen={openPhases.has(phase.id)}
                  onToggle={() => togglePhase(phase.id)}
                />
              ))}
            </div>

            {/* Facilities map */}
            <div id="facilities" className="space-y-2 scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
                🏥 Faciliteiten
              </h2>
              <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
                <FacilitiesMap />
              </div>
            </div>

            {/* Ervaringen */}
            <div id="experiences" className="space-y-3 scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
                📖 Ervaringen & Lessen
              </h2>
              {experiences.map((exp) => (
                <div key={exp.facility} className={`rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${exp.verdict === "bad" ? "bg-red-50 border border-red-200/50" : "bg-white border border-stone-200/20"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{exp.emoji}</span>
                    <h3 className="text-sm font-bold text-stone-900">{exp.facility}</h3>
                  </div>
                  <div className={`text-sm font-medium mb-2 ${exp.verdict === "bad" ? "text-red-700" : "text-phase-0"}`}>
                    {exp.summary}
                  </div>
                  <div className="text-[13px] text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {exp.details}
                  </div>
                  {exp.verdict === "bad" && <PhotoGallery />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <TableView data={data} />
        )}

        {/* Sleep & Recovery */}
            <div id="sleep" className="scroll-mt-20"><SleepDashboard /></div>

            {/* Map */}
            <div id="locations" className="space-y-2 scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
                Locaties (Live)
              </h2>
              <div className="rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/20 ring-1 ring-inset ring-black/5">
                <LocationMap />
              </div>
            </div>

        {/* Crisis banner */}
        <div id="crisis" className="bg-red-50 border border-red-200/50 rounded-xl p-5 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] scroll-mt-20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div className="text-sm font-bold text-red-700">Noodsituatie of acute crisis?</div>
          </div>
          <div className="text-sm text-red-600 space-y-1">
            <p>Bel de <strong>crisisdienst GGZ InGeest</strong> of de <strong>huisartsenpost</strong> (0900-1515).</p>
          </div>
          <div className="bg-red-100/60 rounded-lg p-3 text-[13px] text-red-800 space-y-2">
            <p><strong>112 alleen bij direct fysiek gevaar</strong> - als iemand zichzelf of een ander kan verwonden en niemand de situatie onder controle heeft. In alle andere gevallen: bel eerst Aad (vader), dan de crisisdienst. Politie en ambulance zijn niet getraind op manie en kunnen de situatie verergeren door dwangmiddelen en vervoer naar een willekeurige instelling.</p>
          </div>
        </div>

        {/* P.S. */}
        <div className="bg-phase-0-light border border-phase-0-border rounded-xl p-5 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-bold text-phase-0">P.S. van Daantje 🍀</div>
          <div className="text-[13px] text-stone-700 leading-relaxed space-y-2">
            <p>😄 Ik leef het gelukkigste leven dat ik me kan voorstellen. Elke ochtend word ik blij wakker. Ik heb de vetste mensen om me heen, twee hondjes die me elke dag laten lachen en die voor mij de beste vorm van meditatie zijn 🐕🐕, en werk waar ik 111% in geloof. Wil je mij tot rust krijgen? Geef me Lotje om te knuffelen. Dat werkt beter dan wat dan ook.</p>
            <p>🩵 Clearly draait allang niet meer alleen om mij. Het draait niet meer om mijn team, niet meer om mijn familie, en ook niet meer om hun families. Het draait om de aarde 🌍. Ik wil echt helpen om deze planeet een mooiere plek te maken - voor alle mensen, alle dieren, al het leven.</p>
            <p>🌱 Klinkt dat delusional? Misschien. Maar ik geloof dat als we stapje voor stapje zetten, we het kunnen. Met z'n allen. Alle mensen. Dat is de missie, en ik zou die voor <strong>niks</strong> ter wereld opgeven.</p>
          </div>
          <div className="text-[13px] text-stone-700 leading-relaxed">
            <p>📋 Waarom dit plan dan? Niet voor mij. Als het misgaat voel ik me juist fantastisch - dat is het hele punt van manie. Dit plan is er zodat de mensen om me heen weten wat ze moeten doen als <em>zij</em> zich zorgen maken, zonder in paniek te raken. Hoe beter zij voorbereid zijn, hoe rustiger het blijft voor iedereen. 💚</p>
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
