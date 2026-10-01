import type { Metadata } from "next";
import { getPages } from "@/lib/cms";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).colophon.title };
}

export default async function Colophon() {
  const { colophon } = await getPages();
  return (
    <div className="wrap">
      <PageHead title={colophon.title} intro={colophon.intro} />
      <dl className="max-w-[880px] border-b border-rule">
        {colophon.rows.map(({ label, value }, i) => (
          <div key={label} className="rise grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 border-t border-rule py-5 text-lead" style={{ ["--i" as string]: i + 3 }}>
            <dt className="text-soft">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
