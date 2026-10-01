import Link from "next/link";
import PageHead from "@/components/PageHead";
import { getPages } from "@/lib/cms";

export default async function NotFound() {
  const { labels } = await getPages();
  return (
    <div className="wrap">
      <PageHead title={labels.notFoundTitle} />
      <Link href="/" className="u text-lead">
        {labels.notFoundLink}
      </Link>
    </div>
  );
}
