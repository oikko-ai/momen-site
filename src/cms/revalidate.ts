import { revalidatePath } from "next/cache";

// After any edit in the CMS, refresh every page so the change shows on the live site right away.
export const refreshSite = () => {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Outside a Next.js request (seeding, CLI scripts): nothing to refresh.
  }
};

export const refreshHooks = { afterChange: [refreshSite], afterDelete: [refreshSite] };
