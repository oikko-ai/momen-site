import type { Metadata } from "next";
import { getAbout, getAwards, getPapers, getPlayground, getSite } from "@/lib/cms";
import Portrait from "@/components/Portrait";
import Visual from "@/components/Visual";

export const metadata: Metadata = { title: "About" };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-28 grid gap-6 md:grid-cols-[minmax(0,460px)_1fr] md:gap-16" data-inview>
      <h2 className="text-[28px] font-light tracking-[-0.01em] md:text-[34px]">{title}</h2>
      <ul className="space-y-5">{children}</ul>
    </section>
  );
}

const paperCovers = ["fusion", "graph"] as const;

export default async function About() {
  const [site, about, papers, awards, playground] = await Promise.all([getSite(), getAbout(), getPapers(), getAwards(), getPlayground()]);
  const github = site.socials.find((s) => s.label.toLowerCase() === "github");
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-7">
      <h1 className="rise pb-10 pt-12 text-[48px] font-light leading-none tracking-[-0.03em] md:pb-14 md:pt-16 md:text-[72px]">About</h1>

      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,460px)_1fr] md:gap-16">
        <Portrait src={site.portrait?.url} className="rise aspect-[4/5] w-full" />
        <div className="rise" style={{ ["--i" as string]: 2 }}>
          <h2 className="whitespace-pre-line text-[32px] font-light leading-[1.15] tracking-[-0.02em] md:text-[44px]">{about.heading}</h2>
          <div className="mt-8 max-w-[62ch] space-y-6 text-[18px] leading-relaxed text-soft md:text-[20px]">
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {papers.length > 0 && (
        <Group title="Research">
          {papers.map((p, i) => (
            <li key={p.title}>
              <a href={p.href} target="_blank" rel="noreferrer" className="flex items-center gap-5">
                <Visual media={p.image} cover={paperCovers[i % 2]} className="aspect-[16/10] w-28 shrink-0 rounded-md md:w-32" />
                <div>
                  <p className="text-[17px] md:text-[18px]">{p.title}</p>
                  <p className="mt-1 text-[14px] text-soft">{[p.venue && `${p.venue}, ${p.year}`, p.status].filter(Boolean).join(" · ")}</p>
                </div>
              </a>
            </li>
          ))}
        </Group>
      )}

      {awards.length > 0 && (
        <Group title="Recognition">
          {awards.map((a) => (
            <li key={a.title + a.where} className="text-[17px] md:text-[18px]">
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
        <Group title="Playground">
          {playground.map((p) => (
            <li key={p.title} className="text-[17px] md:text-[18px]">
              <a href={p.href} target="_blank" rel="noreferrer" className="group">
                {p.title} <span className="text-soft transition-colors group-hover:text-ink">{p.body}</span>
              </a>
            </li>
          ))}
          {github && (
            <li>
              <a href={github.href} target="_blank" rel="noreferrer" className="text-[15px] text-soft hover:text-ink">
                View all on GitHub →
              </a>
            </li>
          )}
        </Group>
      )}
    </div>
  );
}
