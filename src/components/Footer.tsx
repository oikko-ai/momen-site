import Link from "next/link";
import type { Site } from "@/lib/cms";

const icons: Record<string, React.ReactNode> = {
  Email: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  LinkedIn: <path d="M4 9h3v11H4zM5.5 4a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3 0 3.6 2 3.6 4.6V20h-3v-5.8c0-1.3-.1-2.8-1.8-2.8-1.8 0-2.2 1.3-2.2 2.7V20h-3z" />,
  GitHub: <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  "Oikko AI": <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />,
};

export default function Footer({ site }: { site: Site }) {
  const links = [{ label: "Email", href: `mailto:${site.email}` }, ...site.socials];
  return (
    <footer className="wrap mt-section">
      <div className="grid grid-cols-1 items-center gap-5 border-t border-rule pb-10 pt-8 text-small text-soft md:grid-cols-3">
      <p>© {new Date().getFullYear()} {site.name}</p>
      <ul className="flex gap-6 md:justify-center">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} aria-label={l.label} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {icons[l.label] ?? icons["Oikko AI"]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex gap-6 font-mono text-label uppercase md:justify-end">
        <li><Link className="hover:text-ink" href="/activity">Activity</Link></li>
        <li><Link className="hover:text-ink" href="/chat">Chat</Link></li>
        <li><Link className="hover:text-ink" href="/colophon">Colophon</Link></li>
      </ul>
      </div>
    </footer>
  );
}
