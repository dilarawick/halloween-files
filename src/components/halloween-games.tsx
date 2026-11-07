import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PopCell = { id: number; lit: boolean; pop: number };

function PumpkinPop() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [cells, setCells] = useState<PopCell[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, lit: false, pop: 0 })),
  );
  const timer = useRef<number | null>(null);
  const spawner = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawner.current = window.setInterval(() => {
      setCells((prev) => {
        const next = prev.map((c) => ({ ...c, lit: false }));
        const count = 1 + Math.floor(Math.random() * 2);
        const picks = new Set<number>();
        while (picks.size < count) picks.add(Math.floor(Math.random() * next.length));
        picks.forEach((i) => {
          next[i].lit = true;
        });
        return next;
      });
    }, 760);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      if (spawner.current) window.clearInterval(spawner.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running && score > best) setBest(score);
  }, [running, score, best]);

  const start = () => {
    setScore(0);
    setTimeLeft(20);
    setCells(Array.from({ length: 9 }, (_, i) => ({ id: i, lit: false, pop: 0 })));
    setRunning(true);
  };

  const hit = (id: number) => {
    if (!running) return;
    let scored = false;
    setCells((prev) =>
      prev.map((c) => {
        if (c.id !== id || !c.lit) return c;
        scored = true;
        return { ...c, lit: false, pop: c.pop + 1 };
      }),
    );
    if (scored) setScore((s) => s + 1);
  };

  return (
    <GameCard
      title="Pumpkin Pop"
      desc="Tap glowing pumpkins before they fade. 20 seconds on the clock."
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="font-heading text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Best <span className="text-primary">{best}</span>
          </div>
          <Button variant={running ? "glass" : "lantern"} size="sm" onClick={start}>
            {running ? "Restart" : timeLeft === 0 ? "Play again" : "Start"}
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <Stat label="Time" value={`${timeLeft}s`} />
        <Stat label="Score" value={String(score)} highlight />
        <div className="flex-1">
          <Progress value={(timeLeft / 20) * 100} className="h-2 bg-primary/15" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cells.map((c) => (
          <button
            key={`${c.id}-${c.pop}`}
            type="button"
            onClick={() => hit(c.id)}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-2xl border border-border bg-night/70 text-3xl transition-all duration-150",
              c.lit ? "scale-[1.02] border-primary/50 shadow-lantern" : "opacity-80 hover:opacity-100",
              running ? "cursor-pointer" : "cursor-default",
            )}
            aria-label={c.lit ? "Pop pumpkin" : "Empty patch"}
          >
            <span
              className={cn(
                "font-display text-xl font-black transition-all duration-150",
                c.lit ? "animate-pop-burst text-primary text-glow scale-110" : "text-muted-foreground/30",
              )}
            >
              {c.lit ? "POP" : "·"}
            </span>
            {c.lit ? (
              <span
                aria-hidden
                className="animate-ember-drift pointer-events-none absolute top-3 right-4 size-1.5 rounded-full bg-primary-glow"
              />
            ) : null}
          </button>
        ))}
      </div>
    </GameCard>
  );
}

type CardTile = { id: number; face: string; key: string };

function shuffleFaces(faces: string[]): CardTile[] {
  const pairs = faces.flatMap((face, i) => [
    { id: i * 2, face, key: `${face}-a` },
    { id: i * 2 + 1, face, key: `${face}-b` },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

function GhostMatch() {
  const faces = useMemo(() => ["BOO", "BAT", "WEB", "OWL", "CAT", "FOG"], []);
  const [cards, setCards] = useState<CardTile[]>(() =>
    faces.flatMap((face, i) => [
      { id: i * 2, face, key: `${face}-a` },
      { id: i * 2 + 1, face, key: `${face}-b` },
    ]),
  );
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setCards(shuffleFaces(faces));
  }, [faces]);

  const reset = () => {
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setCards(shuffleFaces(faces));
  };

  const won = matched.size === faces.length;

  const flip = (idx: number) => {
    if (locked || won) return;
    const card = cards[idx];
    if (!card || open.includes(idx) || matched.has(card.face)) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a]?.face === cards[b]?.face) {
        setMatched((prev) => new Set(prev).add(cards[a].face));
        setOpen([]);
      } else {
        setLocked(true);
        window.setTimeout(() => {
          setOpen([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  return (
    <GameCard
      title="Ghost Match"
      desc="Flip cards and pair every spooky word. Fewer moves is better."
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="font-heading text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {won ? <span className="text-primary-glow">All spirits paired</span> : `${matched.size}/${faces.length} pairs`}
          </div>
          <Button variant="glass" size="sm" onClick={reset}>
            Shuffle
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <Stat label="Moves" value={String(moves)} highlight={won} />
        <Stat label="Pairs" value={`${matched.size}/${faces.length}`} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => {
          const revealed = open.includes(idx) || matched.has(card.face);
          return (
            <button
              key={`${card.key}-${idx}`}
              type="button"
              onClick={() => flip(idx)}
              className={cn(
                "relative aspect-square rounded-2xl border text-2xl transition-all duration-300 [transform-style:preserve-3d]",
                revealed
                  ? "border-primary/40 bg-card shadow-lantern"
                  : "border-border bg-secondary/70 hover:border-primary/30 hover:bg-secondary",
              )}
              aria-label={revealed ? `Card ${card.face}` : "Hidden card"}
            >
              <span
                className={cn(
                  "font-heading text-[11px] font-bold tracking-[0.14em] transition-opacity",
                  revealed ? "text-foreground opacity-100" : "opacity-0",
                )}
              >
                {card.face}
              </span>
              {!revealed ? (
                <span className="absolute inset-0 flex items-center justify-center font-heading text-[10px] tracking-[0.2em] text-muted-foreground/50">
                  CARD
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </GameCard>
  );
}

const INGREDIENTS = [
  { id: "moon", label: "Moon dew" },
  { id: "fang", label: "Bat fang" },
  { id: "flame", label: "Lantern flame" },
  { id: "leaf", label: "Night leaf" },
] as const;

function randomRecipe() {
  const picks: string[] = [];
  const len = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < len; i++) picks.push(INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)].id);
  return picks;
}

function WitchBrew() {
  const [recipe, setRecipe] = useState<string[]>(() => ["moon", "fang", "flame"]);
  const [step, setStep] = useState(0);
  const [brews, setBrews] = useState(0);
  const [status, setStatus] = useState<"idle" | "bad" | "good">("idle");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    setRecipe(randomRecipe());
  }, []);

  const add = (id: string) => {
    if (status === "good") return;
    if (recipe[step] === id) {
      const next = step + 1;
      if (next >= recipe.length) {
        setStatus("good");
        setBrews((b) => b + 1);
        window.setTimeout(() => {
          setRecipe(randomRecipe());
          setStep(0);
          setStatus("idle");
        }, 1200);
      } else {
        setStep(next);
        setStatus("idle");
      }
    } else {
      setStatus("bad");
      setStep(0);
      setShake((n) => n + 1);
      window.setTimeout(() => setStatus("idle"), 450);
    }
  };

  return (
    <GameCard
      title="Witch's Brew"
      desc="Repeat the potion recipe in order. Miss an ingredient and the cauldron resets."
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="font-heading text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Brews <span className="text-primary">{brews}</span>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              setRecipe(randomRecipe());
              setStep(0);
              setStatus("idle");
            }}
          >
            New recipe
          </Button>
        </div>
      }
    >
      <div
        key={shake}
        className={cn(
          "mb-4 rounded-2xl border border-border bg-night/70 p-4",
          status === "bad" && "animate-haunt-shake border-destructive/50",
          status === "good" && "border-primary/50 shadow-lantern",
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            Recipe
          </span>
          <span className="text-sm" aria-live="polite">
            {status === "good" ? "Potion complete!" : status === "bad" ? "The brew hissed..." : `${step}/${recipe.length}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.map((id, i) => {
            const ing = INGREDIENTS.find((x) => x.id === id);
            const done = i < step || status === "good";
            return (
              <span
                key={`${id}-${i}-${recipe.join("")}`}
                className={cn(
                  "rounded-full border px-3 py-1 font-heading text-[11px] tracking-wide transition-colors",
                  done
                    ? "border-primary/40 bg-primary/15 text-foreground"
                    : "border-border bg-background/30 text-muted-foreground",
                )}
              >
                {ing?.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {INGREDIENTS.map((ing) => (
          <Button
            key={ing.id}
            type="button"
            variant="outline"
            className="h-auto rounded-2xl border-border bg-card/40 px-4 py-3 text-left hover:border-primary/40 hover:bg-card"
            onClick={() => add(ing.id)}
          >
            <span className="font-heading text-xs tracking-[0.12em] uppercase">{ing.label}</span>
          </Button>
        ))}
      </div>
    </GameCard>
  );
}

function GameCard({
  title,
  desc,
  children,
  footer,
}: {
  title: string;
  desc: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/55 p-5 shadow-card backdrop-blur md:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent opacity-80" />
      <header className="relative mb-5">
        <h3 className="font-heading text-xl font-bold text-glow">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </header>
      <div className="relative">{children}</div>
      <footer className="relative mt-5 border-t border-border/80 pt-4">{footer}</footer>
    </article>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/25 px-3 py-2">
      <div className="font-heading text-[10px] tracking-[0.22em] text-muted-foreground uppercase">{label}</div>
      <div className={cn("font-display text-lg font-bold leading-none", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </div>
    </div>
  );
}

export function HalloweenGamesSection() {
  return (
    <section id="games" className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 h-64 w-[min(52rem,100%)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex flex-col items-center text-center">
          <p className="font-heading text-xs tracking-[0.5em] text-primary uppercase">Midnight arcade</p>
          <h2 className="font-heading mt-3 text-3xl font-bold md:text-5xl">Halloween mini games</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Quick, animated games to play while you wait for the parade. Everything runs right in the page — no
            downloads, just a little Halloween mischief.
          </p>
        </div>
        <div className="mt-14 grid gap-6 xl:grid-cols-3">
          <PumpkinPop />
          <GhostMatch />
          <WitchBrew />
        </div>
      </div>
    </section>
  );
}
