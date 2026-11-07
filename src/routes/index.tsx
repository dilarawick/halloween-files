import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Ghost, Flame, MapPin, Clock, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-haunted-valley.jpg";
import paradeImg from "@/assets/card-parade.jpg";
import witchImg from "@/assets/card-witch.jpg";
import ghostImg from "@/assets/card-ghost.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pumpkin Parade — A Halloween Night Festival" },
      {
        name: "description",
        content:
          "Join the Pumpkin Parade: lantern-lit marches, friendly ghosts, witches' brews and a haunted valley glowing with jack-o'-lanterns.",
      },
      { property: "og:title", content: "Pumpkin Parade — A Halloween Night Festival" },
      {
        property: "og:description",
        content: "Lantern-lit marches, friendly ghosts and a haunted valley glowing with pumpkins.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Parade", href: "#parade" },
  { label: "Characters", href: "#characters" },
  { label: "Schedule", href: "#schedule" },
  { label: "Tickets", href: "#tickets" },
];

const CHARACTERS = [
  {
    name: "The Lantern March",
    tag: "Parade",
    img: paradeImg,
    text: "Hundreds of glowing jack-o'-lanterns wander out of the misty woods and lead the way.",
  },
  {
    name: "Madame Hexbrew",
    tag: "Witch",
    img: witchImg,
    text: "Stop by her bubbling cauldron for a warm cup of pumpkin potion — and a fortune.",
  },
  {
    name: "Boo the Little Ghost",
    tag: "Spirit",
    img: ghostImg,
    text: "Shy, giggly and always floating just behind you. Follow Boo through the graveyard trail.",
  },
];

const SCHEDULE = [
  { time: "6:00 PM", title: "Gates Creak Open", text: "Costume check-in & pumpkin carving corner." },
  { time: "7:30 PM", title: "Lanterns Rise", text: "The valley lights up as the first lanterns glow." },
  { time: "8:30 PM", title: "The Grand Parade", text: "March across the old bridge to the haunted manor." },
  { time: "10:00 PM", title: "Moonlight Masquerade", text: "Music, treats and the best-costume crowning." },
];

type Leaf = { left: number; delay: number; duration: number; size: number; hue: "primary" | "accent" };

function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  useEffect(() => {
    setLeaves(
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 110,
        delay: Math.random() * 12,
        duration: 9 + Math.random() * 10,
        size: 6 + Math.random() * 10,
        hue: i % 3 === 0 ? "accent" : "primary",
      })),
    );
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l, i) => (
        <span
          key={i}
          className={`animate-drift-fall absolute top-0 rounded-[60%_0_60%_0] opacity-0 ${
            l.hue === "accent" ? "bg-accent/80" : "bg-primary/80"
          }`}
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="A haunted manor on a hill above a misty valley lit by jack-o'-lanterns at dusk"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-[30%_center]"
        />
        <div className="bg-sky-veil absolute inset-0" />
        <div className="bg-night-fade absolute inset-x-0 bottom-0 h-1/2" />
        <FallingLeaves />

        {/* Nav */}
        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <a href="#" className="font-display text-xl font-black tracking-wider text-glow md:text-2xl">
            Pumpkin<span className="text-primary"> Parade</span>
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="font-heading text-sm tracking-[0.2em] text-foreground/85 uppercase transition-colors hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <Button variant="glass" size="sm" asChild>
            <a href="#tickets">
              <Moon /> Join
            </a>
          </Button>
        </header>

        {/* Title */}
        <div className="relative z-10 mx-auto flex h-[calc(100%-96px)] max-w-7xl items-center px-6 md:px-10">
          <div className="ml-auto flex max-w-xl flex-col items-center text-center md:mr-4">
            <p className="animate-rise-in font-heading text-xs tracking-[0.5em] text-primary-glow uppercase md:text-sm">
              All Hallows' Eve · Oct 31
            </p>
            <h1
              className="animate-rise-in font-display mt-4 text-6xl leading-[0.9] font-black tracking-wide text-glow sm:text-7xl md:text-8xl"
              style={{ animationDelay: "0.15s" }}
            >
              Pumpkin
              <span className="text-primary block">Parade</span>
            </h1>
            <p
              className="animate-rise-in font-heading mt-6 text-base tracking-[0.25em] text-foreground/90 md:text-lg"
              style={{ animationDelay: "0.3s" }}
            >
              A Halloween Night Festival
            </p>
            <div className="animate-rise-in mt-10" style={{ animationDelay: "0.45s" }}>
              <Button variant="lantern" size="xl" asChild>
                <a href="#tickets">Join the Parade</a>
              </Button>
            </div>
            <p
              className="animate-rise-in mt-4 text-xs tracking-widest text-foreground/60 uppercase"
              style={{ animationDelay: "0.6s" }}
            >
              Lanterns lit at dusk · Costumes encouraged
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="parade" className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        <Flame className="animate-flicker mx-auto size-8 text-primary" />
        <h2 className="font-heading mt-6 text-3xl font-bold tracking-wide md:text-5xl">
          One night. A thousand lanterns.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          When the sun sinks behind the violet mountains, the valley wakes up. Follow the glowing
          pumpkin trail down the old stone stairs, across the creaking bridge, and up to the
          haunted manor where the festivities never sleep.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            { k: "1,000+", v: "Glowing pumpkins" },
            { k: "3 mi", v: "Lantern-lit trail" },
            { k: "1", v: "Very haunted manor" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur">
              <div className="font-display text-4xl font-black text-primary">{s.k}</div>
              <div className="mt-2 font-heading text-sm tracking-[0.2em] text-muted-foreground uppercase">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHARACTERS */}
      <section id="characters" className="relative bg-night py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col items-center text-center">
            <Ghost className="animate-float-soft size-8 text-accent" />
            <p className="mt-4 font-heading text-xs tracking-[0.5em] text-primary uppercase">
              Meet the locals
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold md:text-5xl">Who you'll meet</h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {CHARACTERS.map((c, i) => (
              <article
                key={c.name}
                className="group relative overflow-hidden rounded-3xl border border-border shadow-card transition-transform duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="bg-night-fade absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="rounded-full bg-primary px-3 py-1 font-heading text-[10px] font-bold tracking-[0.25em] text-primary-foreground uppercase">
                    {c.tag}
                  </span>
                  <h3 className="font-heading mt-3 text-2xl font-bold text-glow">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <div className="text-center">
          <p className="font-heading text-xs tracking-[0.5em] text-primary uppercase">The night of</p>
          <h2 className="font-heading mt-3 text-3xl font-bold md:text-5xl">Parade schedule</h2>
        </div>
        <ol className="relative mt-16 space-y-10 border-l border-primary/40 pl-8">
          {SCHEDULE.map((s) => (
            <li key={s.time} className="relative">
              <span className="animate-flicker absolute top-1.5 -left-[41px] size-4 rounded-full bg-primary shadow-lantern" />
              <div className="flex items-center gap-2 font-heading text-sm tracking-[0.2em] text-primary-glow">
                <Clock className="size-4" /> {s.time}
              </div>
              <h3 className="font-heading mt-1 text-xl font-bold md:text-2xl">{s.title}</h3>
              <p className="mt-1 text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TICKETS / CTA */}
      <section id="tickets" className="relative overflow-hidden">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
          <h2 className="font-display text-4xl font-black text-glow md:text-6xl">
            Grab your <span className="text-primary">lantern</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/85">
            Spots on the parade route are limited. Join the list and we'll send your glowing
            invitation before the moon rises.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              form.reset();
              alert("You're on the list! See you under the moon. 🎃");
            }}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="h-14 flex-1 rounded-full border border-input bg-glass px-6 text-foreground backdrop-blur-md placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
            <Button variant="lantern" size="xl" type="submit">
              Join
            </Button>
          </form>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" /> October 31
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Hollow Valley Grounds
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-night py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-10">
          <span className="font-display text-lg font-black">
            Pumpkin<span className="text-primary"> Parade</span>
          </span>
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            © Pumpkin Parade · Stay spooky
          </p>
        </div>
      </footer>
    </div>
  );
}
