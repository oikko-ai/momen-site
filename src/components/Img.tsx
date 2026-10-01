import Image from "next/image";

// Uploaded images go through Next's image optimiser: resized to the screen and served as AVIF or WebP.
// Images linked from other sites are shown as they are.
const local = (src: string) => src.startsWith("/") || /\.public\.blob\.vercel-storage\.com\//.test(src);

export default function Img({ src, alt, sizes, className = "", priority = false }: { src: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} unoptimized={!local(src)} />;
}
