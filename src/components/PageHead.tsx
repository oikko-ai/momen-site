import Words from "./Words";

// Every page opens the same way. The page name is the h1 for search engines and screen readers,
// but stays hidden on screen unless showTitle is set; an optional intro leads the page instead.
export default function PageHead({ title, intro, children, showTitle = false }: { title: string; intro?: string; children?: React.ReactNode; showTitle?: boolean }) {
  return (
    <header className={showTitle || intro || children ? "pb-block pt-page" : "pt-page"}>
      {showTitle ? <Words text={title} className="text-h1 font-light" /> : <h1 className="sr-only">{title}</h1>}
      {intro && (
        <p className={`rise max-w-[52ch] text-lead text-soft ${showTitle ? "mt-6" : ""}`} style={{ ["--i" as string]: 1 }}>
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
