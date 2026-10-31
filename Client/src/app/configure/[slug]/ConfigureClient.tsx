"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchProduct } from "@/lib/api";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { Swatches } from "@/components/configurator/Swatches";
import { EngravingInput } from "@/components/configurator/EngravingInput";
import { PriceBar } from "@/components/configurator/PriceBar";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  hydrateConfig,
  setCaseFinish,
  setColor,
  setCushion,
  setEngraving,
  setProduct,
  toggleExploded,
  configToQuery,
  queryToConfig,
} from "@/features/configurator/configuratorSlice";
import { addLine } from "@/features/cart/cartSlice";
import { cn } from "@/lib/utils";

const CUSHIONS = [
  { id: "cloud" as const, label: "Cloud", delta: 0 },
  { id: "studio" as const, label: "Studio", delta: 25 },
  { id: "sport" as const, label: "Sport", delta: 15 },
];

const CASES = [
  { id: "soft" as const, label: "Soft sleeve", delta: 0 },
  { id: "hard" as const, label: "Hard case", delta: 40 },
  { id: "none" as const, label: "No case", delta: -20 },
];

export function ConfigureClient({ slug }: { slug: string }) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const config = useAppSelector((s) => s.configurator);

  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
  });

  useEffect(() => {
    if (!product) return;
    const fromUrl = queryToConfig(search.toString());
    const colorFromUrl = fromUrl.colorHex
      ? product.variants.find(
          (v) => v.colorHex.toLowerCase() === fromUrl.colorHex?.toLowerCase(),
        )
      : null;
    dispatch(
      hydrateConfig({
        productId: product.id,
        slug: product.slug,
        colorHex: colorFromUrl?.colorHex ?? product.variants[0].colorHex,
        colorName: colorFromUrl?.colorName ?? product.variants[0].colorName,
        cushion: fromUrl.cushion ?? "cloud",
        caseFinish: fromUrl.caseFinish ?? "soft",
        engraving: fromUrl.engraving ?? "",
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const q = configToQuery(config);
    router.replace(`${pathname}?${q}`, { scroll: false });
  }, [
    config.colorHex,
    config.cushion,
    config.caseFinish,
    config.engraving,
    product,
    pathname,
    router,
    config,
  ]);

  const price = useMemo(() => {
    if (!product) return 0;
    const variant =
      product.variants.find((v) => v.colorHex === config.colorHex) ?? product.variants[0];
    const cushionDelta = CUSHIONS.find((c) => c.id === config.cushion)?.delta ?? 0;
    const caseDelta = CASES.find((c) => c.id === config.caseFinish)?.delta ?? 0;
    return product.basePrice + variant.priceDelta + cushionDelta + caseDelta;
  }, [product, config]);

  if (!product) {
    return <div className="px-5 py-20 text-muted">Loading configurator…</div>;
  }

  return (
    <div className="pb-28">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] md:px-8">
        <div className="relative h-[55vh] min-h-[380px] border border-line bg-panel lg:sticky lg:top-24 lg:h-[calc(100svh-9rem)]">
          <ProductCanvas
            colorHex={config.colorHex}
            exploded={config.exploded}
            productType={product.category}
            className="h-full w-full"
            fallbackLabel={product.name}
          />
          <button
            type="button"
            onClick={() => dispatch(toggleExploded())}
            className="absolute bottom-4 left-4 border border-line bg-void/80 px-4 py-2 text-[14px] backdrop-blur hover:border-accent"
          >
            {config.exploded ? "Assemble" : "Exploded view"}
          </button>
          <button
            type="button"
            className="absolute bottom-4 right-4 border border-line bg-void/80 px-4 py-2 text-[14px] text-muted"
            title="AR try-on coming soon"
          >
            AR placeholder
          </button>
        </div>

        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
            Configurator
          </p>
          <h1 className="font-display mt-2 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold">
            {product.name}
          </h1>
          <p className="mt-3 text-[15px] text-muted">{product.tagline}</p>

          <div className="mt-10 space-y-8">
            <div>
              <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
                Color · {config.colorName}
              </p>
              <Swatches
                variants={product.variants}
                value={config.colorHex}
                onChange={(v) => {
                  dispatch(setProduct({ productId: product.id, slug: product.slug }));
                  dispatch(setColor({ hex: v.colorHex, name: v.colorName }));
                }}
              />
            </div>

            {product.category === "headphones" && (
              <div>
                <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
                  Ear cushion
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CUSHIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => dispatch(setCushion(c.id))}
                      className={cn(
                        "border border-line px-3 py-3 text-[14px] transition",
                        config.cushion === c.id && "border-accent bg-accent/10",
                      )}
                    >
                      {c.label}
                      {c.delta > 0 ? ` +$${c.delta}` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <EngravingInput
              value={config.engraving}
              onChange={(v) => dispatch(setEngraving(v))}
            />

            <div>
              <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
                Case
              </p>
              <div className="space-y-2">
                {CASES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => dispatch(setCaseFinish(c.id))}
                    className={cn(
                      "flex w-full items-center justify-between border border-line px-4 py-3 text-[14px]",
                      config.caseFinish === c.id && "border-accent bg-accent/10",
                    )}
                  >
                    <span>{c.label}</span>
                    <span className="text-muted">
                      {c.delta === 0
                        ? "Included"
                        : c.delta > 0
                          ? `+$${c.delta}`
                          : `−$${Math.abs(c.delta)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceBar
        price={price}
        onShare={async () => {
          const url = window.location.href;
          try {
            await navigator.clipboard.writeText(url);
            alert("Config link copied");
          } catch {
            prompt("Copy share link", url);
          }
        }}
        onAdd={() => {
          const variant =
            product.variants.find((v) => v.colorHex === config.colorHex) ??
            product.variants[0];
          dispatch(
            addLine({
              key: `${product.id}-${variant.sku}-${config.cushion}-${config.caseFinish}-${config.engraving}`,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              colorName: config.colorName,
              colorHex: config.colorHex,
              cushion: config.cushion,
              engraving: config.engraving,
              caseFinish: config.caseFinish,
              unitPrice: price,
            }),
          );
        }}
      />
    </div>
  );
}
