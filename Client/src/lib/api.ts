import axios from "axios";
import { CATALOG, type CatalogProduct } from "@/data/catalog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
});

function mapProduct(raw: Record<string, unknown>): CatalogProduct {
  const rawSpecs = (raw.specs ?? raw.specsJson) as Partial<CatalogProduct["specs"]> | undefined;
  const specs: CatalogProduct["specs"] = {
    drivers: String(rawSpecs?.drivers ?? "—"),
    battery: String(rawSpecs?.battery ?? "—"),
    weight: String(rawSpecs?.weight ?? "—"),
    connectivity: String(rawSpecs?.connectivity ?? "—"),
    anc: String(rawSpecs?.anc ?? rawSpecs?.["waterproof" as never] ?? "—"),
    ipRating: String(rawSpecs?.ipRating ?? rawSpecs?.["waterproof" as never] ?? "—"),
  };
  return {
    id: String(raw.id),
    slug: String(raw.slug),
    name: String(raw.name),
    tagline: String(raw.tagline ?? ""),
    description: String(raw.description ?? ""),
    basePrice: Number(raw.basePrice),
    modelUrl: (raw.modelUrl as string) ?? null,
    specs,
    embedText: String(raw.embedText ?? ""),
    category:
      String(raw.slug).includes("buds")
        ? "earbuds"
        : String(raw.slug).includes("s1")
          ? "speaker"
          : "headphones",
    variants: ((raw.variants as CatalogProduct["variants"]) ?? []).map((v) => ({
      ...v,
      priceDelta: Number(v.priceDelta),
    })),
    media: (raw.media as CatalogProduct["media"]) ?? [],
  };
}

export async function fetchProducts(): Promise<CatalogProduct[]> {
  try {
    const { data } = await api.get("/products");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    if (!list.length) return CATALOG;
    return list.map(mapProduct);
  } catch {
    return CATALOG;
  }
}

export async function fetchProduct(slug: string): Promise<CatalogProduct | null> {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return mapProduct(data);
  } catch {
    return CATALOG.find((p) => p.slug === slug) ?? null;
  }
}

export async function createOrder(payload: {
  email: string;
  itemsJson: unknown;
  total: number;
  token?: string | null;
}) {
  try {
    const { data } = await api.post(
      "/orders",
      {
        email: payload.email,
        itemsJson: payload.itemsJson,
        total: payload.total,
      },
      payload.token
        ? { headers: { Authorization: `Bearer ${payload.token}` } }
        : undefined,
    );
    return data;
  } catch {
    return {
      id: `mock-${Date.now()}`,
      status: "PENDING",
      email: payload.email,
      total: payload.total,
    };
  }
}

export async function createPaymentIntent(payload: {
  email: string;
  name?: string;
  itemsJson: unknown;
  total: number;
  token?: string | null;
}) {
  const { data } = await api.post(
    "/payments/intent",
    {
      email: payload.email,
      name: payload.name,
      itemsJson: payload.itemsJson,
      total: payload.total,
    },
    payload.token
      ? { headers: { Authorization: `Bearer ${payload.token}` } }
      : undefined,
  );
  return data as {
    clientSecret: string;
    paymentIntentId: string;
    order: { id: string; status: string };
  };
}

export async function confirmPayment(paymentIntentId: string) {
  const { data } = await api.post("/payments/confirm", { paymentIntentId });
  return data as { id: string; status: string };
}

export async function chatWithAi(body: {
  messages: { role: string; content: string }[];
  productSlug?: string;
}) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const fallback = localAiFallback(body.messages.at(-1)?.content ?? "", body.productSlug);
    return fallback;
  }
  return res.json();
}

function localAiFallback(question: string, productSlug?: string) {
  const product =
    CATALOG.find((p) => p.slug === productSlug) ??
    CATALOG.find((p) => question.toLowerCase().includes(p.slug.replace("-", " "))) ??
    CATALOG[0];
  return {
    answer: `${product.name} — ${product.tagline} ${product.specs.drivers}. Battery: ${product.specs.battery}. From $${product.basePrice}. Ask about color, ANC, or compare with another NOVA model.`,
    citations: [
      {
        slug: product.slug,
        title: product.name,
        snippet: product.embedText.slice(0, 140) + "…",
      },
    ],
  };
}
