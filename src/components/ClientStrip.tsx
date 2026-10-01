import type { Client } from "@/lib/cms";

// Client names (or logos, once uploaded) drifting slowly sideways. Pauses on hover.
export default function ClientStrip({ clients }: { clients: Client[] }) {
  const loop = [...clients, ...clients, ...clients, ...clients];
  return (
    <div className="fade-edges group/c overflow-hidden">
      <ul className="marquee-slow flex w-max items-center group-hover/c:[animation-play-state:paused]">
        {loop.map((c, i) => (
          <li key={i} aria-hidden={i >= clients.length} className="flex items-center">
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logo.url} alt={c.name} className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100 md:h-12" />
            ) : (
              <span className="text-h2 font-light whitespace-nowrap text-soft transition-colors duration-300 hover:text-ink">{c.name}</span>
            )}
            <span className="mx-8 h-1.5 w-1.5 rounded-full bg-faint md:mx-12" />
          </li>
        ))}
      </ul>
    </div>
  );
}
