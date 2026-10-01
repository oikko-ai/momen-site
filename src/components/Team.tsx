import type { Person } from "@/lib/cms";
import Face from "./Avatar";

// A person's photo, or their placeholder monogram.
function Avatar({ person, className = "" }: { person: Person; className?: string }) {
  return <Face name={person.name} image={person.avatar} className={className} />;
}

// Team avatars; hovering or focusing one lifts it and opens that person's card.
export default function Team({ people, viewProfile }: { people: Person[]; viewProfile: string }) {
  return (
    <ul className="relative flex flex-wrap gap-1.5">
      {people.map((p) => {
        const Tag = p.href ? "a" : "span";
        return (
          <li key={p.name} className="group/p md:relative">
            <Tag
              {...(p.href
                ? { href: p.href, target: "_blank", rel: "noreferrer" }
                : { tabIndex: 0, role: "img", "aria-label": `${p.name}, ${p.role}` })}
              className="block rounded-full ring-2 ring-paper transition-transform duration-300 ease-[var(--ease)] group-hover/p:-translate-y-1 group-focus-within/p:-translate-y-1"
            >
              <Avatar person={p} className="h-11 w-11" />
              {p.href && <span className="sr-only">{`${p.name}, ${p.role}`}</span>}
            </Tag>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-0 z-30 mb-3 w-56 translate-y-1 md:w-60 md:left-1/2 md:-translate-x-1/2 rounded-xl border border-white/10 bg-[#141414]/95 p-3.5 text-left opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover/p:translate-y-0 group-hover/p:opacity-100 group-focus-within/p:translate-y-0 group-focus-within/p:opacity-100"
            >
              <span className="flex items-center gap-2.5">
                <Avatar person={p} className="h-10 w-10" />
                <span className="min-w-0">
                  <span className="block truncate text-small text-ink">{p.name}</span>
                  <span className="block truncate text-micro text-soft">{p.role}</span>
                </span>
              </span>
              {p.bio && <span className="mt-2.5 block text-micro leading-relaxed text-soft">{p.bio}</span>}
              {p.href && <span className="eyebrow mt-2 block">{viewProfile} ↗</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
