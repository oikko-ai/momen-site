import { LEFT, STEP, TOP, rows } from "@/lib/world-dots";

export type Pin = { id: string; lat: number; lon: number; label: string; sub: string };

const at = (lat: number, lon: number) => ({ x: ((lon - LEFT) / STEP) * 10 + 5, y: ((TOP - lat) / STEP) * 10 + 5 });
const dots = rows.flatMap((r, y) => [...r].map((c, x) => (c === "1" ? `M${x * 10 + 5} ${y * 10 + 5}h0` : "")).filter(Boolean)).join("");

// A dotted world with a glowing pin for each chat. Hover a pin for the question; click to open it.
export default function WorldMap({ pins, onPick }: { pins: Pin[]; onPick: (id: string) => void }) {
  return (
    <svg viewBox={`0 0 ${rows[0].length * 10} ${rows.length * 10}`} className="h-auto w-full" role="img" aria-label="Map of where chats came from">
      <path d={dots} stroke="rgba(255,255,255,0.16)" strokeWidth="4.4" strokeLinecap="round" />
      {pins.map((p) => {
        const { x, y } = at(p.lat, p.lon);
        return (
          <g key={p.id} className="group cursor-pointer" onClick={() => onPick(p.id)} tabIndex={0} role="button" aria-label={`${p.sub}: ${p.label}`} onKeyDown={(e) => e.key === "Enter" && onPick(p.id)}>
            <circle cx={x} cy={y} r="14" fill="#4f8cff" opacity="0.18" className="origin-center animate-ping [transform-box:fill-box]" />
            <circle cx={x} cy={y} r="6.5" fill="#4f8cff" stroke="#050505" strokeWidth="2" />
            <g className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
              <rect x={x + 14} y={y - 34} width={Math.min(520, 22 + Math.max(p.label.length, p.sub.length) * 11)} height="56" rx="12" fill="#161616" stroke="rgba(255,255,255,0.1)" />
              <text x={x + 28} y={y - 12} fill="#8d8d89" fontSize="15">
                {p.sub}
              </text>
              <text x={x + 28} y={y + 10} fill="#f1f1ef" fontSize="17">
                {p.label.length > 44 ? `${p.label.slice(0, 43)}…` : p.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
