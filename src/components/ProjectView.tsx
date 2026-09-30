import Link from "next/link";
import { getProjects } from "@/lib/cms";
import Visual from "@/components/Visual";

// Case study body, shared by the /work/[slug] route and the single-page preview.
export default async function ProjectView({ slug }: { slug: string }) {
  const projects = await getProjects();
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) return null;
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="mx-auto max-w-[1040px] px-5 md:px-7">
      <h1 className="rise pt-10 text-[72px] font-light leading-none tracking-[-0.045em] text-[#8f8f8b] md:pt-16 md:text-[168px]">{p.title}</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <p className="rise text-[17px] leading-relaxed text-soft" style={{ ["--i" as string]: 1 }}>
          {p.intro}
        </p>
        <dl className="rise grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 text-[13px]" style={{ ["--i" as string]: 2 }}>
          <dt className="text-faint">Team</dt>
          <dd className="text-soft">{p.team}</dd>
          <dt className="text-faint">Services</dt>
          <dd className="flex flex-wrap gap-1.5">
            {p.services.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </dd>
          <dt className="text-faint">Date</dt>
          <dd className="text-soft">{p.year}</dd>
        </dl>
      </div>

      <Visual media={p.image} cover={p.cover} className="rise mt-14 aspect-[16/10] rounded-xl" />

      {p.sections.map((s) => (
        <section key={s.heading} className="mt-24">
          <div className="grid gap-4 md:grid-cols-[1fr_1.6fr] md:gap-16" data-inview>
            <h2 className="text-[18px]">{s.heading}</h2>
            <p className="text-[16px] leading-relaxed text-soft">{s.body}</p>
          </div>
          <div className="mt-10 rounded-xl bg-card p-6 md:p-12" data-inview>
            <Visual media={s.image} cover={s.cover} className="aspect-[16/10] rounded-lg" />
          </div>
        </section>
      ))}

      <Link href={`/work/${next.slug}`} className="group mt-28 flex items-center justify-between border-t border-rule pt-6 text-[14px]" data-inview>
        <span className="text-soft">Next project</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">{next.title} →</span>
      </Link>
    </article>
  );
}
