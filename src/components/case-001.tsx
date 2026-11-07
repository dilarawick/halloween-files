import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  CASE,
  CASE_STORAGE_KEY,
  EVIDENCE,
  INITIAL_ACCUSATION,
  SOLUTION,
  SUSPECTS,
  TIMELINE,
  studySceneImg,
  type AccusationInput,
  type EvidenceId,
  type SuspectId,
} from "@/data/case-001";

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
type SavedState = {
  discovered: EvidenceId[];
  inspected: EvidenceId[];
  questioned: Partial<Record<SuspectId, string[]>>;
  presented: Partial<Record<SuspectId, EvidenceId[]>>;
  connections: string[];
  notes: string;
  selectedTimeline: number[];
  accusation: AccusationInput;
  submitted: boolean;
};

const freshState = (): SavedState => ({
  discovered: [],
  inspected: [],
  questioned: {},
  presented: {},
  connections: [],
  notes: "",
  selectedTimeline: [],
  accusation: { ...INITIAL_ACCUSATION },
  submitted: false,
});

function readState(): SavedState {
  if (typeof window === "undefined") return freshState();
  try {
    const raw = window.localStorage.getItem(CASE_STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...freshState(),
      ...parsed,
      accusation: { ...INITIAL_ACCUSATION, ...(parsed.accusation ?? {}) },
    };
  } catch {
    return freshState();
  }
}

function writeState(state: SavedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CASE_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("case-001-updated"));
}

function useCaseState() {
  const [state, setState] = useState<SavedState>(freshState);

  useEffect(() => {
    setState(readState());
    const sync = () => setState(readState());
    window.addEventListener("storage", sync);
    window.addEventListener("case-001-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("case-001-updated", sync);
    };
  }, []);

  const update = useCallback((fn: (s: SavedState) => SavedState) => {
    setState((prev) => {
      const next = fn(prev);
      writeState(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = freshState();
    writeState(next);
    setState(next);
  }, []);

  return { state, update, reset };
}

/* ─────────────────────────────────────────
   STAGE DEFINITIONS
───────────────────────────────────────── */
const STAGES = [
  { id: "s-briefing",   label: "Scene",     num: "01" },
  { id: "s-evidence",   label: "Evidence",  num: "02" },
  { id: "s-suspects",   label: "Suspects",  num: "03" },
  { id: "s-timeline",   label: "Timeline",  num: "04" },
  { id: "s-accusation", label: "Accuse",    num: "05" },
] as const;

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */

/** Atmospheric fog bands */
function FogLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div
        className="absolute bottom-0 left-0 w-[200%] h-48 animate-fog-pan opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 100%, #7c3aed55 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 70% 100%, #f9731622 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/2 left-0 w-[180%] h-32 animate-fog-pan opacity-10"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, #4c1d9544 0%, transparent 70%)",
          animationDelay: "5s",
          animationDuration: "24s",
        }}
      />
    </div>
  );
}

/** Floating embers */
function EmberField() {
  const [embers, setEmbers] = useState<{ x: number; delay: number; size: number; color: string }[]>([]);
  useEffect(() => {
    setEmbers(
      Array.from({ length: 16 }, (_, i) => ({
        x: Math.random() * 100,
        delay: Math.random() * 8,
        size: 2 + Math.random() * 2.5,
        color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#fbbf24" : "#ef4444",
      })),
    );
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-drift-fall"
          style={{
            left: `${e.x}%`,
            bottom: 0,
            width: e.size,
            height: e.size,
            background: e.color,
            animationDelay: `${e.delay}s`,
            animationDuration: `${7 + Math.random() * 6}s`,
            boxShadow: `0 0 ${e.size * 2}px ${e.color}`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/** White clean button — no border, no glass */
function PlainBtn({
  children,
  onClick,
  disabled,
  active,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-5 py-2 text-xs font-heading font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer select-none",
        active
          ? "bg-[#f97316] text-[#0a0410]"
          : "bg-white text-[#0a0410] hover:bg-[#f97316] hover:text-[#0a0410]",
        disabled && "opacity-30 pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Stage section heading bar */
function StageHeading({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-display text-5xl font-black text-white/8 select-none leading-none">{num}</span>
      <div>
        <div className="font-heading text-[10px] text-[#f97316] uppercase tracking-[0.3em] font-bold">
          Stage {num}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
          {label}
        </h2>
      </div>
      <div className="flex-1 h-px bg-[#2b1845]" />
    </div>
  );
}

/** Scanline image with forensic inspection mode */
function ScanlineImage({ src, alt, inspecting }: { src: string; alt: string; inspecting: boolean }) {
  return (
    <div className="relative w-full aspect-[16/11] overflow-hidden bg-[#0c0615] rounded-sm">
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-all duration-700",
          inspecting && "brightness-110 contrast-110 saturate-50",
        )}
      />
      {inspecting && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(249,115,22,0.04) 2px, rgba(249,115,22,0.04) 4px)",
            }}
          />
          <div
            className="absolute left-0 right-0 h-0.5 animate-scanline pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #f97316, transparent)" }}
          />
          <div className="absolute top-3 right-3 font-heading text-[10px] text-[#f97316] tracking-widest uppercase animate-pulse-glow px-2 py-1 bg-black/70">
            Scanning
          </div>
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#f97316]" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#f97316]" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#f97316]" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#f97316]" />
        </>
      )}
    </div>
  );
}

/** Suspect portrait dossier card */
function DossierCard({
  suspect,
  isActive,
  onClick,
}: {
  suspect: (typeof SUSPECTS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col text-left overflow-hidden rounded-sm transition-all duration-300 cursor-pointer w-28 shrink-0",
        isActive ? "ring-2 ring-[#f97316] scale-105" : "opacity-60 hover:opacity-100 hover:scale-105",
      )}
    >
      <div className="relative aspect-[3/4] w-full bg-[#0c0615] overflow-hidden">
        <img
          src={suspect.image}
          alt={suspect.name}
          className="h-full w-full object-cover object-top"
        />
        {isActive && <div className="absolute inset-0 ring-inset ring-2 ring-[#f97316]" />}
      </div>
      <div className="bg-[#07030f] px-2 py-1.5">
        <p className="font-heading text-[9px] text-white font-bold uppercase tracking-wide truncate">{suspect.name}</p>
        <p className="font-heading text-[8px] text-[#f97316] uppercase truncate">{suspect.role}</p>
      </div>
    </button>
  );
}

/** Contradiction pulse block */
function ContradictionBlock({
  evidenceId,
  prompt,
  response,
  isConflict,
}: {
  evidenceId: string;
  prompt: string;
  response: string;
  isConflict: boolean;
}) {
  return (
    <div
      className={cn("rounded-sm p-4 text-xs", isConflict && "animate-tension-pulse")}
      style={{
        background: isConflict ? "#1a0404" : "#07030f",
        borderLeft: `2px solid ${isConflict ? "#ef4444" : "#391e60"}`,
      }}
    >
      <div className="flex items-center justify-between font-heading text-[10px] uppercase font-bold mb-1.5">
        <span className="text-[#f97316]">{evidenceId}</span>
        {isConflict && <span className="text-red-400 tracking-widest">Contradiction</span>}
      </div>
      <p className="text-[#f97316]/70 italic mb-1">{prompt}</p>
      <p className="text-foreground/80 leading-relaxed">"{response}"</p>
    </div>
  );
}

/** Dramatic solution reveal */
function SolutionReveal({
  score,
  checks,
  onReset,
}: {
  score: number;
  checks: { label: string; ok: boolean; detail: string }[];
  onReset: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  const accusedCorrectly = checks[0]?.ok;

  return (
    <div
      className="mt-8 rounded-sm p-6 md:p-10 space-y-6 transition-all duration-700"
      style={{
        background: "#07030f",
        borderLeft: `4px solid ${accusedCorrectly ? "#f97316" : "#391e60"}`,
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div
            className="inline-block font-heading text-[11px] tracking-[0.3em] uppercase font-bold px-3 py-1 mb-3"
            style={{ background: accusedCorrectly ? "#f97316" : "#391e60", color: accusedCorrectly ? "#0a0410" : "#fff" }}
          >
            {accusedCorrectly ? "Case Closed" : "Investigation Incomplete"}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
            Perpetrator: {SOLUTION.responsibleName}
          </h3>
        </div>
        <div className="text-right">
          <div className="font-heading text-[10px] uppercase text-muted-foreground mb-1">Verdict Score</div>
          <div className="font-display text-4xl font-black text-[#f97316]">
            {score}<span className="text-xl text-muted-foreground">/{checks.length}</span>
          </div>
          {score === checks.length && (
            <div className="font-heading text-[10px] uppercase text-emerald-400 mt-1 tracking-wider">Perfect</div>
          )}
        </div>
      </div>

      {/* Clue checks */}
      <div className="grid gap-2 sm:grid-cols-2">
        {checks.map((c, i) => (
          <div
            key={c.label}
            className="p-4 text-xs rounded-sm"
            style={{
              background: c.ok ? "#061a0e" : "#0c0615",
              borderLeft: `2px solid ${c.ok ? "#10b981" : "#391e60"}`,
              transition: `opacity 0.4s ease ${i * 120}ms, transform 0.4s ease ${i * 120}ms`,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            <div className="font-heading font-bold uppercase text-white flex items-center gap-2 mb-1">
              <span className={c.ok ? "text-emerald-400" : "text-muted-foreground"}>{c.ok ? "✓" : "—"}</span>
              {c.label}
            </div>
            <p className="text-muted-foreground leading-relaxed">{c.detail}</p>
          </div>
        ))}
      </div>

      {/* Full narrative */}
      <div
        className="space-y-4 pt-4 text-sm"
        style={{
          borderTop: "1px solid #2b1845",
          transition: "opacity 1s ease 0.6s",
          opacity: revealed ? 1 : 0,
        }}
      >
        {[
          ["Motive", SOLUTION.motive],
          ["What Happened", SOLUTION.whatHappened],
          ["Who Left the Footprints", SOLUTION.whoLeftFootprints],
        ].map(([heading, text]) => (
          <div key={heading}>
            <span className="font-heading text-[11px] text-[#f97316] uppercase font-bold tracking-wider">{heading}</span>
            <p className="mt-1.5 text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 flex gap-3 flex-wrap" style={{ borderTop: "1px solid #2b1845" }}>
        <PlainBtn onClick={onReset}>Reset Mystery</PlainBtn>
        <PlainBtn
          active
          onClick={() => {
            const el = document.getElementById("s-briefing");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Review From Start
        </PlainBtn>
      </div>
    </div>
  );
}

/** Vertical expanding timeline */
function VerticalTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="relative ml-4 md:ml-10">
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, #f97316, #391e60, transparent)" }}
      />
      <div className="space-y-0">
        {TIMELINE.map((t, idx) => {
          const isOpen = expanded === idx;
          return (
            <div key={t.time} className="relative pl-8 pb-10">
              {/* Dot */}
              <div
                className={cn(
                  "absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-300",
                  isOpen ? "border-[#f97316] bg-[#f97316] scale-125" : "border-[#391e60] bg-[#0c0615]",
                )}
              />
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : idx)}
                className="group flex flex-col gap-0.5 cursor-pointer text-left w-full"
              >
                <span className="font-heading text-[11px] text-[#f97316] uppercase tracking-widest font-bold">
                  {t.time}
                </span>
                <span
                  className={cn(
                    "font-heading text-sm font-semibold uppercase tracking-wide transition-colors",
                    isOpen ? "text-white" : "text-foreground/70 group-hover:text-white",
                  )}
                >
                  {t.event}
                </span>
                <span className="font-heading text-[10px] text-muted-foreground uppercase">
                  Source: {t.source}
                </span>
              </button>
              {/* Expandable note */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  isOpen ? "max-h-72 opacity-100 mt-3" : "max-h-0 opacity-0",
                )}
              >
                <div
                  className="p-4 text-sm text-foreground/80 leading-relaxed rounded-sm"
                  style={{ background: "#0c0615", borderLeft: "2px solid #f97316" }}
                >
                  {t.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STICKY SCROLL-SPY NAV
───────────────────────────────────────── */
function StageNav() {
  const [activeId, setActiveId] = useState<string>(STAGES[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios: Record<string, number> = {};

    STAGES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[id] = entry.intersectionRatio;
          // pick whichever section has highest visibility
          const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
          if (best && best[1] > 0) setActiveId(best[0]);
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: "-60px 0px -20% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-[68px] z-40 bg-[#0d0715] border-b border-[#2b1845] px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <span className="font-heading text-[10px] tracking-[0.25em] text-[#f97316] uppercase font-bold hidden sm:block">
          The Halloween Files · Case 001
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {STAGES.map((s) => (
            <PlainBtn
              key={s.id}
              onClick={() => scrollTo(s.id)}
              active={activeId === s.id}
            >
              <span className="opacity-50 mr-1">{s.num}.</span>
              {s.label}
            </PlainBtn>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function CaseInvestigationSection() {
  const { state, update, reset } = useCaseState();

  const discovered = useMemo(() => new Set(state.discovered), [state.discovered]);

  /* Evidence section state */
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const activeEvidence = EVIDENCE[activeEvidenceIndex];

  /* Suspects section state */
  const [activeSuspectIndex, setActiveSuspectIndex] = useState(0);
  const activeSuspect = SUSPECTS[activeSuspectIndex];
  const asked = state.questioned[activeSuspect.id] ?? [];
  const presented = state.presented[activeSuspect.id] ?? [];

  /* Accusation scoring */
  const checks = SOLUTION.keyClueChecks.map((c) => ({ ...c, ok: c.met(state.accusation) }));
  const score = checks.filter((c) => c.ok).length;

  const discover = (id: EvidenceId) =>
    update((s) => ({
      ...s,
      discovered: s.discovered.includes(id) ? s.discovered : [...s.discovered, id],
      inspected: s.inspected.includes(id) ? s.inspected : [...s.inspected, id],
    }));

  const ask = (q: string) =>
    update((s) => {
      const prev = s.questioned[activeSuspect.id] ?? [];
      return prev.includes(q)
        ? s
        : { ...s, questioned: { ...s.questioned, [activeSuspect.id]: [...prev, q] } };
    });

  const present = (evidenceId: EvidenceId) => {
    if (!discovered.has(evidenceId)) return;
    update((s) => {
      const prev = s.presented[activeSuspect.id] ?? [];
      return prev.includes(evidenceId)
        ? s
        : { ...s, presented: { ...s.presented, [activeSuspect.id]: [...prev, evidenceId] } };
    });
  };

  const handleScan = () => {
    setScanning(true);
    discover(activeEvidence.id);
    setTimeout(() => setScanning(false), 3200);
  };

  /* ─── inner layout constants ─── */
  const panelBg = { background: "#0c0615" } as React.CSSProperties;
  const inset = { background: "#07030f", borderLeft: "2px solid #391e60" } as React.CSSProperties;
  const insetOrange = { background: "#07030f", borderLeft: "2px solid #f97316" } as React.CSSProperties;
  const divider = { borderTop: "1px solid #2b1845" } as React.CSSProperties;

  return (
    <div id="investigation" className="relative w-full bg-[#0b0612] text-foreground overflow-hidden">
      {/* Atmospheric layer — fixed to the outer wrapper */}
      <div className="relative">
        <FogLayer />
        <EmberField />
      </div>

      {/* ─── Scroll-spy sticky nav ─── */}
      <StageNav />

      {/* ══════════════════════════════════════════
          STAGE 01 — SCENE BRIEFING
      ══════════════════════════════════════════ */}
      <section id="s-briefing" className="relative z-10 w-full px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <StageHeading num="01" label="Scene Briefing" />

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Scene photo */}
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-sm bg-[#140b22]">
              <img
                src={studySceneImg}
                alt="Oliver Reed's locked study"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#8b1515] text-white px-3 py-1 font-heading text-[10px] uppercase tracking-widest font-bold">
                Police Sealed
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                <span className="font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold">Location</span>
                <div className="font-heading text-sm font-bold text-white">Oliver Reed's Locked Study</div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-sm p-8 md:p-10 flex flex-col gap-6" style={panelBg}>
              <div>
                <div className="font-heading text-[10px] tracking-[0.3em] text-[#f97316] uppercase font-bold mb-3">
                  Case 001 · Dossier
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white leading-tight">
                  The Locked Study
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                  On 31 October, 24-year-old Oliver Reed disappeared from his study during a loud Halloween party at Blackwood House. The door was locked from the inside. His phone was left on the desk. The grandfather clock had stopped.
                </p>
              </div>

              {/* Final message */}
              <div className="p-5 rounded-sm" style={insetOrange}>
                <span className="font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold block mb-1.5">
                  Oliver's Final Message — 10:55 PM
                </span>
                <p className="text-sm font-heading italic text-white/90">
                  "If anything happens tonight, check the clock."
                </p>
              </div>

              {/* Discovery list */}
              <div className="space-y-2">
                {CASE.discovery.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f97316] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3" style={divider}>
                <PlainBtn
                  active
                  onClick={() => document.getElementById("s-evidence")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Examine Evidence
                </PlainBtn>
                <PlainBtn
                  onClick={() => document.getElementById("s-suspects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Skip to Suspects
                </PlainBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 md:mx-12 h-px bg-[#2b1845]" />

      {/* ══════════════════════════════════════════
          STAGE 02 — EVIDENCE LOCKER
      ══════════════════════════════════════════ */}
      <section id="s-evidence" className="relative z-10 w-full px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <StageHeading num="02" label="Evidence Locker" />

          {/* Evidence selector */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {EVIDENCE.map((e, idx) => {
              const isSelected = activeEvidenceIndex === idx;
              const isFound = discovered.has(e.id);
              return (
                <PlainBtn
                  key={e.id}
                  onClick={() => { setActiveEvidenceIndex(idx); discover(e.id); }}
                  active={isSelected}
                >
                  <span className="opacity-50 mr-1">{e.id}:</span>
                  {e.name}
                  {isFound && <span className="ml-1.5 text-emerald-500">✓</span>}
                </PlainBtn>
              );
            })}
            <PlainBtn onClick={() => update((s) => ({ ...s, discovered: EVIDENCE.map((e) => e.id) }))}>
              Mark All Found
            </PlainBtn>
          </div>

          {/* Evidence display */}
          <div className="grid lg:grid-cols-2 gap-8 items-start rounded-sm p-6 md:p-8" style={panelBg}>
            {/* Scanline image */}
            <div>
              <ScanlineImage src={activeEvidence.image} alt={activeEvidence.name} inspecting={scanning} />
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <PlainBtn onClick={handleScan} active={scanning}>
                  {scanning ? "Scanning…" : "Scan Clue"}
                </PlainBtn>
                <span className="font-heading text-[10px] text-muted-foreground uppercase">
                  Found at: <span className="text-[#f97316]">{activeEvidence.discoveredAt}</span>
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5">
              <div>
                <div className="font-heading text-[10px] tracking-widest text-[#f97316] uppercase font-bold mb-1">
                  Forensic Exhibit · {activeEvidence.id}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
                  {activeEvidence.name}
                </h3>
                <div className="font-heading text-[10px] text-muted-foreground uppercase mt-1">
                  {activeEvidence.tag}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{activeEvidence.description}</p>
              </div>

              <div className="p-5 rounded-sm" style={inset}>
                <h4 className="font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold mb-3">
                  Key Observations
                </h4>
                <ul className="space-y-2.5">
                  {activeEvidence.inspection.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f97316] shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4" style={divider}>
                <div className="flex gap-2">
                  <PlainBtn
                    disabled={activeEvidenceIndex === 0}
                    onClick={() => setActiveEvidenceIndex((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </PlainBtn>
                  <PlainBtn
                    disabled={activeEvidenceIndex === EVIDENCE.length - 1}
                    onClick={() => setActiveEvidenceIndex((p) => Math.min(EVIDENCE.length - 1, p + 1))}
                  >
                    Next
                  </PlainBtn>
                </div>
                <PlainBtn
                  active
                  onClick={() => document.getElementById("s-suspects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Continue to Suspects
                </PlainBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-6 md:mx-12 h-px bg-[#2b1845]" />

      {/* ══════════════════════════════════════════
          STAGE 03 — INTERROGATIONS
      ══════════════════════════════════════════ */}
      <section id="s-suspects" className="relative z-10 w-full px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <StageHeading num="03" label="Interrogations" />

          {/* Dossier card strip */}
          <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
            {SUSPECTS.map((s, idx) => (
              <DossierCard
                key={s.id}
                suspect={s}
                isActive={activeSuspectIndex === idx}
                onClick={() => setActiveSuspectIndex(idx)}
              />
            ))}
          </div>

          {/* Interrogation room */}
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start rounded-sm p-6 md:p-8" style={panelBg}>
            {/* Left: portrait + alibi */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#07030f]">
                <img
                  src={activeSuspect.image}
                  alt={activeSuspect.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute top-3 left-3 font-heading text-[9px] text-[#f97316] uppercase tracking-widest font-bold bg-black/80 px-2 py-1">
                  {activeSuspect.status}
                </div>
              </div>

              <div className="p-4 text-xs rounded-sm" style={inset}>
                <div className="font-heading text-[10px] text-[#f97316] uppercase font-bold mb-1">Stated Alibi</div>
                <div className="text-white font-medium text-sm mb-1">{activeSuspect.alibiTime}</div>
                <p className="text-muted-foreground italic leading-relaxed">"{activeSuspect.claim}"</p>
              </div>

              {activeSuspect.contradictionHint && (
                <div
                  className="p-4 text-xs animate-tension-pulse rounded-sm"
                  style={{ background: "#1a0404", borderLeft: "2px solid #ef4444" }}
                >
                  <div className="font-heading text-[10px] text-red-400 uppercase font-bold mb-1">
                    Alibi Inconsistency
                  </div>
                  <p className="text-red-200/80 leading-relaxed">{activeSuspect.contradictionHint}</p>
                </div>
              )}
            </div>

            {/* Right: interrogation console */}
            <div className="space-y-6">
              <div>
                <div className="font-heading text-[10px] tracking-widest text-[#f97316] uppercase font-bold">
                  Person of Interest
                </div>
                <h3 className="font-display mt-1 text-3xl font-bold uppercase text-white">
                  {activeSuspect.name}
                </h3>
                <p className="font-heading text-xs text-[#f97316] mt-0.5 uppercase tracking-wider">
                  {activeSuspect.role}
                </p>
              </div>

              {/* Questions */}
              <div>
                <h4 className="font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold mb-3">
                  Interrogation Questions
                </h4>
                <div className="space-y-2">
                  {activeSuspect.questions.map((item) => {
                    const isAsked = asked.includes(item.q);
                    return (
                      <div
                        key={item.q}
                        className="rounded-sm text-xs overflow-hidden"
                        style={{ background: "#07030f", borderLeft: `2px solid ${isAsked ? "#f97316" : "#391e60"}` }}
                      >
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 font-heading text-xs font-semibold text-white hover:text-[#f97316] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                          onClick={() => ask(item.q)}
                        >
                          <span>{item.q}</span>
                          <span
                            onClick={(e) => { e.stopPropagation(); ask(item.q); }}
                            className={cn(
                              "shrink-0 px-3 py-1 text-[9px] font-heading font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer select-none",
                              isAsked
                                ? "bg-[#f97316] text-[#0a0410]"
                                : "bg-white text-[#0a0410] hover:bg-[#f97316]",
                            )}
                          >
                            {isAsked ? "Re-ask" : "Ask"}
                          </span>
                        </button>
                        {isAsked && (
                          <p className="px-4 pb-3 text-xs leading-relaxed text-muted-foreground italic border-t border-[#2b1845] pt-2">
                            "{item.a}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Present evidence */}
              <div>
                <h4 className="font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold mb-2">
                  Present Evidence
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {EVIDENCE.map((e) => (
                    <PlainBtn
                      key={e.id}
                      onClick={() => present(e.id)}
                      active={presented.includes(e.id)}
                    >
                      {e.id}
                    </PlainBtn>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {presented.map((eid) => {
                    const resp = activeSuspect.evidenceResponses[eid as EvidenceId];
                    if (!resp) return null;
                    const isConflict =
                      (activeSuspect.id === "sophia" && eid === "E-01") ||
                      (activeSuspect.id === "charlotte" && (eid === "E-01" || eid === "E-04"));
                    return (
                      <ContradictionBlock
                        key={eid}
                        evidenceId={eid}
                        prompt={resp.prompt}
                        response={resp.response}
                        isConflict={isConflict}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Suspect nav */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4" style={divider}>
                <div className="flex gap-2">
                  <PlainBtn
                    disabled={activeSuspectIndex === 0}
                    onClick={() => setActiveSuspectIndex((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </PlainBtn>
                  <PlainBtn
                    disabled={activeSuspectIndex === SUSPECTS.length - 1}
                    onClick={() => setActiveSuspectIndex((p) => Math.min(SUSPECTS.length - 1, p + 1))}
                  >
                    Next Suspect
                  </PlainBtn>
                </div>
                <PlainBtn
                  active
                  onClick={() => document.getElementById("s-timeline")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Continue to Timeline
                </PlainBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-6 md:mx-12 h-px bg-[#2b1845]" />

      {/* ══════════════════════════════════════════
          STAGE 04 — TIMELINE
      ══════════════════════════════════════════ */}
      <section id="s-timeline" className="relative z-10 w-full px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <StageHeading num="04" label="Event Timeline" />
          <p className="text-sm text-muted-foreground mb-10">
            Tap each event to read the investigator's note.
          </p>
          <VerticalTimeline />
          <div className="mt-10 flex justify-end pt-6" style={divider}>
            <PlainBtn
              active
              onClick={() => document.getElementById("s-accusation")?.scrollIntoView({ behavior: "smooth" })}
            >
              Continue to Accusation
            </PlainBtn>
          </div>
        </div>
      </section>

      <div className="mx-6 md:mx-12 h-px bg-[#2b1845]" />

      {/* ══════════════════════════════════════════
          STAGE 05 — ACCUSATION & SOLUTION
      ══════════════════════════════════════════ */}
      <section id="s-accusation" className="relative z-10 w-full px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <StageHeading num="05" label="Submit Accusation" />

          <div className="rounded-sm p-8 md:p-10 space-y-6" style={panelBg}>
            <div>
              <p className="text-sm text-muted-foreground">
                Select the responsible suspect and explain your reasoning for each clue.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                update((s) => ({ ...s, submitted: true }));
              }}
            >
              {/* Suspect selector */}
              <div>
                <label className="block font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold mb-2">
                  Primary Accused
                </label>
                <select
                  required
                  value={state.accusation.suspectId}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      accusation: { ...s.accusation, suspectId: e.target.value as SuspectId },
                    }))
                  }
                  className="w-full bg-[#07030f] px-4 py-3 text-sm text-white focus:outline-none rounded-sm"
                  style={{ border: "1px solid #391e60" }}
                >
                  <option value="">Select the perpetrator</option>
                  {SUSPECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Deduction fields */}
              {[
                ["clockExplanation", "Explain the broken clock", "Why was it stopped at 10:40 PM?"],
                ["noteInterpretation", "Interpret the hidden note", 'What does "You promised you would never tell" reveal?'],
                ["disappearanceExplanation", "Explain Oliver's disappearance", "What happened between 10:40 and 11:15 PM?"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="block font-heading text-[10px] tracking-wider text-[#f97316] uppercase font-bold mb-2">
                    {label}
                  </label>
                  <textarea
                    required
                    minLength={8}
                    value={state.accusation[key as keyof AccusationInput]}
                    onChange={(e) =>
                      update((s) => ({
                        ...s,
                        accusation: { ...s.accusation, [key]: e.target.value },
                      }))
                    }
                    placeholder={placeholder}
                    rows={3}
                    className="w-full bg-[#07030f] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none rounded-sm resize-none"
                    style={{ border: "1px solid #391e60" }}
                  />
                </div>
              ))}

              <PlainBtn type="submit" active className="w-full !py-3.5 !text-sm !tracking-widest">
                Unseal Official Case Solution
              </PlainBtn>
            </form>

            {/* Dramatic reveal */}
            {state.submitted && (
              <SolutionReveal score={score} checks={checks} onReset={reset} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
