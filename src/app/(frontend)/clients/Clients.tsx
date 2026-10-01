"use client";

import Link from "next/link";
import { useState } from "react";
import type { Client } from "@/lib/cms";
import Chips from "@/components/Chips";

// An A to Z index of clients. Each row shows what they do, the projects made for them and a link to their site.
export default function Clients({ clients, tags, visitLabel }: { clients: Client[]; tags: string[]; visitLabel: string }) {
  const [tag, setTag] = useState<string>("All");
  const list = clients.filter((c) => tag === "All" || c.tags.includes(tag)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <Chips tags={tags} value={tag} onChange={setTag} />
      <ul className="mt-block border-b border-rule">
        {list.map((c, i) => {
          const letter = c.name[0].toUpperCase();
          const first = i === 0 || list[i - 1].name[0].toUpperCase() !== letter;
          return (
            <li
              key={tag + c.name}
              data-spot
              className="rise grid grid-cols-[40px_1fr] items-baseline gap-x-4 gap-y-3 border-t border-rule py-7 md:grid-cols-[80px_minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)_96px] md:gap-x-8"
              style={{ ["--i" as string]: i }}
            >
              <span className="font-mono text-label text-faint">{first ? letter : ""}</span>
              <span className="flex items-center gap-4">
                {c.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo.url} alt="" className="h-8 w-auto opacity-80" />
                )}
                <span className="text-h3 font-light">{c.name}</span>
              </span>
              <span className="col-start-2 text-small text-soft md:col-start-auto">{c.note}</span>
              <span className="col-start-2 flex flex-wrap gap-x-3 gap-y-1 text-small md:col-start-auto">
                {c.projects.map((p) => (
                  <Link key={p.slug} href={`/work/${p.slug}`} className="u relative z-10">
                    {p.title}
                  </Link>
                ))}
              </span>
              <span className="col-start-2 md:col-start-auto md:text-right">
                {c.href && (
                  <a href={c.href} target="_blank" rel="noreferrer" className="relative z-10 inline-flex items-center gap-1.5 text-small text-soft transition-colors hover:text-ink">
                    {visitLabel} <span>↗</span>
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
