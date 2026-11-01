"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";

export default function ComparePage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const [selected, setSelected] = useState<string[]>(["nova-h1", "nova-s1"]);

  const picks = useMemo(
    () => products.filter((p) => selected.includes(p.slug)).slice(0, 3),
    [products, selected],
  );

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  };

  const keys = ["drivers", "battery", "weight", "connectivity", "anc", "ipRating"] as const;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <h1 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-semibold">
        Compare
      </h1>
      <p className="mt-3 text-[16px] text-muted">Pick up to three SKUs side by side.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {products.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => toggle(p.slug)}
            className={cn(
              "border border-line px-4 py-2 text-[14px]",
              selected.includes(p.slug) && "border-accent bg-accent/10",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div
        className="mt-10 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${Math.max(picks.length, 1)}, minmax(0, 1fr))` }}
      >
        {picks.map((p) => (
          <div key={p.id} className="border border-line bg-panel">
            <div className="h-56 border-b border-line">
              <ProductCanvas
                colorHex={p.variants[0]?.colorHex}
                productType={p.category}
                className="h-full w-full"
                interactive={false}
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-[24px]">{p.name}</h2>
              <p className="mt-1 text-[14px] text-muted">{p.tagline}</p>
              <p className="mt-3 font-mono text-accent">{formatPrice(p.basePrice)}</p>
              <dl className="mt-6 space-y-3 text-[14px]">
                {keys.map((k) => (
                  <div key={k} className="border-t border-line pt-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {k}
                    </dt>
                    <dd className="mt-1">{p.specs[k]}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/configure/${p.slug}`}
                className="mt-6 inline-block text-[14px] text-accent underline-offset-4 hover:underline"
              >
                Configure →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
