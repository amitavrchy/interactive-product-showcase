"use client";

import { motion } from "framer-motion";
import { REVIEWS } from "@/data/catalog";

export function Reviews() {
  return (
    <section className="border-t border-line bg-panel py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
          Voices
        </p>
        <h2 className="font-display mt-3 text-[clamp(2.2rem,4vw,3.2rem)] font-semibold">
          Tuned by people who listen hard.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.blockquote
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="border border-line p-6"
            >
              <p className="text-[16px] leading-relaxed text-text/90">“{r.quote}”</p>
              <footer className="mt-6 flex items-center justify-between text-[14px]">
                <div>
                  <p className="text-text">{r.name}</p>
                  <p className="text-muted">{r.role}</p>
                </div>
                <p className="font-mono text-accent">{"★".repeat(r.rating)}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
