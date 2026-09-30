import type { Cover as CoverKind } from "@/content";
import type { Device, Media } from "@/lib/cms";
import Visual from "./Visual";

// A cover image shown inside a phone, tablet or laptop, or on its own when the device is "none".
export default function DeviceFrame({ device, media, cover, className = "" }: { device: Device; media: Media; cover: CoverKind; className?: string }) {
  const screen = (
    <div className="absolute inset-0">
      <Visual media={media} cover={cover} className="h-full w-full" />
    </div>
  );
  if (device === "none") return <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${className}`}>{screen}</div>;
  if (device === "laptop")
    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[14px] border-[7px] border-b-[10px] border-[#262626] bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]">
          {screen}
          <span className="absolute left-1/2 top-0 h-2 w-14 -translate-x-1/2 rounded-b-md bg-[#262626]" />
        </div>
        <div className="relative -mx-[7%] h-3 rounded-b-[10px] bg-gradient-to-b from-[#3a3a3a] to-[#1e1e1e]">
          <span className="absolute left-1/2 top-0 h-1 w-[16%] -translate-x-1/2 rounded-b bg-[#141414]" />
        </div>
      </div>
    );
  const phone = device === "phone";
  return (
    <div
      className={`relative overflow-hidden border-[#2a2a2a] bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] ${
        phone ? "aspect-[9/19] rounded-[28px] border-[4px]" : "aspect-[4/3] rounded-[20px] border-[8px]"
      } ${className}`}
    >
      {screen}
      {phone && <span className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-black" />}
    </div>
  );
}
