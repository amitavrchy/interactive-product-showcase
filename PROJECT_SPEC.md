# Interactive Product Showcase — Project Build Spec (Agent-Ready)

> Stack: Next.js + Redux + RQ + RHF/zod + framer-motion + **three / @react-three/fiber / @react-three/drei / gsap**. NestJS + Prisma + JWT. **`ai/` FastAPI**: OpenAI + LangChain + ChromaDB — **AI product assistant / RAG over catalog**. Optional adds: `leva` (dev only), `@radix-ui/react-dialog`, `embla-carousel-react`, `lenis`, `zustand` ❌ never — use Redux for configurator selections.

---

## 1. Vision & Audience

**Vision:** A headless-commerce-quality **3D product experience** for a premium consumer electronics brand **“NOVA Audio”** (wireless headphones / speaker line). Think iyO configurator + Jetson by Mute scroll reveals + Vanquish-level craft, plus an AI shopping concierge that answers from real catalog embeddings.

**Audience:** Design-conscious shoppers 25–45; gift buyers; audio enthusiasts.

**Promise:** “Hear it. See every layer. Configure yours.”

---

## 2. References

| Site | Steal | Link |
|------|-------|------|
| iyO | 3D configurator, color switch, exploded view, WebGL haiku — Awwwards SOTD Apr 2 2026 | https://www.awwwards.com/sites/iyo |
| Jetson by Mute | Scroll product animation, 3D configurator, headless PDP | https://www.awwwards.com/sites/jetson-by-mute |
| Vanquish Yachts | Photoreal configurator UX | https://www.awwwards.com/sites/vanquish-yachts |
| TOTEM Configurator | Pre/live render pattern | https://www.awwwards.com/sites/totem-configurator |
| Apple product pages | Spec drawers, cinematic video | https://www.apple.com |

---

## 3. Design System

### Color
| Token | Hex |
|-------|-----|
| `--void` | `#0B0B0C` |
| `--panel` | `#141416` |
| `--line` | `#2C2C32` |
| `--text` | `#F4F4F5` |
| `--muted` | `#A1A1AA` |
| `--accent` | `#FF4D2E` (signal orange-red) |
| `--accent-2` | `#7CFFB2` (tech mint for AI) |
| Product swatches | `#111111` Matte Black, `#F5F0E8` Sand, `#1E3A5F` Midnight, `#E8E8EA` Silver |

### Typography
- Display: `Syne` or `Outfit`
- Body: `Inter`
- Specs mono: `IBM Plex Mono`
- Huge product name clamp 3–8rem

### Motion
- Scroll product pin: GSAP ScrollTrigger pin 100–200vh per chapter
- Exploded view: GSAP timeline 1.2s power2.inOut separating meshes
- Color switch: crossfade material 400ms
- R3F: `Environment`, `ContactShadows`, `PresentationControls`; dpr `[1, 1.5]`; adaptive performance
- Lenis optional on marketing; **pause Lenis when dragging 3D**

---

## 4. Sitemap

### `/`
1. Preloader with audio-wave canvas (skip accessible)
2. Hero: R3F headphone floating + H1 + CTA “Configure” / “Meet AI”
3. Scroll chapters: Form / Materials / Drivers (exploded) / Comfort / Battery
4. Color story Embla
5. Specs strip sticky compare
6. AI assistant teaser → `/assistant`
7. Reviews
8. Buy CTA

### `/products` · `/products/[slug]`
Grid + PDP with 3D viewer + gallery fallback images + add to cart + AI “Ask about this product”.

### `/configure/[slug]`
Full configurator: color, ear cushion, engraving text, case; live price; AR placeholder button; Save config (auth) / Share link (query serialized).

### `/compare`
Side-by-side 2–3 SKUs.

### `/assistant`
Full-page AI chat with product citations + “add to bag” cards.

### `/cart` · `/checkout` (mock payment) · `/account/orders`
### `/lab` (stretch WebGL experiments)
### Admin `/admin/products` catalog + embed docs for AI ingest

**Signature:** Exploded WebGL view on scroll; dynamic color-switch slider; multi-state cart; AI chat with streaming tokens.

---

## 5. Features

### MVP
- Catalog from Nest/Prisma with variants (color)
- R3F viewer with GLB placeholder models (document where to drop assets in `/public/models`)
- Configurator state in Redux; URL sync
- Cart + checkout mock
- AI FastAPI: ingest product markdown → Chroma; chat endpoint with citations
- Next proxies `/api/ai/*` to FastAPI

### Stretch
- Real engraving on texture canvas
- Physics cable (Rapier) — optional
- Voice input to AI
- WebXR try-on stub
- Order emails

---

## 6. Frontend Architecture

```
frontend/src/
  app/(shop)/ ...
  components/canvas/ (Scene, HeadphoneModel, ExplodedRig, ColorMaterials)
  components/configurator/ (Swatches, EngravingInput, PriceBar)
  components/ai/ (ChatPanel, CitationCard)
  features/cart/cartSlice.ts
  features/configurator/configuratorSlice.ts
  features/auth/authSlice.ts
```

**Redux:** cart line items; configurator `{productId, color, cushion, engraving}`; auth; ui (chat open).
**React Query:** products, product detail, orders; AI history optional.
**GLB:** use `/public/models/nova-h1.glb` with fallback primitive if missing.

---

## 7. Backend (Nest + Prisma)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

enum Role { CUSTOMER ADMIN }
enum OrderStatus { PENDING PAID FULFILLED CANCELLED }

model User {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
  name         String
  role         Role @default(CUSTOMER)
  orders       Order[]
  savedConfigs SavedConfig[]
  createdAt    DateTime @default(now())
}

model Product {
  id          String @id @default(cuid())
  slug        String @unique
  name        String
  tagline     String
  description String
  basePrice   Decimal @db.Decimal(10,2)
  specsJson   Json
  modelUrl    String?
  embedText   String  // canonical text for AI RAG
  variants    Variant[]
  media       ProductMedia[]
  published   Boolean @default(true)
  createdAt   DateTime @default(now())
}

model Variant {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku       String @unique
  colorName String
  colorHex  String
  priceDelta Decimal @default(0) @db.Decimal(10,2)
  stock     Int @default(100)
}

model ProductMedia {
  id String @id @default(cuid())
  productId String
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url String
  kind String @default("image")
  sortOrder Int @default(0)
}

model SavedConfig {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  configJson Json
  shareCode String @unique @default(cuid())
  createdAt DateTime @default(now())
}

model Order {
  id String @id @default(cuid())
  userId String?
  user User? @relation(fields: [userId], references: [id])
  email String
  status OrderStatus @default(PENDING)
  total Decimal @db.Decimal(10,2)
  itemsJson Json
  createdAt DateTime @default(now())
}
```

### Nest endpoints
| Method | Path | Auth |
|--------|------|------|
| GET | `/products` `/products/:slug` | public |
| CRUD | `/products` | ADMIN |
| POST | `/configs` GET `/configs/:shareCode` | JWT / public read |
| POST | `/orders` | public/JWT |
| GET | `/orders/me` | JWT |
| POST | `/auth/*` | |

---

## 8. AI Service (`ai/`)

**Purpose:** RAG shopping assistant over product `embedText` + specs + FAQs.

### Endpoints
| Method | Path | Body | Behavior |
|--------|------|------|----------|
| POST | `/ingest` | `{ force?: bool }` | Pull products from Nest or local seed → chunk → Chroma collection `nova_catalog` |
| POST | `/chat` | `{ messages: {role,content}[], productSlug?: string }` | Retrieve top-k → LangChain stuff docs → OpenAI chat; return `{ answer, citations: [{slug,title,snippet}] }` |
| GET | `/health` | | |

### Prompt sketch
System: “You are NOVA Audio’s product expert. Answer only from provided context. If unknown, say you don’t know and suggest a product to compare. Prefer concise, sensory language. Cite product slugs.”

### Flow
1. On deploy/seed: `POST /ingest`
2. The storefront ChatPanel streams or waits on `/chat`
3. Citations render as product cards linking to PDP
4. Env: `OPENAI_API_KEY`, `NEST_API_URL`, `CHROMA_PATH`

---

## 9. Perf / A11y / SEO

- 3D: lazy Canvas (`dynamic` ssr:false); suspend with poster image; reduce motion → static gallery
- Draco/meshopt compression for GLB; texture ≤ 2k
- Lighthouse marketing ≥ 85; configure page ≥ 70 OK if documented
- A11y: configurator fully usable without WebGL; AI chat live region
- SEO: Product JSON-LD Offer

---

## 10. Build Order

1. Prisma seed 3 products + variants + embedText
2. Nest catalog + orders
3. Next PDP with image gallery
4. R3F viewer + color materials
5. Configurator + cart Redux
6. FastAPI ingest + chat + Next proxy
7. Scroll storytelling home with GSAP
8. Polish, reduced-motion, SEO

## 11. Acceptance

- [ ] Can configure color and see 3D material update
- [ ] Exploded view animates on scroll or button
- [ ] AI answers cite real catalog chunks
- [ ] Cart totals reflect variant priceDelta
- [ ] Share link restores configurator state
- [ ] Works with WebGL disabled (2D fallback)
