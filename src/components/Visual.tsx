import type { Cover as CoverKind } from "@/content";
import type { Media } from "@/lib/cms";
import Cover from "./Cover";

// Shows an uploaded image or video from the CMS, or the animated cover when there is none.
export default function Visual({ media, cover, className = "" }: { media: Media; cover: CoverKind; className?: string }) {
  if (!media) return <Cover kind={cover} className={className} />;
  return (
    <div className={`relative overflow-hidden bg-card ${className}`}>
      {media.video ? (
        <video src={media.url} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.url} alt={media.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
    </div>
  );
}
