"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store";
import { addLine } from "@/features/cart/cartSlice";
import { setChatOpen } from "@/features/ui/uiSlice";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
  });
  const [colorHex, setColorHex] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const variant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.find((v) => v.colorHex === colorHex) ?? product.variants[0]
    );
  }, [product, colorHex]);

  const price = product && variant ? product.basePrice + variant.priceDelta : 0;

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-5 py-20 text-muted">Loading…</div>;
  }
  if (!product || !variant) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20">
        <p>Product not found.</p>
        <Button href="/products" className="mt-4">
          Back to catalog
        </Button>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: variant.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="h-[50vh] min-h-[360px] border border-line bg-panel md:h-[70vh]">
          <ProductCanvas
            colorHex={variant.colorHex}
            productType={product.category}
            className="h-full w-full"
            fallbackLabel={product.name}
          />
        </div>

        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-accent">
            {product.category}
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.5rem,5vw,4rem)] font-semibold">
            {product.name}
          </h1>
          <p className="mt-3 text-[18px] text-muted">{product.tagline}</p>
          <p className="mt-6 text-[15px] leading-relaxed text-text/85">{product.description}</p>

          <div className="mt-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
              Color · {variant.colorName}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-label={v.colorName}
                  onClick={() => setColorHex(v.colorHex)}
                  className={cn(
                    "h-11 w-11 rounded-full border border-line",
                    v.colorHex === variant.colorHex && "swatch-ring",
                  )}
                  style={{ background: v.colorHex }}
                />
              ))}
            </div>
          </div>

          <p className="mt-8 font-display text-[36px]">{formatPrice(price)}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() =>
                dispatch(
                  addLine({
                    key: `${product.id}-${variant.sku}`,
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    colorName: variant.colorName,
                    colorHex: variant.colorHex,
                    cushion: "cloud",
                    engraving: "",
                    caseFinish: "soft",
                    unitPrice: price,
                    image: product.media[0]?.url,
                  }),
                )
              }
            >
              Add to cart
            </Button>
            <Button href={`/configure/${product.slug}`} variant="secondary">
              Full configure
            </Button>
            <Button type="button" variant="ghost" onClick={() => dispatch(setChatOpen(true))}>
              Ask about this product
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-8 text-[14px]">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {k}
                </dt>
                <dd className="mt-1 text-text">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[14px]">
            <Link href="/compare" className="text-accent underline-offset-4 hover:underline">
              Compare models →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
