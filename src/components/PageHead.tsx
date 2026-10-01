import Words from "./Words";

// Every page opens the same way: the title at the same height and size, then an optional intro.
export default function PageHead({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="pb-block pt-page">
      <Words text={title} className="text-h1 font-light" />
      {intro && (
        <p className="rise mt-6 max-w-[48ch] text-lead text-soft" style={{ ["--i" as string]: 2 }}>
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
