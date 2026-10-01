import Link from "next/link";
import type { Site } from "@/lib/cms";
import { SocialIcon } from "./SocialIcon";

export default function Footer({ site }: { site: Site }) {
  const links = [{ label: "Email", href: `mailto:${site.email}` }, ...site.socials];
  return (
    <footer className="wrap mt-section">
      <div className="grid grid-cols-1 items-center gap-6 border-t border-rule pb-10 pt-8 text-small text-soft md:grid-cols-3">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="-ml-2.5 flex gap-1 md:ml-0 md:justify-center">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                aria-label={l.label}
                title={l.label}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                <SocialIcon href={l.href} className="h-[18px] w-[18px]" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-label uppercase md:justify-end">
          {site.footerLinks.map((l) => (
            <li key={l.href}>
              <Link className="transition-colors hover:text-ink" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
