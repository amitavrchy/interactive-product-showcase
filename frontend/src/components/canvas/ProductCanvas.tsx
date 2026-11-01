"use client";

import dynamic from "next/dynamic";
import { useAppSelector } from "@/store";
import type { SceneProduct } from "./Scene";

const ProductScene = dynamic(
  () => import("./Scene").then((m) => m.ProductScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-panel to-void">
        <div className="h-24 w-24 animate-pulse rounded-full bg-line/40" />
      </div>
    ),
  },
);

type Props = {
  colorHex?: string;
  exploded?: boolean;
  productType?: SceneProduct;
  className?: string;
  interactive?: boolean;
  framed?: boolean;
  fallbackLabel?: string;
};

export function ProductCanvas({
  colorHex,
  exploded,
  productType = "headphones",
  className = "h-full w-full",
  interactive = true,
  framed = false,
  fallbackLabel = "NOVA",
}: Props) {
  const reduced = useAppSelector((s) => s.ui.reducedMotion);
  const hex = colorHex ?? "#F5F0E8";

  if (reduced) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: `radial-gradient(circle at 50% 40%, ${hex}55, transparent 55%), linear-gradient(180deg,#141416,#0b0b0c)`,
        }}
      >
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full border border-line text-lg font-display tracking-widest text-muted"
          style={{ boxShadow: `0 0 60px ${hex}66` }}
        >
          {fallbackLabel}
        </div>
      </div>
    );
  }

  return (
    <ProductScene
      colorHex={hex}
      exploded={exploded}
      productType={productType}
      className={className}
      interactive={interactive}
      framed={framed}
    />
  );
}
