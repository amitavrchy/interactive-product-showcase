"use client";

import { motion } from "framer-motion";
import { ProductCanvas } from "@/components/canvas/ProductCanvas";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { setChatOpen } from "@/features/ui/uiSlice";

export function Hero() {
  const color = useAppSelector((s) => s.configurator.colorHex);
  const dispatch = useAppDispatch();

  return (
    <section className="hero-atmosphere relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,77,46,0.12),transparent_40%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-2 px-5 pb-12 pt-2 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-14">
        <div className="order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-mono text-[14px] uppercase tracking-[0.28em] text-accent"
          >
            Wireless headphones
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-4 text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.9] tracking-tight text-balance"
          >
            NOVA
            <span className="block text-muted">H1</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-6 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px]"
          >
            Hear it. See every layer. Configure yours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button href="/configure/nova-h1">Configure</Button>
            <Button type="button" variant="secondary" onClick={() => dispatch(setChatOpen(true))}>
              Meet AI
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 flex h-[56vh] min-h-[420px] items-center justify-center md:order-2 md:h-[min(84vh,860px)]"
        >
          <ProductCanvas
            colorHex={color}
            productType="headphones"
            className="h-full w-full"
            interactive
            framed
          />
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 font-mono text-[12px] tracking-[0.3em] text-muted">
        SCROLL
      </div>
    </section>
  );
}
