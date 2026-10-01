import type { MetadataRoute } from "next";
import { siteUrl as site } from "@/lib/url";

export const dynamic = "force-static";

// Search engines and AI assistants are welcome everywhere except the CMS and its API.
const ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  const rule = { allow: ["/", "/api/media/"], disallow: ["/admin", "/api/"] };
  return { rules: [{ userAgent: "*", ...rule }, { userAgent: ai, ...rule }], sitemap: `${site}/sitemap.xml`, host: site };
}
