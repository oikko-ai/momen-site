import Avatar from "./Avatar";
import Img from "./Img";

// The portrait on Home and About. Until a photo is uploaded in Site & Home, a placeholder with initials shows.
export default function Portrait({ src, name, label, className = "" }: { src?: string; name: string; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-card ${className}`}>
      {src ? (
        <Img src={src} alt={name} sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_30%_10%,#232323,#0d0d0d)]">
          <Avatar name={name} image={null} className="h-[34%] w-auto aspect-square" />
          {label && <span className="eyebrow absolute bottom-6 left-6">{label}</span>}
        </div>
      )}
    </div>
  );
}
