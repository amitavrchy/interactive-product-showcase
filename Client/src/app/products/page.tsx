"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
        Catalog
      </p>
      <h1 className="font-display mt-3 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold">
        NOVA line
      </h1>
      <p className="mt-4 max-w-xl text-[16px] text-muted">
        Three instruments. One design language. Pick a silhouette, then configure finish.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse border border-line bg-panel" />
            ))
          : products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="group block border border-line bg-panel transition hover:border-accent/60"
                >
                  <div className="h-64 border-b border-line bg-void">
                    <ProductCanvas
                      colorHex={p.variants[0]?.colorHex}
                      productType={p.category}
                      className="h-full w-full"
                      interactive={false}
                      fallbackLabel={p.name}
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-[24px]">{p.name}</p>
                    <p className="mt-2 text-[14px] text-muted">{p.tagline}</p>
                    <p className="mt-4 font-mono text-[14px] text-accent">
                      From {formatPrice(p.basePrice)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
