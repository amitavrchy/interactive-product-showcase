"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeLine, setQty, selectCartTotal } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const lines = useAppSelector((s) => s.cart.lines);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-[40px]">Your bag is empty</h1>
        <p className="mt-3 text-[16px] text-muted">Configure a NOVA and add it here.</p>
        <Button href="/products" className="mt-8">
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-8">
      <h1 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-semibold">Bag</h1>
      <ul className="mt-10 space-y-4">
        {lines.map((line) => (
          <li
            key={line.key}
            className="flex flex-wrap items-center justify-between gap-4 border border-line p-5"
          >
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full border border-line"
                style={{ background: line.colorHex }}
              />
              <div>
                <p className="text-[16px] font-medium">{line.name}</p>
                <p className="text-[14px] text-muted">
                  {line.colorName}
                  {line.engraving ? ` · “${line.engraving}”` : ""}
                  {` · ${line.cushion} · ${line.caseFinish}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[14px] text-muted">
                Qty
                <input
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) =>
                    dispatch(setQty({ key: line.key, qty: Number(e.target.value) || 1 }))
                  }
                  className="w-16 border border-line bg-void px-2 py-1 text-text"
                />
              </label>
              <p className="w-20 text-right font-mono text-[14px]">
                {formatPrice(line.unitPrice * line.qty)}
              </p>
              <button
                type="button"
                className="text-[14px] text-muted hover:text-accent"
                onClick={() => dispatch(removeLine(line.key))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <p className="font-display text-[28px]">Total {formatPrice(total)}</p>
        <div className="flex gap-3">
          <Link href="/products" className="px-4 py-3 text-[14px] text-muted hover:text-text">
            Continue shopping
          </Link>
          <Button href="/checkout">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
