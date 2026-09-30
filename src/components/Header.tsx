"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moreNav, nav } from "@/content";
import { useRoute } from "./useRoute";

export default function Header({ name }: { name: string }) {
  const pathname = useRoute(usePathname());
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("mousedown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("mousedown", close);
      removeEventListener("keydown", close);
    };
  }, [open]);

  const link = (href: string) =>
    `transition-colors duration-200 ${(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "text-ink" : "text-soft hover:text-ink"}`;

  return (
    <header className="relative z-40">
      <div className="flex h-24 items-center justify-between px-5 md:px-7">
        <Link href="/" className="text-[20px] tracking-tight text-soft md:text-[22px] transition-colors hover:text-ink">
          {name}
        </Link>
        <div ref={box} className="relative flex items-center gap-5 text-[16px] md:gap-7 md:text-[18px]">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`${link(n.href)} ${n.href === "/" || n.href === "/notes" ? "hidden sm:inline" : ""}`}>
              {n.label}
            </Link>
          ))}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className={open ? "text-ink" : "text-soft hover:text-ink"}>
            More
          </button>
          {open && (
            <div role="menu" className="pop absolute right-0 top-10 w-52 rounded-xl border border-rule bg-[#101010]/95 p-1.5 shadow-2xl backdrop-blur-xl">
              {[...nav.filter((n) => n.href === "/" || n.href === "/notes"), ...moreNav].map((n) => (
                <Link
                  key={n.href}
                  role="menuitem"
                  href={n.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[16px] hover:bg-white/5 ${
                    n.href === "/" || n.href === "/notes" ? "sm:hidden" : ""
                  } ${pathname.startsWith(n.href) && n.href !== "/" ? "text-ink" : "text-soft hover:text-ink"}`}
                >
                  <span className={`h-1 w-1 rounded-full ${pathname.startsWith(n.href) && n.href !== "/" ? "bg-ink" : "bg-transparent"}`} />
                  {n.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
