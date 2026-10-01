"use client";

import { useEffect, useRef } from "react";

// A thin line along the top of the window that fills as the reader moves through the note.
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = bar.current!.closest("article")!;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = article.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        bar.current?.style.setProperty("transform", `scaleX(${k})`);
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);
  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left scale-x-0 bg-ink/80" />;
}
