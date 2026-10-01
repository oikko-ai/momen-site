"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRoute } from "./useRoute";

// Fades in anything marked data-inview as it scrolls into view. Re-scans on every navigation.
// Also moves the soft spotlight on cards marked data-spot to follow the pointer.
export default function Reveal() {
  const pathname = useRoute(usePathname());
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spot]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);
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
