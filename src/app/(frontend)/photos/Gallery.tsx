"use client";

import { useEffect, useState } from "react";
import type { Media } from "@/lib/cms";

type Photo = { image: Media; caption: string };

const tints = ["#1d2a1f", "#2a2622", "#1c2328", "#262126", "#23261f", "#2b2019"];

function Tile({ p, i, big = false }: { p: Photo; i: number; big?: boolean }) {
  if (p.image)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image.url} alt={p.caption} className="h-full w-full object-cover" loading="lazy" />;
  return (
    <div className="grid h-full w-full place-items-center" style={{ background: `radial-gradient(120% 100% at 30% 20%, ${tints[i % 6]}, #0c0c0c)` }}>
      <span className={`eyebrow ${big ? "text-soft" : ""}`}>Photo {i + 1}</span>
    </div>
  );
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o! + 1) % photos.length);
      if (e.key === "ArrowLeft") setOpen((o) => (o! - 1 + photos.length) % photos.length);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, photos.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <button key={i} onClick={() => setOpen(i)} className="rise aspect-[4/3] overflow-hidden rounded-2xl" style={{ ["--i" as string]: i }} aria-label={`Open ${p.caption}`}>
            <div className="h-full w-full transition-transform duration-500 ease-[var(--ease)] hover:scale-105">
              <Tile p={p} i={i} />
            </div>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="fade fixed inset-0 z-50 grid place-items-center bg-black/95 p-6" onClick={() => setOpen(null)} role="dialog" aria-modal>
          <div className="pop aspect-[4/3] w-full max-w-[1100px] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <Tile p={photos[open]} i={open} big />
          </div>
          <button className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-ink" onClick={() => setOpen(null)} aria-label="Close">
            ×
          </button>
          {[-1, 1].map((d) => (
            <button
              key={d}
              aria-label={d < 0 ? "Previous" : "Next"}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => (o! + d + photos.length) % photos.length);
              }}
              className={`absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-ink ${d < 0 ? "left-4" : "right-4"}`}
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
