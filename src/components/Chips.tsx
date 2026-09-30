"use client";

export default function Chips({ tags, value, onChange }: { tags: readonly string[]; value: string; onChange: (t: string) => void }) {
  return (
    <div role="tablist" className="rise flex flex-wrap gap-1.5" style={{ ["--i" as string]: 2 }}>
      {tags.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={value === t}
          onClick={() => onChange(t)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${value === t ? "bg-ink text-paper" : "bg-card text-soft hover:text-ink"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
