"use client";

import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 md:px-8">
      <h1 className="font-display text-[36px] font-semibold">Orders</h1>
      <p className="mt-3 text-[16px] text-muted">
        Sign in to sync order history from the Nest API. Demo checkout still works as a guest.
      </p>
      <div className="mt-8 border border-line p-6 text-[14px] text-muted">
        No authenticated orders yet. Complete a mock checkout to see a local confirmation.
      </div>
      <Button href="/checkout" className="mt-6" variant="secondary">
        Go to checkout
      </Button>
    </div>
  );
}
