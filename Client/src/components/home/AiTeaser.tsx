"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store";
import { setChatOpen } from "@/features/ui/uiSlice";

export function AiTeaser() {
  const dispatch = useAppDispatch();

  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,255,178,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-accent-2">
            AI concierge
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.05]">
            Ask what the page can’t show.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[18px]">
            A shopping assistant grounded in real catalog embeddings — citations,
            comparisons, and “add to bag” suggestions without the sales pitch fog.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" variant="mint" onClick={() => dispatch(setChatOpen(true))}>
              <Sparkles className="h-4 w-4" />
              Open assistant
            </Button>
            <Button href="/assistant" variant="secondary">
              Full page
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
