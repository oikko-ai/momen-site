import type { Metadata } from "next";
import { getPages } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import Roll from "./Roll";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPages();
  return pageMeta({ title: p.credits.title, description: p.credits.intro, path: "/credits", seo: p.seo("credits") });
}

const Name = ({ name, href }: { name: string; href?: string }) =>
  href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="transition-colors hover:text-soft">
      {name}
    </a>
  ) : (
    <>{name}</>
  );

// Film-style end credits: who and what made the site, in groups of role and name, all edited in the CMS.
export default async function Credits() {
  const { credits: c } = await getPages();
  return (
    <div className="wrap pb-section text-center">
      <h1 className="sr-only">{c.title}</h1>
      {c.intro && (
        <p className="rise mx-auto max-w-[40ch] pt-section text-lead text-ink" style={{ ["--i" as string]: 1 }}>
          {c.intro}
        </p>
      )}
      {c.groups.map((g) => (
        <section key={g.title} className="mt-section" data-inview>
          <h2 className="eyebrow">{g.title}</h2>
          <dl className="mt-10 space-y-4 text-body md:text-lead">
            {g.rows.map((r) => (
              <div key={r.role + r.name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-5 md:gap-x-8">
                <dt className="text-right text-soft">{r.role}</dt>
                <dd className="text-left">
                  <Name name={r.name} href={r.href || undefined} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      {c.thanks.length > 0 && (
        <section className="mt-section" data-inview>
          <h2 className="eyebrow">{c.thanksTitle}</h2>
          <ul className="mx-auto mt-10 flex max-w-[640px] flex-wrap justify-center gap-x-8 gap-y-3 text-body md:text-lead">
            {c.thanks.map((t) => (
              <li key={t.name}>
                <Name name={t.name} href={t.href || undefined} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {c.dedication && (
        <section className="mt-section" data-inview>
          <h2 className="eyebrow">{c.dedicationTitle}</h2>
          <p className="mt-10 text-body md:text-lead">{c.dedication}</p>
        </section>
      )}
      <Roll play={c.rollLabel} pause={c.pauseLabel} music={c.music?.url} />
    </div>
  );
}
