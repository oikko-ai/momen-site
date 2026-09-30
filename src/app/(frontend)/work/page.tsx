import type { Metadata } from "next";
import Link from "next/link";
import { getPages, getProjects, type Device } from "@/lib/cms";
import DeviceFrame from "@/components/DeviceFrame";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).work.title };
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
    <div className="px-5 md:px-7">
      <PageHead title={pages.work.title} intro={pages.work.intro} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug} data-inview style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
            <Link
              href={`/work/${p.slug}`}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] bg-[#131313] transition-colors duration-500 hover:bg-[#1c1c1c]"
            >
              <div className="relative grid flex-1 place-items-center pt-[8%]">
                <div className={`${size[p.device]} ${i % 2 ? "tilt-alt" : "tilt"}`}>
                  <DeviceFrame device={p.device} media={p.image} cover={p.cover} className="w-full" />
                </div>
              </div>
              <div className="p-6 md:p-7">
                <p className="text-[20px] leading-tight md:text-[22px]">{p.title}</p>
                <p className="mt-1.5 text-[15px] text-soft">{p.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
