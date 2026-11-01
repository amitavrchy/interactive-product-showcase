export type ProductVariant = {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  priceDelta: number;
  stock: number;
};

export type ProductSpecs = {
  drivers: string;
  battery: string;
  weight: string;
  connectivity: string;
  anc: string;
  ipRating: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  basePrice: number;
  modelUrl?: string | null;
  specs: ProductSpecs;
  embedText: string;
  variants: ProductVariant[];
  media: { url: string; kind: string; sortOrder: number }[];
  category: "headphones" | "speaker" | "earbuds";
};

export const COLORS = {
  sand: { name: "Sand", hex: "#F5F0E8" },
  matteBlack: { name: "Matte Black", hex: "#111111" },
  midnight: { name: "Midnight", hex: "#1E3A5F" },
  silver: { name: "Silver", hex: "#E8E8EA" },
} as const;

function colorVariants(prefix: string, extras: Record<string, number> = {}) {
  return [
    {
      id: `${prefix}-sand`,
      sku: `${prefix.toUpperCase()}-SD`,
      colorName: COLORS.sand.name,
      colorHex: COLORS.sand.hex,
      priceDelta: extras.sand ?? 0,
      stock: 90,
    },
    {
      id: `${prefix}-matte`,
      sku: `${prefix.toUpperCase()}-MB`,
      colorName: COLORS.matteBlack.name,
      colorHex: COLORS.matteBlack.hex,
      priceDelta: extras.matte ?? 0,
      stock: 120,
    },
    {
      id: `${prefix}-midnight`,
      sku: `${prefix.toUpperCase()}-MN`,
      colorName: COLORS.midnight.name,
      colorHex: COLORS.midnight.hex,
      priceDelta: extras.midnight ?? 20,
      stock: 75,
    },
    {
      id: `${prefix}-silver`,
      sku: `${prefix.toUpperCase()}-SV`,
      colorName: COLORS.silver.name,
      colorHex: COLORS.silver.hex,
      priceDelta: extras.silver ?? 15,
      stock: 80,
    },
  ];
}

export const CATALOG: CatalogProduct[] = [
  {
    id: "prod-nova-h1",
    slug: "nova-h1",
    name: "NOVA H1",
    tagline: "Studio silence. Living-room soul.",
    description:
      "Wireless over-ear headphones engineered for long listening — dual-chamber titanium drivers, adaptive ANC, and a sculpted aluminum yoke that disappears on your head.",
    basePrice: 349,
    modelUrl: "/models/nova-h1.glb",
    category: "headphones",
    specs: {
      drivers: "40mm titanium dual-chamber",
      battery: "42h ANC on · 60h ANC off",
      weight: "248g",
      connectivity: "Bluetooth 5.3 · USB-C LDAC",
      anc: "Hybrid adaptive ANC + transparency",
      ipRating: "IP54",
    },
    embedText: `NOVA H1 wireless headphones. Premium over-ear headphones with 40mm titanium dual-chamber drivers for precise mids and deep controlled bass. Hybrid adaptive active noise cancellation with transparency mode. Battery life 42 hours with ANC on, 60 hours ANC off. Weight 248 grams. Memory-foam protein leather cushions. Aluminum yoke with micro-texture finish. Colors: Matte Black, Sand, Midnight, Silver. Ideal for travel, studio monitoring, and immersive listening. Pairing via Bluetooth 5.3 with multipoint. USB-C with LDAC wired option.`,
    variants: colorVariants("h1"),
    media: [
      { url: "/images/h1-hero.svg", kind: "image", sortOrder: 0 },
      { url: "/images/h1-detail.svg", kind: "image", sortOrder: 1 },
    ],
  },
  {
    id: "prod-nova-s1",
    slug: "nova-s1",
    name: "NOVA S1",
    tagline: "Room-filling presence. Pocket-ready.",
    description:
      "A portable speaker with stereo twin drivers, 360° projection, and a tactile fabric shell that feels like furniture, not plastic.",
    basePrice: 249,
    category: "speaker",
    specs: {
      drivers: "Twin 45mm + passive radiator",
      battery: "18h playback",
      weight: "680g",
      connectivity: "Bluetooth 5.3 · Aux · PartyLink",
      anc: "N/A",
      ipRating: "IP67",
    },
    embedText: `NOVA S1 portable speaker. Twin 45mm drivers with downward passive radiator for room-filling bass. 360 degree sound projection. IP67 waterproof and dustproof. 18 hour battery. PartyLink pairs two S1 units for stereo. Fabric shell in Matte Black, Sand, Midnight, Silver. Ideal for patio, travel, and desktop listening.`,
    variants: colorVariants("s1", { midnight: 15, silver: 10 }),
    media: [{ url: "/images/s1-hero.svg", kind: "image", sortOrder: 0 }],
  },
  {
    id: "prod-nova-buds",
    slug: "nova-buds",
    name: "NOVA Buds Pro",
    tagline: "Precision in your pocket.",
    description:
      "True wireless earbuds with spatial audio, adaptive ANC, and a charging case that wirelessly tops up overnight.",
    basePrice: 179,
    category: "earbuds",
    specs: {
      drivers: "11mm graphene composite",
      battery: "8h + 24h case",
      weight: "5.2g each",
      connectivity: "Bluetooth 5.3 · LE Audio",
      anc: "Adaptive ANC + hear-through",
      ipRating: "IP55",
    },
    embedText: `NOVA Buds Pro true wireless earbuds. 11mm graphene drivers. Adaptive ANC with hear-through. 8 hours earbud battery plus 24 hours in case. Spatial audio with head tracking. Wireless charging case. Four colors. Ideal for commuting, workouts, and calls.`,
    variants: colorVariants("buds", { midnight: 10, silver: 10 }),
    media: [{ url: "/images/buds-hero.svg", kind: "image", sortOrder: 0 }],
  },
];

export const REVIEWS = [
  {
    id: "r1",
    name: "Maya R.",
    role: "Producer",
    quote:
      "The H1 disappears on my head by hour three. ANC is surgical without the vacuum feel.",
    rating: 5,
  },
  {
    id: "r2",
    name: "Jonah K.",
    role: "Traveler",
    quote:
      "Took the S1 from kitchen to pier. Sound stays composed at volume — rare for something this small.",
    rating: 5,
  },
  {
    id: "r3",
    name: "Elena V.",
    role: "Designer",
    quote:
      "Sand finish looks like ceramic. Configure-and-share link made gifting effortless.",
    rating: 5,
  },
];

export function getProduct(slug: string) {
  return CATALOG.find((p) => p.slug === slug);
}

export function priceFor(product: CatalogProduct, colorHex?: string) {
  const variant = product.variants.find((v) => v.colorHex === colorHex) ?? product.variants[0];
  return product.basePrice + (variant?.priceDelta ?? 0);
}
