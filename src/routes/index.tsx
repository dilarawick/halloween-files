import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";



import { Button } from "@/components/ui/button";
import { CaseInvestigationSection } from "@/components/case-001";


import { HalloweenSoundToggle } from "@/components/halloween-sound";
import heroImg from "@/assets/hero-haunted-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Halloween Files — Case 001: The Last Message" },
      {
        name: "description",
        content:
          "Investigate Case 001: The Last Message at Blackwood House. Examine evidence, question suspects, connect clues, and submit your final accusation.",
      },
      { property: "og:title", content: "The Halloween Files — Case 001: The Last Message" },
      {
        property: "og:description",
        content: "A complete interactive Halloween mystery. Discover what happened to Oliver Reed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Scene",     href: "#s-briefing" },
  { label: "Evidence",  href: "#s-evidence" },
  { label: "Suspects",  href: "#s-suspects" },
  { label: "Timeline",  href: "#s-timeline" },
  { label: "Accuse",    href: "#s-accusation" },
  { label: "Connect",   href: "#connect" },
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

function FloatingNav() {
  const [show, setShow] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 24) setShow(true);
      else if (delta < -6) setShow(true);
      else if (delta > 6 && y > 120) setShow(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#2e1948] bg-[#0d0715] shadow-lg transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#" className="font-display text-xl font-black tracking-wider text-foreground md:text-2xl">
          Halloween<span className="text-primary"> Files</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="font-heading text-sm tracking-[0.18em] text-foreground uppercase transition-colors hover:text-primary"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <HalloweenSoundToggle />
          <Button variant="lantern" size="sm" className="rounded-full px-5 shadow-sm font-bold" asChild>
            <a href="#s-briefing">Open case</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingNav />
      {/* HERO — image kept same, solid colors, clean minimalist UX */}
      <section className="relative min-h-[88vh] w-full overflow-hidden pt-[80px] flex items-center justify-center bg-[#0a0512]">
        <img
          src={heroImg}
          alt="Blackwood House on Halloween night"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        {/* Solid gradient vignette overlay - no glass/blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0715] via-[#0d0715]/70 to-[#0d0715]/40" />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-center">
          <div className="mx-auto flex flex-col items-center">
            {/* Minimalist Solid Pill */}
            <div className="rounded-full border-2 border-primary/40 bg-[#160d26] px-5 py-1.5 shadow-md">
              <span className="font-heading text-xs tracking-[0.25em] text-primary uppercase font-bold">
                Case 001 · Blackwood House
              </span>
            </div>

            {/* Clean Bold Title */}
            <h1 className="font-display mt-6 text-5xl sm:text-7xl font-black tracking-tight text-white uppercase">
              The Last Message
            </h1>

            {/* Minimalist 1-Line Hook */}
            <p className="mt-4 max-w-xl text-base sm:text-lg text-foreground/90 font-medium leading-relaxed">
              Oliver Reed vanished from his locked study. The clock stopped at 10:40 PM.
            </p>

            {/* Direct Dying Quote - No Card Component */}
            <p className="mt-3 font-heading text-sm text-primary-glow italic">
              &ldquo;If anything happens tonight, check the clock.&rdquo;
            </p>

            {/* Solid Rounded Action Navigation Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="lantern" size="xl" className="rounded-full px-10 shadow-md font-bold" asChild>
                <a href="#s-briefing">Start Investigation</a>
              </Button>
              <Button variant="outline" size="xl" className="rounded-full border-2 border-[#391e60] bg-[#1c0e32] text-white hover:bg-[#2e1750] hover:border-[#f97316] px-10 shadow-md font-bold" asChild>
                <a href="#s-evidence">Open Case Files</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Indicator - No Unnecessary Icon */}
        <a
          href="#s-briefing"
          className="absolute bottom-5 inset-x-0 text-center font-heading text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          Scroll to Begin
        </a>
      </section>

      <CaseInvestigationSection />



      <section id="connect" className="relative overflow-hidden border-t border-border">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-bottom opacity-25"
        />
        <div className="absolute inset-0 bg-background/72" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <p className="font-heading text-xs tracking-[0.5em] text-primary uppercase font-bold">Case closed, conversation open</p>
          <h2 className="font-display mt-4 text-4xl font-black text-glow md:text-6xl">Let&apos;s Connect</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85">
            Got a spooky idea, a mystery worth building, or a collaboration hiding in the fog? Send a message before
            the lanterns fade and the manor goes quiet again.
          </p>
          <a
            href="mailto:dilarawickramanayake@gmail.com"
            className="mt-8 inline-block bg-white text-[#0a0410] px-8 py-3.5 text-sm font-medium hover:bg-[#f97316] transition-colors"
            style={{ fontFamily: "monospace", letterSpacing: "0" }}
          >
            dilarawickramanayake@gmail.com
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-heading tracking-widest uppercase text-muted-foreground">
            <span>Best reached by email</span>
            <span className="text-primary font-bold">·</span>
            <span>The Halloween Files</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-night py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-10">
          <span className="font-display text-lg font-black">
            Halloween<span className="text-primary"> Files</span>
          </span>
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            Case 001 · The Last Message
          </p>
        </div>
      </footer>
    </div>
  );
}
