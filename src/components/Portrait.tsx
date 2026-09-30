// PLACEHOLDER portrait until Momen sends a photo. Put it at /public/momen.jpg and pass src.
export default function Portrait({ src, className = "" }: { src?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[radial-gradient(120%_100%_at_30%_20%,#2a2a2a,#111)] ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Abdul Momen" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white/10 text-[28px] text-ink">AM</span>
            <p className="mt-4 text-[14px] text-soft">Portrait coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
