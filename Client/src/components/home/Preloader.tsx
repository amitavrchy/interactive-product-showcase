"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPreloaderDone } from "@/features/ui/uiSlice";
import { scrollToTopImmediate } from "@/lib/scroll-lock";

export function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const done = useAppSelector((s) => s.ui.preloaderDone);
  const reduced = useAppSelector((s) => s.ui.reducedMotion);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (done) {
      scrollToTopImmediate();
      return;
    }
    if (reduced) {
      dispatch(setPreloaderDone(true));
      scrollToTopImmediate();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let start = performance.now();
    const duration = 2200;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(t * 100));
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0b0c";
      ctx.fillRect(0, 0, w, h);

      const bars = 48;
      const midY = h * 0.5;
      for (let i = 0; i < bars; i++) {
        const x = (w / bars) * i + w / bars / 2;
        const wave =
          Math.sin(now * 0.008 + i * 0.35) * 40 +
          Math.sin(now * 0.015 + i * 0.2) * 22;
        const amp = wave * (0.4 + t * 0.8);
        ctx.beginPath();
        ctx.strokeStyle = i % 7 === 0 ? "#ff4d2e" : "#f4f4f5";
        ctx.globalAlpha = 0.35 + (i % 3) * 0.15;
        ctx.lineWidth = 2;
        ctx.moveTo(x, midY - amp);
        ctx.lineTo(x, midY + amp);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (t < 1) raf = requestAnimationFrame(draw);
      else {
        dispatch(setPreloaderDone(true));
        scrollToTopImmediate();
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [done, reduced, dispatch]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
          <div className="relative z-10 text-center">
            <p className="font-display text-[42px] tracking-[0.28em] md:text-[64px]">NOVA</p>
            <p className="mt-3 font-mono text-[14px] tracking-[0.35em] text-muted">
              TUNING · {progress}%
            </p>
          </div>
          <button
            type="button"
            className="absolute bottom-10 z-10 text-[14px] tracking-widest text-muted underline-offset-4 hover:text-text hover:underline"
            onClick={() => {
              dispatch(setPreloaderDone(true));
              scrollToTopImmediate();
            }}
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
