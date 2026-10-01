import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 builds a plain static site in out/ with relative asset paths (see scripts/build-preview.sh).
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? { output: "export", assetPrefix: ".", images: { unoptimized: true } }
  : {
      experimental: { globalNotFound: true },
      images: {
        formats: ["image/avif", "image/webp"],
        // Uploads stored in Vercel Blob.
        remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
      },
      // The Colophon page became Credits.
      redirects: async () => [{ source: "/colophon", destination: "/credits", permanent: true }],
    };

export default withPayload(nextConfig);
