"use client";

import Link from "next/link";
import type { Project } from "@/lib/cms";
import DeviceFrame from "./DeviceFrame";

// Slowly drifting row of work, each piece shown in the device picked for it in the CMS. Pauses on hover.
export default function WorkStrip({ items }: { items: Project[] }) {
  const loop = [...items, ...items];
  return (
    <div className="group/strip overflow-hidden">
      <div className="marquee flex w-max gap-4 px-2 group-hover/strip:[animation-play-state:paused]">
        {loop.map((p, i) => (
          <Link
            key={i}
            href={`/work/${p.slug}`}
            aria-hidden={i >= items.length}
            tabIndex={i >= items.length ? -1 : undefined}
            data-spot className="group relative grid h-[230px] w-[320px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-card md:h-[300px] md:w-[430px]"
          >
            <div
              className={`transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-y-1.5 group-hover:scale-[1.04] ${
                p.device === "phone" ? "w-[26%]" : "w-[70%]"
              }`}
            >
              <DeviceFrame
                device={p.device}
                media={p.image}
                cover={p.cover}
                className="w-full"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-small">{p.title}</p>
              <p className="text-micro text-white/60">{p.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
