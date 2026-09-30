import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell pb-20 pt-28">
      <h1 className="text-[40px] font-semibold tracking-[-0.035em]">Not here.</h1>
      <Link href="/" className="u mt-4 inline-block text-[16px]">
        Back home
      </Link>
    </div>
  );
}
