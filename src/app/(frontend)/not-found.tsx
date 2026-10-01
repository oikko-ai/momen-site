import Link from "next/link";
import PageHead from "@/components/PageHead";

export default function NotFound() {
  return (
    <div className="wrap">
      <PageHead title="Not here." />
      <Link href="/" className="u text-lead">
        Back home
      </Link>
    </div>
  );
}
