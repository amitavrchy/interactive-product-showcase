import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  snippet: string;
};

export function CitationCard({ slug, title, snippet }: Props) {
  return (
    <Link
      href={`/products/${slug}`}
      className="block border border-line bg-void/80 p-3 transition hover:border-accent-2/50"
    >
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent-2">
        {title}
      </p>
      <p className="mt-1 line-clamp-2 text-[14px] text-muted">{snippet}</p>
    </Link>
  );
}
