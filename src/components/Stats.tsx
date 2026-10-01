"use client";

import { useEffect, useRef } from "react";

// Numbers counted from the CMS. Each one counts up from zero the first time it scrolls into view.
export default function Stats({ items }: { items: { value: number; label: string }[] }) {
  const ref = useRef<HTMLDListElement>(null);
  useEffect(() => {
    const root = ref.current!;
    const nums = [...root.querySelectorAll<HTMLElement>("[data-to]")];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    nums.forEach((n) => (n.textContent = "0"));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        const eased = 1 - Math.pow(1 - k, 4);
        nums.forEach((n) => (n.textContent = String(Math.round(Number(n.dataset.to) * eased))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return (
    <dl ref={ref} className="grid grid-cols-2 border-t border-rule md:grid-cols-4">
      {items.map((s, i) => (
        <div key={s.label} className={`border-b border-rule py-8 md:border-b-0 md:py-10 ${i % 2 ? "pl-6" : ""} md:pl-0 ${i ? "md:border-l md:pl-8" : ""}`} data-inview style={{ transitionDelay: `${i * 80}ms` }}>
          <dd className="text-h1 font-light tabular-nums" data-to={s.value}>
            {s.value}
          </dd>
          <dt className="mt-3 text-small text-soft">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
