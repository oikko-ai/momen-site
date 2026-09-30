"use client";

import { useEffect, useRef } from "react";
import type { Cover as CoverKind } from "@/content";

// Generated, animated covers so every project has original imagery until real screenshots exist.
// Each kind has its own soft background tint.
const tint: Record<CoverKind, string> = {
  voice: "radial-gradient(120% 90% at 30% 20%, #2b3f6b 0%, #121a2c 60%, #0b0f18 100%)",
  grid: "radial-gradient(120% 90% at 70% 20%, #2e5238 0%, #13241a 60%, #0a120d 100%)",
  doc: "radial-gradient(120% 90% at 30% 30%, #6b4526 0%, #2a1a10 60%, #140c07 100%)",
  stream: "radial-gradient(120% 90% at 60% 20%, #1f4b57 0%, #10232a 60%, #081114 100%)",
  market: "radial-gradient(120% 90% at 40% 20%, #7a2e2a 0%, #2e1311 60%, #160908 100%)",
  graph: "radial-gradient(120% 90% at 60% 30%, #4a3478 0%, #1e1533 60%, #0e0a18 100%)",
  ledger: "radial-gradient(120% 90% at 30% 20%, #2c5a4e 0%, #13261f 60%, #09120f 100%)",
  fusion: "radial-gradient(120% 90% at 50% 20%, #7a2f5c 0%, #2c1224 60%, #150811 100%)",
};

const INK = (a: number) => `rgba(245,243,238,${a})`;
const GLASS = "rgba(255,255,255,0.08)";
const rand = (i: number) => {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return n - Math.floor(n);
};

type Draw = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

const draw: Record<CoverKind, Draw> = {
  voice(c, w, h, t) {
    const n = 64, gap = w * 0.5 / n;
    for (let i = 0; i < n; i++) {
      const x = w * 0.25 + i * gap;
      const env = Math.sin((i / n) * Math.PI);
      const v = (0.3 + 0.7 * Math.abs(Math.sin(i * 0.35 + t * 2.2) * Math.cos(i * 0.11 - t))) * env;
      const bh = Math.max(3, v * h * 0.42);
      c.fillStyle = INK(0.82);
      c.beginPath();
      c.roundRect(x, h / 2 - bh / 2, Math.max(2, gap * 0.45), bh, 2);
      c.fill();
    }
  },
  grid(c, w, h, t) {
    const s = Math.min(w, h) / 7, cols = 5, rows = 4;
    const ox = (w - cols * s) / 2, oy = (h - rows * s) / 2;
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const on = Math.sin(t * 1.1 + rand(x * 7 + y * 3) * 12) > 0.55;
        c.fillStyle = on ? INK(0.9) : GLASS;
        c.beginPath();
        c.roundRect(ox + x * s + s * 0.08, oy + y * s + s * 0.08, s * 0.84, s * 0.84, s * 0.14);
        c.fill();
      }
  },
  doc(c, w, h, t) {
    const pw = Math.min(w * 0.3, h * 0.5), ph = pw * 1.3, y0 = (h - ph) / 2;
    const xs = [w / 2 - pw - 16, w / 2 + 16];
    const k = Math.floor(t * 0.8) % 7;
    xs.forEach((x0, p) => {
      c.fillStyle = "rgba(255,255,255,0.1)";
      c.beginPath();
      c.roundRect(x0, y0, pw, ph, 10);
      c.fill();
      for (let i = 0; i < 7; i++) {
        const hl = i === (p ? (k + 2) % 7 : k);
        c.fillStyle = hl ? INK(0.9) : INK(0.2);
        c.beginPath();
        c.roundRect(x0 + 14, y0 + 20 + i * (ph - 40) / 7, (pw - 28) * (0.55 + rand(i + p * 9) * 0.4), 5, 3);
        c.fill();
      }
    });
    const a = y0 + 22 + k * (ph - 40) / 7, b = y0 + 22 + ((k + 2) % 7) * (ph - 40) / 7;
    c.strokeStyle = INK(0.6);
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(xs[0] + pw - 8, a);
    c.bezierCurveTo(w / 2, a, w / 2, b, xs[1] + 8, b);
    c.stroke();
  },
  stream(c, w, h, t) {
    c.lineWidth = 2;
    for (let l = 0; l < 4; l++) {
      c.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = h * (0.3 + l * 0.13) + Math.sin(x / w * 9 + t * (0.9 + l * 0.2) + l) * 10;
        if (x) c.lineTo(x, y);
        else c.moveTo(x, y);
      }
      c.strokeStyle = l === 1 ? INK(0.9) : INK(0.18);
      c.stroke();
    }
  },
  market(c, w, h, t) {
    const L = Array.from({ length: 5 }, (_, i) => [w * 0.28, h * (0.22 + i * 0.14)]);
    const R = Array.from({ length: 4 }, (_, i) => [w * 0.72, h * (0.29 + i * 0.14)]);
    L.forEach(([ax, ay], i) =>
      R.forEach(([bx, by], j) => {
        const live = Math.sin(t + i * 1.9 + j * 2.7) > 0.8;
        c.strokeStyle = live ? INK(0.8) : INK(0.08);
        c.lineWidth = live ? 1.5 : 1;
        c.beginPath();
        c.moveTo(ax, ay);
        c.bezierCurveTo(w / 2, ay, w / 2, by, bx, by);
        c.stroke();
      }),
    );
    [...L, ...R].forEach(([x, y]) => {
      c.fillStyle = "#111";
      c.beginPath();
      c.arc(x, y, Math.min(7, h * 0.035), 0, 7);
      c.fill();
      c.strokeStyle = INK(0.7);
      c.stroke();
    });
  },
  graph(c, w, h, t) {
    const pts = Array.from({ length: 40 }, (_, i) => {
      const a = i * 2.4 + t * 0.06, r = Math.sqrt(i / 40) * Math.min(w, h) * 0.38;
      return [w / 2 + Math.cos(a) * r * 1.3, h / 2 + Math.sin(a) * r];
    });
    const q = pts[Math.floor((Math.sin(t * 0.5) * 0.5 + 0.5) * 20)];
    pts.forEach(([x, y]) => {
      const d = Math.hypot(x - q[0], y - q[1]);
      if (d < 90) {
        c.strokeStyle = INK(0.5 * (1 - d / 90));
        c.beginPath();
        c.moveTo(q[0], q[1]);
        c.lineTo(x, y);
        c.stroke();
      }
      c.fillStyle = d < 90 ? INK(0.9) : INK(0.25);
      c.beginPath();
      c.arc(x, y, 3, 0, 7);
      c.fill();
    });
  },
  ledger(c, w, h, t) {
    const rows = 6, rw = w * 0.56, x0 = (w - rw) / 2, rh = 26, y0 = (h - rows * (rh + 8)) / 2;
    const k = Math.floor(t * 0.9) % rows;
    for (let i = 0; i < rows; i++) {
      c.fillStyle = i === k ? INK(0.9) : GLASS;
      c.beginPath();
      c.roundRect(x0, y0 + i * (rh + 8), rw, rh, 8);
      c.fill();
      c.fillStyle = i === k ? "rgba(0,0,0,0.6)" : INK(0.25);
      c.beginPath();
      c.roundRect(x0 + 12, y0 + i * (rh + 8) + 10, rw * (0.3 + rand(i) * 0.3), 6, 3);
      c.fill();
    }
  },
  fusion(c, w, h, t) {
    c.lineWidth = 2;
    for (let s = 0; s < 2; s++) {
      c.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const k = x / w, m = Math.min(1, k * 1.7);
        const y = h / 2 + (s ? -1 : 1) * h * 0.2 * (1 - m) + Math.sin(k * 14 + t * 1.3 + s * 2) * 9 * (1 - m * 0.7);
        if (x) c.lineTo(x, y);
        else c.moveTo(x, y);
      }
      c.strokeStyle = s ? INK(0.85) : INK(0.3);
      c.stroke();
    }
  },
};

export default function Cover({ kind, className = "" }: { kind: CoverKind; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const c = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, on = false, t = rand(kind.length) * 10, last = performance.now();
    const size = () => {
      const d = Math.min(devicePixelRatio, 2);
      cv.width = cv.clientWidth * d;
      cv.height = cv.clientHeight * d;
      c.setTransform(d, 0, 0, d, 0, 0);
    };
    const frame = (now: number) => {
      t += reduce ? 0 : (now - last) / 1000;
      last = now;
      c.clearRect(0, 0, cv.clientWidth, cv.clientHeight);
      draw[kind](c, cv.clientWidth, cv.clientHeight, t);
      if (on && !reduce) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = performance.now();
      if (on) raf = requestAnimationFrame(frame);
    });
    const ro = new ResizeObserver(() => {
      size();
      frame(performance.now());
    });
    ro.observe(cv);
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [kind]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: tint[kind] }}>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
}
