import type { Metadata } from "next";
import { getNotes, getPages, getSite } from "@/lib/cms";
import Subscribe from "./Subscribe";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).notes.title };
}

export default async function Notes() {
  const [notes, site, pages] = await Promise.all([getNotes(), getSite(), getPages()]);
  const [emptyFirst, ...emptyRest] = pages.notes.emptyText.split("\n");
  const linkedin = site.socials.find((s) => s.label.toLowerCase() === "linkedin")?.href;
  const years = [...new Set(notes.map((n) => n.year))].sort().reverse();
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <h1 className="rise pb-12 pt-14 text-[44px] font-light tracking-[-0.03em] md:pt-20 md:text-[64px]">{pages.notes.title}</h1>
      <div className="grid gap-12 md:grid-cols-[1fr_340px] md:gap-16">
        <div>
          {years.length === 0 ? (
            <div className="grid grid-cols-[64px_1fr] gap-4 text-[16px]" data-inview>
              <span className="text-faint">2026</span>
              <div className="space-y-3">
                <p>{emptyFirst}</p>
                {emptyRest.map((t) => (
                  <p key={t} className="text-soft">{t}</p>
                ))}
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
        <Subscribe email={site.email} linkedin={linkedin} title={pages.notes.signupTitle} text={pages.notes.signupText} />
      </div>
    </div>
  );
}
