import { revalidatePath } from "next/cache";

// After any edit in the CMS, refresh every page so the change shows on the live site right away.
export const refreshSite = () => {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/notes/rss.xml");
    revalidatePath("/sitemap.xml");
  } catch {
    // Outside a Next.js request (seeding, CLI scripts): nothing to refresh.
  }
};

// Reader reactions (likes, views, highlights) pass context.skipRefresh so they don't rebuild the site.
const refreshUnlessSkipped = ({ context }: { context?: Record<string, unknown> }) => {
  if (!context?.skipRefresh) refreshSite();
};
export const refreshHooks = { afterChange: [refreshUnlessSkipped], afterDelete: [refreshSite] };
