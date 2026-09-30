import Link from "next/link";
import { getPages, getProjects, type GalleryImage } from "@/lib/cms";
import Visual from "@/components/Visual";

// Full-width shots sit in a browser window on a dark panel; half-width shots pair up with captions underneath.
function Shot({ g, i }: { g: GalleryImage; i: number }) {
  if (g.width === "full")
    return (
      <figure className="md:col-span-2" data-inview style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
        <div className="overflow-hidden rounded-2xl bg-[#111] p-4 md:p-10">
          <div className="settle overflow-hidden rounded-xl bg-[#1b1b1b] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto h-4 w-1/3 rounded-full bg-white/5" />
            </div>
            <Visual media={g.image} cover={g.cover} className="aspect-[16/10]" />
          </div>
        </div>
        {g.caption && <figcaption className="mt-3.5 text-[14px] text-soft">{g.caption}</figcaption>}
      </figure>
    );
  return (
    <figure data-inview style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
      <div className="overflow-hidden rounded-2xl bg-[#111] p-4 md:p-7">
        <div className="settle overflow-hidden rounded-lg">
          <Visual media={g.image} cover={g.cover} className="aspect-[4/3]" />
        </div>
      </div>
      {g.caption && <figcaption className="mt-3.5 text-[14px] text-soft">{g.caption}</figcaption>}
    </figure>
  );
}

// Case study body, shared by the /work/[slug] route and the single-page preview.
export default async function ProjectView({ slug }: { slug: string }) {
  const [projects, pages] = await Promise.all([getProjects(), getPages()]);
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) return null;
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="mx-auto max-w-[1080px] px-5 md:px-7">
      <h1 className="rise pt-12 text-[56px] font-light leading-[1] tracking-[-0.04em] md:pt-20 md:text-[96px]">{p.title}</h1>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.25fr_1fr] md:gap-16">
        <div className="rise" style={{ ["--i" as string]: 1 }}>
          <p className="text-[18px] leading-relaxed text-ink/85 md:text-[19px]">{p.intro}</p>
          {p.credit && <p className="mt-6 text-[16px] italic leading-relaxed text-soft">{p.credit}</p>}
        </div>
        <dl className="rise grid h-max grid-cols-[96px_1fr] items-start gap-x-5 gap-y-5 text-[14px]" style={{ ["--i" as string]: 2 }}>
          <dt className="pt-1 text-[11px] uppercase tracking-[0.12em] text-faint">Team</dt>
          <dd className="text-soft">
            {p.teamMembers.length ? (
              <span className="flex -space-x-1.5">
                {p.teamMembers.map((m) => (
                  <span key={m.name} title={m.name} className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-paper bg-[#2a2a2a] text-[11px] text-ink">
                    {m.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar.url} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)
                    )}
                  </span>
                ))}
              </span>
            ) : (
              p.team
            )}
          </dd>
          <dt className="pt-1 text-[11px] uppercase tracking-[0.12em] text-faint">Services</dt>
          <dd className="flex flex-wrap gap-1.5">
            {p.services.map((s) => (
              <span key={s} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/80">
                {s}
              </span>
            ))}
          </dd>
          <dt className="pt-1 text-[11px] uppercase tracking-[0.12em] text-faint">Date</dt>
          <dd className="text-soft">{p.year}</dd>
        </dl>
      </div>

      {p.sections.map((s) => (
        <section key={s.heading} className="mt-24 md:mt-32">
          <div className="grid gap-4 md:grid-cols-[1fr_2.2fr] md:gap-16" data-inview>
            <h2 className="text-[19px] md:text-[20px]">{s.heading}</h2>
            <p className="text-[17px] leading-relaxed text-soft md:text-[18px]">{s.body}</p>
          </div>
          {s.gallery.length > 0 && (
            <div className="mt-12 grid gap-x-5 gap-y-10 md:grid-cols-2">
              {s.gallery.map((g, j) => (
                <Shot key={j} g={g} i={j} />
              ))}
            </div>
          )}
        </section>
      ))}

      {next && next.slug !== p.slug && (
        <Link href={`/work/${next.slug}`} className="group mt-32 flex items-center justify-between border-t border-rule pt-7 text-[16px]" data-inview>
          <span className="text-soft">{pages.work.nextLabel}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">{next.title} →</span>
        </Link>
      )}
    </article>
  );
}
