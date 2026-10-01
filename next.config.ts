import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 builds a plain static site in out/ with relative asset paths (see scripts/build-preview.sh).
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? { output: "export", assetPrefix: ".", images: { unoptimized: true } }
  : { experimental: { globalNotFound: true } };

export default withPayload(nextConfig);
