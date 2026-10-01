import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAbout, getAwards, getPages, getPapers, getPlayground, getSite } from "@/lib/cms";
import Portrait from "@/components/Portrait";
import Visual from "@/components/Visual";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).about.title };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-section grid gap-8 border-t border-rule pt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16" data-inview>
      <h2 className="text-h2 font-light">{title}</h2>
      <ul className="space-y-6">{children}</ul>
    </section>
  );
}

const paperCovers = ["fusion", "graph"] as const;

export default async function About() {
  const [site, about, papers, awards, playground, pages] = await Promise.all([getSite(), getAbout(), getPapers(), getAwards(), getPlayground(), getPages()]);
  const t = pages.about;
  const github = site.socials.find((s) => s.label.toLowerCase() === "github");
  return (
    <div className="wrap">
      <PageHead title={t.title} />

      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] xl:gap-24">
        <Portrait src={site.portrait?.url} name={site.name} label={pages.labels.portraitPlaceholder} className="rise aspect-[4/5] w-full" />
        <div className="rise md:pt-4" style={{ ["--i" as string]: 2 }}>
          <h2 className="whitespace-pre-line text-h2 font-light">{about.heading}</h2>
          <div className="mt-8 max-w-[62ch] space-y-6 text-lead text-soft">
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {papers.length > 0 && (
        <Group title={t.researchTitle}>
          {papers.map((p, i) => (
            <li key={p.title}>
              <a href={p.href} target="_blank" rel="noreferrer" className="flex items-center gap-5">
                <Visual media={p.image} cover={paperCovers[i % 2]} className="aspect-[16/10] w-28 shrink-0 rounded-lg md:w-40" />
                <div>
                  <p className="text-lead">{p.title}</p>
                  <p className="mt-1 text-small text-soft">{[p.venue && `${p.venue}, ${p.year}`, p.status].filter(Boolean).join(" · ")}</p>
                </div>
              </a>
            </li>
          ))}
        </Group>
      )}

      {awards.length > 0 && (
        <Group title={t.recognitionTitle}>
          {awards.map((a) => (
            <li key={a.title + a.where} className="text-lead">
              {a.title}{" "}
              <span className="text-soft">
                {a.where}
                {a.year && `, ${a.year}`}
              </span>
            </li>
          ))}
        </Group>
      )}

      {playground.length > 0 && (
        <Group title={t.playgroundTitle}>
          {playground.map((p) => (
            <li key={p.title} className="text-lead">
              <a href={p.href} target="_blank" rel="noreferrer" className="group">
                {p.title} <span className="text-soft transition-colors group-hover:text-ink">{p.body}</span>
              </a>
            </li>
          ))}
          {github && (
            <li>
              <a href={github.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-small text-soft hover:text-ink">
                {t.githubLabel} <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size="1em" strokeWidth={1.75} aria-hidden />
              </a>
            </li>
          )}
        </Group>
      )}
    </div>
  );
}
