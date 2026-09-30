"use client";

import { useState } from "react";
import { peopleTags } from "@/content";

type Person = { name: string; role: string; tags: string[]; href?: string; avatar: { url: string } | null };
import Chips from "@/components/Chips";

const hues = [210, 150, 30, 330, 270, 180];

export default function People({ people }: { people: Person[] }) {
  const [tag, setTag] = useState<string>("All");
  const list = people.filter((p) => tag === "All" || p.tags.includes(tag)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <Chips tags={peopleTags} value={tag} onChange={setTag} />
      <ul className="mt-10 grid gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
        {list.map((p, i) => (
          <li key={tag + p.name} className="rise flex items-center gap-3 text-[16px]" style={{ ["--i" as string]: i }}>
            <span
              className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full text-[11px]"
              style={{ background: `hsl(${hues[p.name.length % 6]} 35% 28%)` }}
            >
              {p.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatar.url} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                p.name.split(" ").map((w) => w[0]).join("")
              )}
            </span>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noreferrer" className="hover:text-soft">
                {p.name} <span className="text-soft">{p.role}</span>
              </a>
            ) : (
              <span>
                {p.name} <span className="text-soft">{p.role}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
