"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { useAppSelector } from "@/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = [
  {
    id: "form",
    title: "Form",
    lead: "Sculpted once. Felt for years.",
    body: "A continuous aluminum yoke arcs into dual cups — tensioned, balanced, almost weightless at 248g. The silhouette reads as a single gesture: no loose hinges shouting hardware, no plastic seams breaking the line.",
    points: [
      "Single-piece yoke geometry reduces flex fatigue over thousands of open/close cycles.",
      "Cup pivot bearings stay silent — tuned damping instead of clicky detents.",
      "Center of mass sits close to the ear so the H1 hangs still when you turn your head.",
      "Packs flat in the hard case without stressing the headband spring.",
    ],
    footnote: "Designed in-house. CNC prototypes before soft tooling.",
  },
  {
    id: "materials",
    title: "Materials",
    lead: "Touch first. Then listen.",
    body: "Micro-texture shell, protein-leather cushions, and titanium diaphragms that keep midrange honest. Every surface is chosen for how it ages — fingerprints fade, edges stay crisp, cushions keep their rebound.",
    points: [
      "Aerospace-grade aluminum yoke with micro-bead finish that hides daily wear.",
      "Protein-leather ear pads over multi-density foam — soft seal without sticky heat.",
      "Inner mesh grill in black-anodized steel; protects drivers without coloring the treble.",
      "Accent LED sits flush in the cup — a single signal of power, never a gaudy ring.",
    ],
    footnote: "Finishes: Matte Black, Sand, Midnight, Silver.",
  },
  {
    id: "drivers",
    title: "Drivers",
    lead: "Two chambers. One honest voice.",
    body: "40mm dual-chamber architecture. The exploded view reveals the stack that tames resonance — front cavity for attack, rear chamber for controlled bass decay — so kicks stay tight and vocals stay forward.",
    points: [
      "Titanium composite diaphragm: fast transient response without harsh top-end glare.",
      "Neodymium magnet assembly optimized for low distortion at travel volumes.",
      "Port geometry tuned with laser interferometry — not copy-paste vendor curves.",
      "Hybrid ANC mics sit outside and inside the cup for feedforward + feedback cancel.",
    ],
    footnote: "Tap Explode layers to separate cups, cushions, and driver stacks.",
    explode: true,
  },
  {
    id: "comfort",
    title: "Comfort",
    lead: "Marathon hours. Zero hotspots.",
    body: "Memory-foam rings seal gently. Clamp force is dialed for long sessions — firm enough for ANC, soft enough that you forget the hardware by track three.",
    points: [
      "Oval cushion footprint matches ear anatomy better than round foam donuts.",
      "Breathable protein leather + perforated inner facing reduces heat build-up.",
      "Replaceable pads click off in seconds — no adhesive drama.",
      "Cloud / Studio / Sport cushion kits available in the configurator.",
    ],
    footnote: "Wear-tested across 4–8 hour listening blocks.",
  },
  {
    id: "battery",
    title: "Battery",
    lead: "Weekend flights. One cable.",
    body: "42 hours with ANC on, 60 hours with ANC off. A ten-minute USB-C top-up returns hours of listening — so a gate change never means silence.",
    points: [
      "Smart power budgeting dims the LED and eases ANC when idle on your neck.",
      "Bluetooth 5.3 multipoint: laptop + phone without re-pairing theater.",
      "LDAC / AAC / SBC codec stack; USB-C wired path when the cabin goes radio-quiet.",
      "Battery health firmware keeps capacity honest past year two.",
    ],
    footnote: "Charge case optional — the H1 is built for all-day solo carry.",
  },
];

export function ScrollChapters() {
  const sectionRef = useRef<HTMLElement>(null);
  const color = useAppSelector((s) => s.configurator.colorHex);
  const reduced = useAppSelector((s) => s.ui.reducedMotion);
  const [active, setActive] = useState(0);
  const [exploded, setExploded] = useState(false);

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      const panels = gsap.utils.toArray<HTMLElement>(".chapter-panel");
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setActive(i);
            setExploded(Boolean(CHAPTERS[i].explode));
          },
          onEnterBack: () => {
            setActive(i);
            setExploded(Boolean(CHAPTERS[i].explode));
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} className="relative border-t border-line bg-void">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="md:sticky md:top-16 md:h-[calc(100svh-4rem)]">
          <div className="flex h-full flex-col justify-center px-5 py-10 md:px-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
              Anatomy · 0{active + 1} / 0{CHAPTERS.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={CHAPTERS[active]?.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="mt-2 font-display text-[22px] text-text/90"
              >
                {CHAPTERS[active]?.title}
              </motion.p>
            </AnimatePresence>
            <motion.div
              className="mt-4 h-[48vh] min-h-[280px] md:h-[58vh]"
              animate={{
                scale: exploded ? 0.96 : 1,
                rotateY: active * 6,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <ProductCanvas
                colorHex={color}
                exploded={exploded}
                productType="headphones"
                className="h-full w-full"
                interactive={false}
                framed
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setExploded((v) => !v)}
              className="mt-4 cursor-pointer self-start border border-line px-4 py-2 text-[14px] text-muted transition hover:border-accent hover:text-text"
            >
              {exploded ? "Assemble" : "Explode layers"}
            </button>
          </div>
        </div>

        <div className="border-l border-line">
          {CHAPTERS.map((ch) => (
            <article
              key={ch.id}
              className="chapter-panel flex min-h-[100svh] flex-col justify-center border-b border-line px-5 py-20 md:px-12"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-accent">
                {ch.id}
              </p>
              <h2 className="font-display mt-3 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold tracking-tight">
                {ch.title}
              </h2>
              <p className="mt-4 max-w-lg text-[18px] font-medium leading-snug text-text md:text-[20px]">
                {ch.lead}
              </p>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[17px]">
                {ch.body}
              </p>
              <ul className="mt-8 max-w-lg space-y-4">
                {ch.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 border-l border-line pl-4 text-[15px] leading-relaxed text-text/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-lg font-mono text-[13px] tracking-wide text-muted">
                {ch.footnote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
