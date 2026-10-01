"use client";

import { usePathname } from "next/navigation";
import { useRoute } from "./useRoute";

// Leaves out the site header or footer on full-screen pages such as Chat.
export default function HideOn({ prefix, children }: { prefix: string; children: React.ReactNode }) {
  const route = useRoute(usePathname());
  return route.startsWith(prefix) ? null : children;
}
