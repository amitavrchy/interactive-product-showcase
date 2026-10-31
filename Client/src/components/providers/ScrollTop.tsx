"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToTopImmediate } from "@/lib/scroll-lock";

export function ScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    scrollToTopImmediate();
    const id = window.setTimeout(() => scrollToTopImmediate(), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
