"use client";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Props = {
  price: number;
  onAdd: () => void;
  onShare: () => void;
};

export function PriceBar({ price, onAdd, onShare }: Props) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-panel/95 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
            Live total
          </p>
          <p className="font-display text-[32px] font-semibold">{formatPrice(price)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onShare}>
            Share config
          </Button>
          <Button type="button" onClick={onAdd}>
            Add to bag
          </Button>
        </div>
      </div>
    </div>
  );
}
