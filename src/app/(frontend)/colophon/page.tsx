import type { Metadata } from "next";

export const metadata: Metadata = { title: "Colophon" };

const rows = [
  ["Design and words", "Abdul Momen"],
  ["Framework", "Next.js"],
  ["Interface", "React"],
  ["Styling", "Tailwind CSS"],
  ["Type", "Inter"],
  ["Covers", "Drawn in code"],
  ["Language", "TypeScript"],
  ["Made in", "Dhaka"],
];

export default function Colophon() {
  return (
    <div className="mx-auto max-w-[560px] px-5 pt-20 text-center">
      <p className="rise text-[16px]">Built by hand, with thanks to the open-source community.</p>
      <p className="rise mt-16 text-[11px] uppercase tracking-[0.1em] text-faint" style={{ ["--i" as string]: 1 }}>
        Credits
      </p>
      <dl className="mt-6 space-y-2.5 text-[15px]">
        {rows.map(([k, v], i) => (
          <div key={k} className="rise grid grid-cols-2 gap-4" style={{ ["--i" as string]: i + 2 }}>
            <dt className="text-right text-soft">{k}</dt>
            <dd className="text-left">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
