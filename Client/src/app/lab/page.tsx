"use client";

import { useState } from "react";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { Button } from "@/components/ui/Button";

export default function LabPage() {
  const [exploded, setExploded] = useState(true);
  const [color, setColor] = useState("#F5F0E8");

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
        Lab
      </p>
      <h1 className="font-display mt-3 text-[clamp(2.4rem,5vw,3.8rem)] font-semibold">
        WebGL experiments
      </h1>
      <p className="mt-4 max-w-xl text-[16px] text-muted">
        Procedural headphone mesh with explode toggle — drop real GLBs in{" "}
        <code className="text-accent">/public/models</code> when ready.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={() => setExploded((v) => !v)}>
          {exploded ? "Assemble" : "Explode"}
        </Button>
        {["#111111", "#F5F0E8", "#1E3A5F", "#E8E8EA"].map((hex) => (
          <button
            key={hex}
            type="button"
            aria-label={hex}
            className="h-11 w-11 rounded-full border border-line"
            style={{ background: hex }}
            onClick={() => setColor(hex)}
          />
        ))}
      </div>
      <div className="mt-8 h-[70vh] min-h-[420px] border border-line bg-panel">
        <ProductCanvas colorHex={color} exploded={exploded} className="h-full w-full" />
      </div>
    </div>
  );
}
