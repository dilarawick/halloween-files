import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Clue = {
  id: string;
  time: string;
  title: string;
  location: string;
  hint: string;
  fragment: string;
  detail: string;
};

const CLUES: Clue[] = [
  {
    id: "lanterns",
    time: "Clue 1",
    title: "Count the lantern light",
    location: "Parade",
    hint: "The valley wakes when the sun sinks. Look for the number that proves the parade is never dark.",
    fragment: "MOON",
    detail: "A thousand pumpkins glow along the trail. The first word of the pass is MOON.",
  },
  {
    id: "spirit",
    time: "Clue 2",
    title: "Follow the shy spirit",
    location: "Characters",
    hint: "Someone giggles behind you near the graveyard trail. Their name hides the next piece.",
    fragment: "LIT",
    detail: "Boo floats close, laughing softly. The second word of the pass is LIT.",
  },
  {
    id: "brew",
    time: "Clue 3",
    title: "Complete the cauldron",
    location: "Games",
    hint: "Madame Hexbrew's challenge rewards careful order. Finish a brew to earn the secret.",
    fragment: "GATE",
    detail: "The potion settles into a warm glow. The third word of the pass is GATE.",
  },
  {
    id: "pop",
    time: "Clue 4",
    title: "Catch the glowing patch",
    location: "Games",
    hint: "In Pumpkin Pop, speed matters. Strike a bright target before it fades.",
    fragment: "OPENS",
    detail: "A lantern pops in a burst of sparks. The final word of the pass is OPENS.",
  },
  {
    id: "manor",
    time: "Final",
    title: "Unlock the manor",
    location: "Tickets",
    hint: "Bring every fragment to the end of the trail. The haunted manor only answers the full passphrase.",
    fragment: "",
    detail: "The manor doors creak open. You solved the Pumpkin Parade mystery.",
  },
];

export function ExploreMysterySection() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string>(CLUES[0].id);

  const total = CLUES.length - 1;
  const count = CLUES.filter((c) => c.fragment && found.has(c.id)).length;
  const done = count >= total;
  const phrase = useMemo(
    () =>
      CLUES.filter((c) => c.fragment)
        .map((c) => (found.has(c.id) ? c.fragment : "????"))
        .join(" "),
    [found],
  );

  const reveal = (id: string) => {
    setActive(id);
    const clue = CLUES.find((c) => c.id === id);
    if (!clue || !clue.fragment) return;
    setFound((prev) => new Set(prev).add(id));
  };

  const activeClue = CLUES.find((c) => c.id === active) ?? CLUES[0];

  return (
    <section id="explore" className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex flex-col items-center text-center">
          <p className="font-heading text-xs tracking-[0.5em] text-primary uppercase">Explore the website</p>
          <h2 className="font-heading mt-3 text-3xl font-bold md:text-5xl">Mystery trail</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Follow the timeline, uncover easter eggs hidden around the parade, and collect every fragment to solve
            the manor mystery.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ol className="relative space-y-5 border-l border-primary/35 pl-8">
            {CLUES.map((clue) => {
              const discovered = !clue.fragment || found.has(clue.id);
              const isActive = active === clue.id;
              return (
                <li key={clue.id} className="relative">
                  <span
                    className={cn(
                      "absolute top-6 -left-[41px] size-4 rounded-full border transition-colors",
                      discovered
                        ? "border-primary bg-primary shadow-lantern"
                        : "border-primary/50 bg-background",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setActive(clue.id)}
                    className={cn(
                      "w-full rounded-3xl border p-5 text-left transition-all duration-300",
                      isActive
                        ? "border-primary/45 bg-card/70 shadow-lantern"
                        : "border-border bg-card/40 hover:border-primary/30 hover:bg-card/55",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-heading text-[11px] tracking-[0.22em] text-primary-glow uppercase">
                          {clue.time} · {clue.location}
                        </div>
                        <h3 className="font-heading mt-1 text-xl font-bold">{clue.title}</h3>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 font-heading text-[10px] tracking-[0.18em] uppercase",
                          discovered
                            ? "border-primary/35 bg-primary/12 text-primary"
                            : "border-border bg-background/30 text-muted-foreground",
                        )}
                      >
                        {discovered ? "Found" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{clue.hint}</p>
                  </button>
                </li>
              );
            })}
          </ol>

          <aside className="rounded-3xl border border-border bg-card/55 p-6 shadow-card backdrop-blur md:p-7 lg:sticky lg:top-28 lg:self-start">
            <div className="font-heading text-[11px] tracking-[0.25em] text-primary uppercase">Case file</div>
            <h3 className="font-heading mt-2 text-2xl font-bold text-glow">{activeClue.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activeClue.hint}</p>

            <div className="mt-5 rounded-2xl border border-border bg-night/50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-heading text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                  Progress
                </span>
                <span className="font-heading text-[11px] tracking-[0.14em] text-primary uppercase">
                  {count}/{total} clues
                </span>
              </div>
              <Progress value={(count / total) * 100} className="h-2 bg-primary/15" />
              <div className="mt-4 rounded-xl border border-primary/20 bg-background/20 px-4 py-3">
                <div className="font-heading text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                  Passphrase
                </div>
                <div
                  className={cn(
                    "mt-1 font-display text-lg font-bold tracking-wide",
                    done ? "text-primary-glow text-glow animate-flicker" : "text-foreground",
                  )}
                >
                  {done ? "MOON LIT GATE OPENS" : phrase}
                </div>
              </div>
            </div>

            <div className="mt-5 min-h-24 rounded-2xl border border-border bg-background/20 p-4">
              <div className="font-heading text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                Discovery
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {found.has(activeClue.id) || !activeClue.fragment
                  ? activeClue.detail
                  : "Inspect this part of the website, then reveal the clue when you find it."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {activeClue.fragment ? (
                <Button
                  variant={found.has(activeClue.id) ? "glass" : "lantern"}
                  size="sm"
                  onClick={() => reveal(activeClue.id)}
                >
                  {found.has(activeClue.id) ? "Clue found" : "Reveal clue"}
                </Button>
              ) : (
                <Button variant={done ? "lantern" : "glass"} size="sm" asChild>
                  <a href="#tickets">{done ? "Enter the manor" : "Keep exploring"}</a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFound(new Set());
                  setActive(CLUES[0].id);
                }}
              >
                Reset trail
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
