import { useEffect, useRef } from "react";
import type { RealmName } from "../../theme/realms";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  speed: number;
}

interface Kind {
  count: number;
  /** Glow sprite colour as "r,g,b". */
  rgb: string;
  spawn: (w: number, h: number, initial: boolean) => Particle;
  step: (p: Particle, t: number, w: number, h: number) => boolean;
  alpha: (p: Particle, t: number, h: number) => number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Per-realm motes, deliberately sparse and slow — atmosphere, not effects.
 * fire: embers drifting up from the hearth and fading;
 * aurora: stars twinkling in the upper sky;
 * forest: fireflies wandering and pulsing.
 * `step` returns false when a particle should be respawned.
 */
const KINDS: Record<RealmName, Kind> = {
  fire: {
    count: 34,
    rgb: "255,160,70",
    spawn: (w, h, initial) => ({
      x: rand(0, w),
      y: initial ? rand(h * 0.3, h) : h + 10,
      vx: rand(-0.08, 0.08),
      vy: rand(-0.45, -0.18),
      size: rand(0.8, 2.2),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.6, 1.4),
    }),
    step: (p, t) => {
      p.x += p.vx + Math.sin(t * 0.0012 * p.speed + p.phase) * 0.18;
      p.y += p.vy;
      return p.y > -10;
    },
    alpha: (p, t, h) =>
      Math.min(1, p.y / (h * 0.55)) * (0.55 + 0.45 * Math.sin(t * 0.006 * p.speed + p.phase)),
  },
  aurora: {
    count: 46,
    rgb: "220,245,255",
    spawn: (w, h) => ({
      x: rand(0, w),
      y: rand(0, h * 0.55),
      vx: 0,
      vy: 0,
      size: rand(0.5, 1.5),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.3, 1.1),
    }),
    step: () => true,
    alpha: (p, t) => 0.25 + 0.75 * Math.max(0, Math.sin(t * 0.0011 * p.speed + p.phase)) ** 3,
  },
  forest: {
    count: 22,
    rgb: "232,240,140",
    spawn: (w, h) => ({
      x: rand(0, w),
      y: rand(h * 0.25, h),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.1, 0.1),
      size: rand(1, 2.2),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.4, 1),
    }),
    step: (p, t, w, h) => {
      p.vx += Math.sin(t * 0.0007 * p.speed + p.phase) * 0.004;
      p.vy += Math.cos(t * 0.0009 * p.speed + p.phase) * 0.004;
      p.vx = Math.max(-0.2, Math.min(0.2, p.vx));
      p.vy = Math.max(-0.2, Math.min(0.2, p.vy));
      p.x += p.vx;
      p.y += p.vy;
      return p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20;
    },
    alpha: (p, t) => Math.max(0, Math.sin(t * 0.0016 * p.speed + p.phase)) ** 2,
  },
};

/** A soft round glow, drawn once and stamped — far cheaper than shadowBlur per mote. */
function makeSprite(rgb: string): HTMLCanvasElement {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},0.85)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.22)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

/**
 * Slow ambient particles over the realm photo. A single fixed canvas, ~30fps,
 * paused while the tab is hidden. Under prefers-reduced-motion they hold
 * their positions and only twinkle.
 */
export default function RealmParticles({ realm }: { realm: RealmName }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Reduced motion: motes stay where they are and only glow and fade in
    // place — no drifting embers or wandering fireflies.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const kind = KINDS[realm];
    const sprite = makeSprite(kind.rgb);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const parts = Array.from({ length: kind.count }, () => kind.spawn(w, h, true));
    let frame = 0;
    let last = 0;
    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden || t - last < 33) return;
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!still && !kind.step(p, t, w, h)) parts[i] = kind.spawn(w, h, false);
        const a = kind.alpha(p, t, h);
        if (a <= 0.01) continue;
        const d = p.size * 9;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [realm]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 h-full w-full" aria-hidden="true" />;
}
