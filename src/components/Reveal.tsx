"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRoute } from "./useRoute";

// Fades in anything marked data-inview as it scrolls into view. Re-scans on every navigation.
export default function Reveal() {
  const pathname = useRoute(usePathname());
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-inview]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.inview = "true";
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => (el.dataset.inview === "true" ? null : io.observe(el)));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
