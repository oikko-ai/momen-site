"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/cms";
import Avatar from "./Avatar";

// Large quotes that cross-fade one to the next. Advances on its own and pauses while hovered.
export default function Testimonials({ items, title }: { items: Testimonial[]; title?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  if (!items.length) return null;
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex flex-col justify-between gap-6">
        {title && <h2 className="text-h2 font-light">{title}</h2>}
        {items.length > 1 && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-label tabular-nums text-soft">
              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  onClick={() => setI((x) => (x + d + items.length) % items.length)}
                  aria-label={d < 0 ? "Previous quote" : "Next quote"}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-soft transition-colors hover:border-white/30 hover:text-ink"
                >
                  {d < 0 ? "←" : "→"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="grid">
        {items.map((t, k) => (
          <figure
            key={k}
            aria-hidden={k !== i}
            className={`[grid-area:1/1] transition-all duration-700 ease-[var(--ease)] ${k === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
          >
            <blockquote className="text-h2 font-light text-ink/95">
              <span className="text-faint">“</span>
              {t.quote}
              <span className="text-faint">”</span>
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <Avatar name={t.name} image={t.avatar} className="h-14 w-14" />
              <span>
                <span className="block text-body">{t.name}</span>
                <span className="block text-small text-soft">{[t.role, t.client].filter(Boolean).join(" · ")}</span>
              </span>
              {t.demo && <span className="eyebrow ml-auto rounded-full border border-white/10 px-3 py-1.5">Placeholder</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
