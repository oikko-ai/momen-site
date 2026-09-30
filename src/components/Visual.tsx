import type { Cover as CoverKind } from "@/content";
import type { Media } from "@/lib/cms";
import Cover from "./Cover";

// Shows an uploaded image or video from the CMS, or the animated cover when there is none.
export default function Visual({
  media,
  cover,
  fit = "cover",
  className = "",
}: {
  media: Media;
  cover: CoverKind;
  fit?: "cover" | "contain";
  className?: string;
}) {
  if (!media) return <Cover kind={cover} className={className} />;
  return (
    <div
      className={`relative overflow-hidden ${fit === "cover" ? "bg-card" : ""} ${className}`}
    >
      {media.video ? (
        <>
          {/* The animated cover shows until the video starts, and stays if the browser can't play it. */}
          <div className="absolute inset-0">
            <Cover kind={cover} className="h-full w-full" />
          </div>
          <video
            src={media.url}
            className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
            autoPlay
            muted
            loop
            playsInline
          />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.url}
          alt={media.alt}
          className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
