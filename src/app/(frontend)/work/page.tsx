import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { getPages, getProjects, getSite, type Device } from "@/lib/cms";
import DeviceFrame from "@/components/DeviceFrame";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  const [p, site, projects] = await Promise.all([getPages(), getSite(), getProjects()]);
  const fallback = `Case studies by ${site.name}: ${projects.slice(0, 4).map((x) => x.title).join(", ")} and more.`;
  return pageMeta({ title: p.work.title, description: p.work.intro || fallback, path: "/work", seo: p.seo("work") });
}

// How big each device sits inside its card.
const size: Record<Device, string> = {
  phone: "w-[38%]",
  tablet: "w-[70%]",
  laptop: "w-[74%]",
  none: "w-[82%]",
};

export default async function Work() {
  const [projects, pages] = await Promise.all([getProjects(), getPages()]);
  return (
    <div className="wrap">
      <PageHead title={pages.work.title} intro={pages.work.intro} />
      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug} data-inview style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
            <Link
              href={`/work/${p.slug}`}
              data-spot
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] bg-[#131313] transition-colors duration-500 hover:bg-[#191919]"
            >
              <div className="absolute inset-x-6 top-6 z-10 flex justify-between font-mono text-label uppercase text-faint md:inset-x-8 md:top-7">
                <span>{p.client?.name ?? p.team}</span>
                <span>{p.year}</span>
              </div>
              <div className="relative grid flex-1 place-items-center pt-[8%]">
                <div className={`${size[p.device]} ${i % 2 ? "tilt-alt" : "tilt"}`}>
                  <DeviceFrame device={p.device} media={p.image} cover={p.cover} className="w-full" />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-h3">{p.title}</p>
                <p className="mt-2 text-small text-soft">{p.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
