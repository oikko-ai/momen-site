"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/cms";
import Visual from "./Visual";

// Full-bleed horizontal showcase of featured work. Swipe or scroll sideways; snaps to each card.
export default function Rail({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    // Start with the first card centred, peeking the next one.
    const first = el.children[0] as HTMLElement;
    el.scrollLeft = first.offsetLeft - (el.clientWidth - first.clientWidth) / 2;
  }, []);

  const go = (dir: number) => {
    const el = ref.current!;
    el.scrollBy({ left: dir * (el.children[0] as HTMLElement).clientWidth, behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div ref={ref} className="rail flex gap-4 overflow-x-auto px-[8vw] md:gap-6 md:px-[max(22vw,calc(50vw-540px))]">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="rise group relative block w-[84vw] shrink-0 overflow-hidden rounded-3xl md:w-[56vw] md:max-w-[1080px]"
            style={{ ["--i" as string]: i + 3 }}
          >
            <Visual media={p.image} cover={p.cover} className="aspect-[4/5] transition-transform duration-[1.2s] ease-[var(--ease)] group-hover:scale-[1.03] sm:aspect-[16/10]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20 md:p-9 md:pt-28">
              <h3 className="text-h3">{p.title}</h3>
              <p className="mt-1 text-small text-white/70">{p.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.services.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {[-1, 1].map((d) => (
        <button
          key={d}
          onClick={() => go(d)}
          aria-label={d < 0 ? "Previous" : "Next"}
          className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-ink opacity-0 backdrop-blur-md transition-opacity duration-300 hover:bg-white/20 group-hover/rail:opacity-100 md:grid ${d < 0 ? "left-6" : "right-6"}`}
        >
          {d < 0 ? <ArrowLeft className="h-5 w-5" strokeWidth={1.75} /> : <ArrowRight className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      ))}
    </div>
  );
}
