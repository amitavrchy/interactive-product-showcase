"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium tracking-wide transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-accent text-white shadow-[0_10px_28px_rgba(255,77,46,0.28)] hover:brightness-110",
  secondary:
    "border border-line bg-transparent text-text hover:border-muted hover:bg-panel",
  mint: "btn-mint",
  ghost: "text-muted hover:text-text",
} as const;

type Props = {
  variant?: keyof typeof variants;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
