import type { Metadata } from "next";
import Link from "next/link";
import { getNotes, getPages, getSite } from "@/lib/cms";
import Subscribe from "./Subscribe";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).notes.title };
}

export default async function Notes() {
  const [notes, site, pages] = await Promise.all([getNotes(), getSite(), getPages()]);
  const p = pages.notes;
  const [emptyFirst, ...emptyRest] = p.emptyText.split("\n");
  const years = [...new Set(notes.map((n) => n.year))];
  return (
    <div className="wrap">
      <PageHead title={p.title} intro={p.intro} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-14 md:grid-cols-[minmax(0,1fr)_400px] md:gap-20">
        <div className="min-w-0">
          {years.length === 0 ? (
            <div className="grid grid-cols-[72px_1fr] gap-4 text-lead" data-inview>
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
              <section key={y} className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-rule pb-6 pt-6 md:grid-cols-[120px_1fr]" data-inview style={{ transitionDelay: `${i * 60}ms` }}>
                <h2 className="pt-1.5 font-mono text-label text-faint">{y}</h2>
                <ul className="space-y-1">
                  {notes
                    .filter((n) => n.year === y)
                    .map((n) => (
                      <li key={n.slug}>
                        {n.href ? (
                          <a href={n.href} target="_blank" rel="noreferrer" className="group block py-2">
                            <span className="text-h3 font-light transition-colors group-hover:text-soft">{n.title}</span> <span className="text-faint">↗</span>
                            {n.summary && <span className="mt-1 block text-small text-soft">{n.summary}</span>}
                          </a>
                        ) : (
                          <Link href={`/notes/${n.slug}`} className="group block py-2">
                            <span className="text-h3 font-light transition-colors group-hover:text-soft">{n.title}</span>
                            {n.summary && <span className="mt-1 block text-small text-soft">{n.summary}</span>}
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
