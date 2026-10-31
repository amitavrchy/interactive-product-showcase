"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/data/catalog";

type Props = {
  variants: ProductVariant[];
  value: string;
  onChange: (v: ProductVariant) => void;
};

export function Swatches({ variants, value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-3">
      {variants.map((v) => {
        const active = v.colorHex === value;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={v.colorName}
            onClick={() => onChange(v)}
            className={cn(
              "h-11 w-11 rounded-full border border-line transition",
              active && "swatch-ring",
            )}
            style={{ background: v.colorHex }}
          >
            <span className="sr-only">{v.colorName}</span>
          </button>
        );
      })}
    </div>
  );
}
