"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppSelector } from "@/store";
import { scrollToTopImmediate } from "@/lib/scroll-lock";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useAppSelector((s) => s.ui.reducedMotion);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    scrollToTopImmediate();

    if (reduced) {
      window.__novaLenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
      // Only block Lenis while actively dragging the 3D model
      prevent: () => document.documentElement.dataset.canvasDrag === "true",
    });

    window.__novaLenis = lenis;
    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      if (document.documentElement.dataset.canvasDrag === "true") return;
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const t1 = window.setTimeout(() => scrollToTopImmediate(), 50);
    const t2 = window.setTimeout(() => scrollToTopImmediate(), 300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      gsap.ticker.remove(tick);
      window.__novaLenis = null;
      lenis.destroy();
      document.documentElement.dataset.canvasDrag = "false";
      document.documentElement.classList.remove("nova-scroll-locked");
      document.body.classList.remove("nova-scroll-locked");
    };
  }, [reduced]);

  return children;
}
