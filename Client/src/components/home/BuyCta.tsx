"use client";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function BuyCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,77,46,0.18),transparent_45%,rgba(124,255,178,0.08))]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end md:px-8">
        <div>
          <p className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none">
            Make it yours.
          </p>
          <p className="mt-4 text-[16px] text-muted">
            NOVA H1 from {formatPrice(349)} · free returns · 2-year warranty
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/configure/nova-h1">Configure H1</Button>
          <Button href="/products" variant="secondary">
            Browse catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
