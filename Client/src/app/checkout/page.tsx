"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearCart, selectCartTotal } from "@/features/cart/cartSlice";
import { confirmPayment, createPaymentIntent } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.email("Valid email required"),
  name: z.string().min(2, "Name required"),
});

type FormValues = z.infer<typeof schema>;

function StripePayForm({
  orderId,
  paymentIntentId,
  onPaid,
}: {
  orderId: string;
  paymentIntentId: string;
  onPaid: (id: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setBusy(true);
        setError(null);
        const result = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
          confirmParams: {
            return_url: `${window.location.origin}/checkout?paid=1`,
          },
        });
        if (result.error) {
          setError(result.error.message ?? "Payment failed");
          setBusy(false);
          return;
        }
        try {
          const order = await confirmPayment(paymentIntentId);
          onPaid(order.id || orderId);
        } catch {
          onPaid(orderId);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="rounded-xl border border-line bg-void/60 p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      {error && <p className="text-[14px] text-accent">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || busy}>
        {busy ? "Confirming…" : "Pay securely with Stripe"}
      </Button>
      <p className="text-center text-[14px] text-muted">
        Test card: <span className="font-mono text-text">4242 4242 4242 4242</span>
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const lines = useAppSelector((s) => s.cart.lines);
  const total = useAppSelector(selectCartTotal);
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const stripePromise = useMemo(() => getStripe(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@nova.audio", name: "Amitav" },
  });

  if (!lines.length && !orderId) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-[16px] text-muted">Nothing to checkout.</p>
        <Button href="/cart" className="mt-6">
          Back to cart
        </Button>
      </div>
    );
  }

  if (orderId && !clientSecret) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-accent-2">
          Payment complete
        </p>
        <h1 className="font-display mt-4 text-[40px]">Thank you</h1>
        <p className="mt-3 text-[16px] text-muted">
          Stripe confirmed. Order <span className="text-text">{orderId}</span>
        </p>
        <Button href="/products" className="mt-8">
          Keep exploring
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 lg:grid-cols-2 md:px-8">
      <div>
        <h1 className="font-display text-[36px] font-semibold">Checkout</h1>
        <p className="mt-2 text-[14px] text-muted">
          Secured by Stripe · test mode
        </p>

        {!clientSecret ? (
          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(async (values) => {
              setBootError(null);
              try {
                const res = await createPaymentIntent({
                  email: values.email,
                  name: values.name,
                  total,
                  itemsJson: lines,
                  token,
                });
                setClientSecret(res.clientSecret);
                setPaymentIntentId(res.paymentIntentId);
                setOrderId(res.order.id);
              } catch (err) {
                setBootError(
                  err instanceof Error
                    ? err.message
                    : "Could not start Stripe payment. Check API keys / server.",
                );
              }
            })}
          >
            <label className="block text-[14px]">
              <span className="text-muted">Email</span>
              <input
                {...register("email")}
                className="mt-1 w-full rounded-xl border border-line bg-panel px-4 py-3 outline-none focus:border-accent"
              />
              {errors.email && (
                <span className="text-accent">{errors.email.message}</span>
              )}
            </label>
            <label className="block text-[14px]">
              <span className="text-muted">Name</span>
              <input
                {...register("name")}
                className="mt-1 w-full rounded-xl border border-line bg-panel px-4 py-3 outline-none focus:border-accent"
              />
              {errors.name && (
                <span className="text-accent">{errors.name.message}</span>
              )}
            </label>
            {bootError && <p className="text-[14px] text-accent">{bootError}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Preparing Stripe…" : `Continue to payment · ${formatPrice(total)}`}
            </Button>
          </form>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#ff4d2e",
                  colorBackground: "#141416",
                  colorText: "#f4f4f5",
                  colorDanger: "#ff4d2e",
                  borderRadius: "12px",
                  fontFamily: "Outfit, system-ui, sans-serif",
                },
              },
            }}
          >
            <StripePayForm
              orderId={orderId ?? ""}
              paymentIntentId={paymentIntentId ?? ""}
              onPaid={(id) => {
                dispatch(clearCart());
                setClientSecret(null);
                setOrderId(id);
              }}
            />
          </Elements>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-panel p-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          Summary
        </p>
        <ul className="mt-4 space-y-3 text-[14px]">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-4">
              <span>
                {l.name} × {l.qty}
              </span>
              <span className="font-mono">{formatPrice(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-line pt-4 font-display text-[24px]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
      </aside>
    </div>
  );
}
