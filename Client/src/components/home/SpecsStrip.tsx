"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATALOG } from "@/data/catalog";

const h1 = CATALOG[0];

const rows = [
  { label: "Drivers", value: h1.specs.drivers },
  { label: "Battery", value: h1.specs.battery },
  { label: "Weight", value: h1.specs.weight },
  { label: "ANC", value: h1.specs.anc },
  { label: "Connect", value: h1.specs.connectivity },
  { label: "Rating", value: h1.specs.ipRating },
];

export function SpecsStrip() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <section className="sticky top-16 z-20 border-y border-line bg-void/95 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-void to-transparent md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-void to-transparent md:w-16" />

        <button
          type="button"
          aria-label="Scroll specs left"
          onClick={() => scrollBy(-1)}
          className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line/80 bg-panel/90 text-muted backdrop-blur transition hover:border-muted hover:text-text md:inline-flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Scroll specs right"
          onClick={() => scrollBy(1)}
          className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line/80 bg-panel/90 text-muted backdrop-blur transition hover:border-muted hover:text-text md:inline-flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scroller}
          className="scrollbar-none flex items-stretch gap-0 overflow-x-auto scroll-smooth px-5 py-1 md:px-12"
        >
          {rows.map((r) => (
            <div
              key={r.label}
              className="min-w-[168px] shrink-0 border-r border-line px-4 py-5 last:border-r-0"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted">
                {r.label}
              </p>
              <p className="mt-2 text-[14px] leading-snug text-text">{r.value}</p>
            </div>
          ))}
          <div className="flex min-w-[140px] shrink-0 items-center justify-center px-4">
            <Link
              href="/compare"
              className="text-[14px] text-accent underline-offset-4 hover:underline"
            >
              Compare →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
