import type { Person } from "@/lib/cms";

const hue = (name: string) => [...name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);

// A person's photo, or a coloured monogram until one is uploaded.
export function Avatar({ person, className = "" }: { person: Person; className?: string }) {
  const h = hue(person.name);
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full text-[12px] font-medium text-white/90 ${className}`}
      style={{ background: `radial-gradient(120% 120% at 30% 20%, hsl(${h} 45% 52%), hsl(${(h + 40) % 360} 40% 22%))` }}
    >
      {person.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.avatar.url} alt={person.name} className="h-full w-full object-cover" />
      ) : (
        person.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
      )}
    </span>
  );
}

// Team avatars; hovering or focusing one lifts it and opens that person's card.
export default function Team({ people }: { people: Person[] }) {
  return (
    <ul className="relative flex flex-wrap gap-1.5">
      {people.map((p) => {
        const Tag = p.href ? "a" : "span";
        return (
          <li key={p.name} className="group/p md:relative">
            <Tag
              {...(p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : { tabIndex: 0 })}
              aria-label={`${p.name}, ${p.role}`}
              className="block rounded-full ring-2 ring-paper transition-transform duration-300 ease-[var(--ease)] group-hover/p:-translate-y-1 group-focus-within/p:-translate-y-1"
            >
              <Avatar person={p} className="h-9 w-9" />
            </Tag>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-0 z-30 mb-3 w-60 translate-y-1 md:left-1/2 md:-translate-x-1/2 rounded-xl border border-white/10 bg-[#141414]/95 p-3.5 text-left opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover/p:translate-y-0 group-hover/p:opacity-100 group-focus-within/p:translate-y-0 group-focus-within/p:opacity-100"
            >
              <span className="flex items-center gap-2.5">
                <Avatar person={p} className="h-10 w-10" />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] text-ink">{p.name}</span>
                  <span className="block truncate text-[12px] text-soft">{p.role}</span>
                </span>
              </span>
              {p.bio && <span className="mt-2.5 block text-[12.5px] leading-relaxed text-soft">{p.bio}</span>}
              {p.href && <span className="mt-2 block text-[11px] uppercase tracking-[0.1em] text-faint">View profile ↗</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
