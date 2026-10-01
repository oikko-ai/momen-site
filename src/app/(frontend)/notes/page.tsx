import type { Metadata } from "next";
import Link from "next/link";
import { getNotes, getPages, getSite } from "@/lib/cms";
import Subscribe from "./Subscribe";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).notes.title };
}

export default async function Notes() {
  const [notes, site, pages] = await Promise.all([getNotes(), getSite(), getPages()]);
  const p = pages.notes;
  const [emptyFirst, ...emptyRest] = p.emptyText.split("\n");
  const years = [...new Set(notes.map((n) => n.year))];
  return (
    <div className="mx-auto max-w-[1120px] px-5 md:px-7">
      <h1 className="rise pb-12 pt-10 text-[52px] font-light tracking-[-0.035em] md:pb-16 md:pt-16 md:text-[84px]">{p.title}</h1>
      {p.intro && <p className="rise -mt-6 mb-12 max-w-[46ch] text-[18px] leading-relaxed text-soft">{p.intro}</p>}
      <div className="grid gap-14 md:grid-cols-[1fr_400px] md:gap-16">
        <div>
          {years.length === 0 ? (
            <div className="grid grid-cols-[72px_1fr] gap-4 text-[18px]" data-inview>
              <span className="text-faint">{new Date().getFullYear()}</span>
              <div className="space-y-3">
                <p>{emptyFirst}</p>
                {emptyRest.map((t) => (
                  <p key={t} className="text-soft">{t}</p>
                ))}
              </div>
            </div>
          ) : (
            years.map((y, i) => (
              <section key={y} className="grid grid-cols-[72px_1fr] gap-4 pb-8 md:grid-cols-[96px_1fr]" data-inview style={{ transitionDelay: `${i * 60}ms` }}>
                <h2 className="pt-0.5 text-[16px] text-soft md:text-[17px]">{y}</h2>
                <ul className="space-y-5">
                  {notes
                    .filter((n) => n.year === y)
                    .map((n) => (
                      <li key={n.slug}>
                        {n.href ? (
                          <a href={n.href} target="_blank" rel="noreferrer" className="text-[18px] transition-colors hover:text-soft md:text-[19px]">
                            {n.title} <span className="text-faint">↗</span>
                          </a>
                        ) : (
                          <Link href={`/notes/${n.slug}`} className="text-[18px] transition-colors hover:text-soft md:text-[19px]">
                            {n.title}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            ))
          )}
        </div>
        <Subscribe email={site.email} title={p.signupTitle} text={p.signupText} doneText={p.signedUpText} rss={p.rssLabel && !process.env.NEXT_PUBLIC_PREVIEW ? "/notes/rss.xml" : undefined} rssLabel={p.rssLabel} />
      </div>
    </div>
  );
}
