import type { Metadata } from "next";
import { getNotes, getSite } from "@/lib/cms";
import Subscribe from "./Subscribe";

export const metadata: Metadata = { title: "Notes" };

export default async function Notes() {
  const [notes, site] = await Promise.all([getNotes(), getSite()]);
  const linkedin = site.socials.find((s) => s.label.toLowerCase() === "linkedin")?.href;
  const years = [...new Set(notes.map((n) => n.year))].sort().reverse();
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <h1 className="rise pb-12 pt-14 text-[44px] font-light tracking-[-0.03em] md:pt-20 md:text-[64px]">Notes</h1>
      <div className="grid gap-12 md:grid-cols-[1fr_340px] md:gap-16">
        <div>
          {years.length === 0 ? (
            <div className="grid grid-cols-[64px_1fr] gap-4 text-[16px]" data-inview>
              <span className="text-faint">2026</span>
              <div className="space-y-3">
                <p>The first notes are on their way.</p>
                <p className="text-soft">On shipping AI that people trust, research, and building a company in Dhaka.</p>
              </div>
            </div>
          ) : (
            years.map((y) => (
              <section key={y} className="grid grid-cols-[64px_1fr] gap-4 pb-6 text-[16px]" data-inview>
                <h2 className="text-faint">{y}</h2>
                <ul className="space-y-3.5">
                  {notes
                    .filter((n) => n.year === y)
                    .map((n) => (
                      <li key={n.href}>
                        <a href={n.href} className="transition-colors hover:text-soft">{n.title}</a>
                      </li>
                    ))}
                </ul>
              </section>
            ))
          )}
        </div>
        <Subscribe email={site.email} linkedin={linkedin} />
      </div>
    </div>
  );
}
