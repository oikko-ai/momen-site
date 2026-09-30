import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/cms";
import Visual from "@/components/Visual";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Work" };

export default async function Work() {
  const projects = await getProjects();
  return (
    <div className="px-5 md:px-7">
      <PageHead title="Work" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug} data-inview style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <Link href={`/work/${p.slug}`} className="group relative block overflow-hidden rounded-xl bg-card">
              <Visual media={p.image} cover={p.cover} className="aspect-[4/3] transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.04]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-[16px]">{p.title}</p>
                <p className="text-[13px] text-white/60">{p.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
