"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { scrollToTopImmediate } from "@/lib/scroll-lock";

gsap.registerPlugin(ScrollTrigger);

/** Native scroll only — no Lenis inertia. Keeps ScrollTrigger + top-of-page reset. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.__novaLenis = null;
    scrollToTopImmediate();

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", onScroll, { passive: true });

    const t1 = window.setTimeout(() => scrollToTopImmediate(), 50);
    const t2 = window.setTimeout(() => {
      scrollToTopImmediate();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.dataset.canvasDrag = "false";
      document.documentElement.classList.remove("nova-scroll-locked");
      document.body.classList.remove("nova-scroll-locked");
    };
  }, []);

  return children;
}
