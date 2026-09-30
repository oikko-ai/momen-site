export default function PageHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="pb-10 pt-14 md:pb-14 md:pt-20">
      <h1 className="rise text-[44px] font-light leading-[1.05] tracking-[-0.03em] md:text-[72px]">{title}</h1>
      {intro && (
        <p className="rise mt-6 max-w-[42ch] text-[17px] leading-relaxed text-soft" style={{ ["--i" as string]: 1 }}>
          {intro}
        </p>
      )}
    </header>
  );
}
