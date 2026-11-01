"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCartCount } from "@/features/cart/cartSlice";
import { setChatOpen } from "@/features/ui/uiSlice";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const links = [
  { href: "/products", label: "Products" },
  { href: "/configure/nova-h1", label: "Configure" },
  { href: "/compare", label: "Compare" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const count = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-void/70 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-[22px] font-semibold tracking-[0.18em] text-text">
            NOVA
          </span>
          <span className="hidden text-[14px] tracking-[0.3em] text-muted sm:inline">
            AUDIO
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-[14px] tracking-wide text-muted transition hover:text-text",
                  active && "text-text",
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(setChatOpen(true))}
            className="hidden min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-accent/40 bg-accent px-3.5 py-2 text-[14px] font-medium text-white shadow-[0_8px_24px_rgba(255,77,46,0.28)] transition hover:brightness-110 sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask NOVA
          </button>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-text transition hover:border-muted"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
