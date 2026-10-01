"use client";

import Link from "next/link";
import { useState } from "react";
import type { Person } from "@/lib/cms";
import Chips from "@/components/Chips";
import Avatar from "@/components/Avatar";

type Row = Person & { tags: string[]; projects: { slug: string; title: string }[] };

// One card per person: photo or placeholder, role, a short bio, and the projects they're on (worked out from each project's team).
export default function People({ people, tags, projectsLabel }: { people: Row[]; tags: string[]; projectsLabel: string }) {
  const [tag, setTag] = useState<string>("All");
  const list = people.filter((p) => tag === "All" || p.tags.includes(tag)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <Chips tags={tags} value={tag} onChange={setTag} />
      <ul className="mt-block grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {list.map((p, i) => (
          <li key={tag + p.name} className="rise" style={{ ["--i" as string]: i }}>
            <div data-spot className="flex h-full flex-col rounded-3xl bg-card p-6 transition-colors duration-500 hover:bg-[#191919] md:p-8">
              <div className="flex items-start justify-between gap-4">
                <Avatar name={p.name} image={p.avatar} className="h-20 w-20 md:h-24 md:w-24" />
                {p.demo && <span className="eyebrow rounded-full border border-white/10 px-3 py-1.5">Demo persona</span>}
              </div>
              <h2 className="mt-6 text-h3">{p.name}</h2>
              <p className="mt-1 text-small text-soft">{p.role}</p>
              {p.bio && <p className="mt-4 text-small text-soft/90">{p.bio}</p>}
              <div className="mt-auto pt-6">
                {p.projects.length > 0 && (
                  <div className="border-t border-white/5 pt-5">
                    <p className="eyebrow">{projectsLabel}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.projects.map((x) => (
                        <li key={x.slug}>
                          <Link href={`/work/${x.slug}`} className="relative z-10 block rounded-full border border-white/10 px-3 py-1.5 text-small transition-colors hover:border-white/30">
                            {x.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.href && (
                  <a href={p.href} target="_blank" rel="noreferrer" className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-small text-soft transition-colors hover:text-ink">
                    Profile <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
