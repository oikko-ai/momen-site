"use client";

import Link from "next/link";
import type { Project } from "@/lib/cms";
import Visual from "./Visual";

// Slowly drifting row of work, each piece shown inside a phone or tablet frame. Pauses on hover.
export default function WorkStrip({ items }: { items: Project[] }) {
  const loop = [...items, ...items];
  return (
    <div className="group/strip overflow-hidden">
      <div className="marquee flex w-max gap-4 px-2 group-hover/strip:[animation-play-state:paused]">
        {loop.map((p, i) => {
          const phone = i % 3 !== 2;
          return (
            <Link
              key={i}
              href={`/work/${p.slug}`}
              aria-hidden={i >= items.length}
              tabIndex={i >= items.length ? -1 : undefined}
              className="group relative grid h-[210px] w-[300px] shrink-0 place-items-center overflow-hidden rounded-xl bg-card md:h-[250px] md:w-[360px]"
            >
              <div
                className={`relative h-[82%] overflow-hidden border-[3px] border-[#2a2a2a] bg-black shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-y-1.5 group-hover:scale-[1.04] ${
                  phone ? "aspect-[9/19] rounded-[22px]" : "aspect-[4/3] rounded-[14px]"
                }`}
              >
                <div className="absolute inset-0">
                  <Visual media={p.image} cover={p.cover} className="h-full w-full" />
                </div>
                {phone && <span className="absolute left-1/2 top-1.5 h-2.5 w-9 -translate-x-1/2 rounded-full bg-black" />}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[13px]">{p.title}</p>
                <p className="text-[12px] text-white/60">{p.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
