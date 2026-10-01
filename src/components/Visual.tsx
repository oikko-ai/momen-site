import type { Cover as CoverKind } from "@/content";
import type { Media } from "@/lib/cms";
import Cover from "./Cover";
import Img from "./Img";

// Shows an uploaded image or video from the CMS, or the animated cover when there is none.
export default function Visual({
  media,
  cover,
  fit = "cover",
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  media: Media;
  cover: CoverKind;
  fit?: "cover" | "contain";
  className?: string;
  // How wide the image shows at each screen size, so the browser downloads the right size.
  sizes?: string;
  priority?: boolean;
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
            preload="metadata"
          />
        </>
      ) : (
        <Img src={media.url} alt={media.alt} sizes={sizes} priority={priority} className={fit === "cover" ? "object-cover" : "object-contain"} />
      )}
    </div>
  );
}
