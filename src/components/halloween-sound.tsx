import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type Voice = { stop: () => void };

const AMBIENCE_SRC = "/halloween-ambience.mp3";

function noiseBuffer(ctx: AudioContext, seconds = 2) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function startSpookyFallback(ctx: AudioContext): { master: GainNode; voice: Voice } {
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.4);

  const stops: Array<() => void> = [];

  const drone = ctx.createOscillator();
  const drone2 = ctx.createOscillator();
  const droneFilter = ctx.createBiquadFilter();
  const droneGain = ctx.createGain();
  drone.type = "sawtooth";
  drone.frequency.value = 55;
  drone2.type = "triangle";
  drone2.frequency.value = 55.6;
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 220;
  droneFilter.Q.value = 4;
  droneGain.gain.value = 0.045;
  drone.connect(droneFilter);
  drone2.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(master);
  drone.start();
  drone2.start();
  stops.push(() => {
    try {
      drone.stop();
      drone2.stop();
    } catch {}
  });

  const wind = ctx.createBufferSource();
  const windFilter = ctx.createBiquadFilter();
  const windGain = ctx.createGain();
  const windLfo = ctx.createOscillator();
  const windLfoGain = ctx.createGain();
  wind.buffer = noiseBuffer(ctx, 3);
  wind.loop = true;
  windFilter.type = "bandpass";
  windFilter.frequency.value = 520;
  windFilter.Q.value = 0.8;
  windLfo.type = "sine";
  windLfo.frequency.value = 0.13;
  windLfoGain.gain.value = 220;
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windFilter.frequency);
  windGain.gain.value = 0.028;
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(master);
  wind.start();
  windLfo.start();
  stops.push(() => {
    try {
      wind.stop();
      windLfo.stop();
    } catch {}
  });

  let cancelled = false;
  let ghostTimer: number | null = null;
  const ghostMoan = () => {
    if (cancelled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const startFreq = 220 + Math.random() * 120;
    const endFreq = startFreq * (0.72 + Math.random() * 0.18);
    const dur = 1.6 + Math.random() * 1.8;
    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + dur);
    filter.type = "bandpass";
    filter.frequency.value = 700;
    filter.Q.value = 6;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + dur + 0.05);
    ghostTimer = window.setTimeout(ghostMoan, 2600 + Math.random() * 4200);
  };
  ghostTimer = window.setTimeout(ghostMoan, 1200);

  return {
    master,
    voice: {
      stop: () => {
        cancelled = true;
        if (ghostTimer != null) window.clearTimeout(ghostTimer);
        stops.forEach((fn) => fn());
      },
    },
  };
}

export function HalloweenSoundToggle() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("Sound off");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voiceRef = useRef<Voice | null>(null);

  useEffect(() => {
    const audio = new Audio(AMBIENCE_SRC);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0.55;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      voiceRef.current?.stop();
      voiceRef.current = null;
      masterRef.current = null;
      const ctx = ctxRef.current;
      if (ctx) void ctx.close();
      ctxRef.current = null;
    };
  }, []);

  const stopFallback = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    }
  };

  const startFallback = async () => {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    voiceRef.current?.stop();
    const started = startSpookyFallback(ctx);
    masterRef.current = started.master;
    voiceRef.current = started.voice;
    return true;
  };

  const toggle = async () => {
    if (!on) {
      setLabel("Loading");
      const audio = audioRef.current;
      if (audio) {
        try {
          await audio.play();
          stopFallback();
          setOn(true);
          setLabel("Sound on");
          return;
        } catch {
          /* fall through to synthesized ambience */
        }
      }
      try {
        const ok = await startFallback();
        setOn(ok);
        setLabel(ok ? "Sound on" : "Sound off");
      } catch {
        setOn(false);
        setLabel("Sound off");
      }
    } else {
      audioRef.current?.pause();
      stopFallback();
      setOn(false);
      setLabel("Sound off");
    }
  };

  return (
    <Button
      type="button"
      variant="glass"
      size="sm"
      onClick={() => void toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn spooky ambience off" : "Turn spooky ambience on"}
      title={on ? "Spooky ambience on" : "Spooky ambience off"}
      className="h-9 rounded-full px-3 font-heading text-[11px] tracking-[0.12em] uppercase"
    >
      {label}
    </Button>
  );
}

