"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { COLORS } from "@/data/catalog";
import { useAppDispatch, useAppSelector } from "@/store";
import { setColor } from "@/features/configurator/configuratorSlice";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { cn } from "@/lib/utils";

const swatches = Object.values(COLORS);

export function ColorStory() {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true });
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.configurator.colorHex);

  const onSelect = useCallback(
    (hex: string, name: string) => {
      dispatch(setColor({ hex, name }));
    },
    [dispatch],
  );

  return (
    <section className="border-t border-line bg-panel py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
              Color story
            </p>
            <h2 className="font-display mt-3 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold">
              Four finishes. One silhouette.
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous color"
              onClick={() => embla?.scrollPrev()}
              className="h-11 w-11 border border-line text-[14px] text-muted hover:text-text"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next color"
              onClick={() => embla?.scrollNext()}
              className="h-11 w-11 border border-line text-[14px] text-muted hover:text-text"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="h-[360px] overflow-hidden rounded-sm border border-line bg-void md:h-[480px]">
            <ProductCanvas colorHex={selected} className="h-full w-full" />
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {swatches.map((s) => {
                const active = selected === s.hex;
                return (
                  <button
                    key={s.hex}
                    type="button"
                    onClick={() => onSelect(s.hex, s.name)}
                    className={cn(
                      "min-w-[78%] shrink-0 border border-line p-6 text-left transition md:min-w-[45%]",
                      active && "border-accent",
                    )}
                  >
                    <div
                      className={cn("h-28 w-full rounded-sm", active && "swatch-ring")}
                      style={{ background: s.hex }}
                    />
                    <p className="mt-5 font-display text-[22px]">{s.name}</p>
                    <p className="mt-2 font-mono text-[14px] text-muted">{s.hex}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
