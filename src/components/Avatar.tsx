import type { Media } from "@/lib/cms";

export const hue = (name: string) => [...name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// A person's photo, or a placeholder until one is uploaded: their initials on a soft gradient
// picked from their name, so each person keeps the same colour everywhere on the site.
export default function Avatar({ name, image, className = "", square = false }: { name: string; image: Media; className?: string; square?: boolean }) {
  const h = hue(name);
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden font-medium text-white/90 ${square ? "rounded-[22%]" : "rounded-full"} ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 25% 15%, hsl(${h} 50% 58%), hsl(${(h + 40) % 360} 42% 24%) 70%)`,
        containerType: "size",
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-12px_24px_rgba(0,0,0,0.25)]" />
          <span className="relative tracking-[0.02em]" style={{ fontSize: "38cqh" }}>
            {initials(name)}
          </span>
        </>
      )}
    </span>
  );
}
