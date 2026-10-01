// "Open to new projects", with a softly pulsing green dot. Switched on and worded in Site & Home.
export default function Available({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-small text-ink/90 ${className}`}>
      <span className="ping relative h-2 w-2 rounded-full bg-[#4ade80]" />
      {text}
    </span>
  );
}
