"use client";

import { useState } from "react";

type Client = { name: string; note: string; tags: string[]; href?: string };
import Chips from "@/components/Chips";

export default function Clients({ clients, tags }: { clients: Client[]; tags: string[] }) {
  const [tag, setTag] = useState<string>("All");
  const list = clients.filter((c) => tag === "All" || c.tags.includes(tag)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <Chips tags={tags} value={tag} onChange={setTag} />
      <ul className="mt-10">
        {list.map((c, i) => {
          const letter = c.name[0].toUpperCase();
          const first = i === 0 || list[i - 1].name[0].toUpperCase() !== letter;
          return (
            <li key={tag + c.name} className="rise grid grid-cols-[48px_1fr] py-2 text-[16px]" style={{ ["--i" as string]: i }}>
              <span className="text-faint">{first ? letter : ""}</span>
              <span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" className="hover:text-soft">
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}{" "}
                <span className="text-soft">{c.note}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
