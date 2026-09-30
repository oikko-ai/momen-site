import type { Metadata } from "next";
import { getPages } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).colophon.title };
}

export default async function Colophon() {
  const { colophon } = await getPages();
  return (
    <div className="mx-auto max-w-[600px] px-5 pt-20 text-center">
      <p className="rise text-[18px]">{colophon.intro}</p>
      <p className="rise mt-16 text-[12px] uppercase tracking-[0.1em] text-faint" style={{ ["--i" as string]: 1 }}>
        Credits
      </p>
      <dl className="mt-6 space-y-3 text-[16px]">
        {colophon.rows.map(({ label, value }, i) => (
          <div key={label} className="rise grid grid-cols-2 gap-4" style={{ ["--i" as string]: i + 2 }}>
            <dt className="text-right text-soft">{label}</dt>
            <dd className="text-left">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
