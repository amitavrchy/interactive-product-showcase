# NOVA Audio

**Storefront:** [https://nova-audio-163.netlify.app](https://nova-audio-163.netlify.app)  
**API:** [https://nova-audio-api.onrender.com](https://nova-audio-api.onrender.com)

Hear it. See every layer. A cinematic 3D storefront for the NOVA headphone, speaker, and earbud line, with a NestJS catalog API and an optional FastAPI assistant.

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-assistant-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

## Overview

NOVA Audio is a three-part product experience. The storefront is a Next.js shop with a WebGL product stage, a color and engraving configurator, cart, and checkout. The API owns the catalog, accounts, orders, payments, and saved configurations in PostgreSQL. A FastAPI service answers product questions from that catalog and falls back to an offline template when `OPENAI_API_KEY` is empty. The storefront also keeps a local catalog, so the shop still renders if the API or the assistant is down.

The seeded line is the NOVA H1 Wireless Headphones, the NOVA S1 Portable Speaker, and the NOVA Buds Pro.

## Features

- Scroll-led home page: preloader, hero, product chapters, color story, specifications, reviews, and a buy call to action
- React Three Fiber stage with drag orbit and an exploded view; procedural meshes stand in until GLB files are added under `Client/public/models/`
- Configurator for color, ear cushion, case finish, and engraving, with a live price and shareable saved configurations
- Catalog, product pages, compare, and cart
- Stripe checkout when publishable and secret keys are set
- JWT accounts, order history, and an admin product screen
- Assistant widget with citations, plus a storefront fallback when the assistant service is offline

## Tech stack

| Part | Path | Stack |
| --- | --- | --- |
| Storefront | `Client/` | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, TanStack Query, React Hook Form, Zod, React Three Fiber, GSAP, Framer Motion, Embla, Stripe.js |
| API | `Server/` | NestJS 12, Prisma 6, PostgreSQL 16, Passport JWT, Stripe, Vitest, oxlint |
| Assistant | `ai/` | FastAPI, LangChain, Chroma, OpenAI (optional) |

Node.js 22 is the version pinned for the Netlify build. Local development uses the same major version.

## Project structure

```text
.
├── Client/                 Next.js storefront (Netlify)
│   ├── src/                Routes, 3D stage, configurator, cart
│   ├── public/models/      Drop GLB assets here
│   └── netlify.toml        Build command, publish dir, Node 22
├── Server/                 NestJS API (Render)
│   ├── src/                Auth, products, orders, payments, configs
│   ├── prisma/             Schema, migrations, seed
│   ├── Dockerfile.render   Production image with bundled Postgres
│   └── docker-compose.yml  Local Postgres 16
├── ai/                     FastAPI catalog assistant
├── render.yaml             Render blueprint (stays at the repo root)
└── README.md
```

## Getting started

Install Node.js 22 and npm. The API expects PostgreSQL 16 (`Server/prisma/schema.prisma`). Docker Compose in `Server/` starts it. The assistant needs Python 3.

### API

```bash
cd Server
cp .env.example .env
npm install
npx prisma generate
docker compose up -d
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

Set `DATABASE_URL` to the Postgres instance from `docker-compose.yml`, and set `JWT_SECRET` before sharing a machine. The API fails to boot if `JWT_SECRET` is missing, and Prisma fails to connect if Postgres is unreachable. `GET /health` on the live API reports whether the service and the database are up.

Seeded accounts:

| Email | Password | Role |
| --- | --- | --- |
| `admin@nova.audio` | `Admin123!` | Admin |
| `demo@nova.audio` | `Demo123!` | Customer |

Useful scripts: `npm run build`, `npm run start:prod`, `npm run lint`, `npm test`.

### Storefront

```bash
cd Client
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the API and `AI_SERVICE_URL` to the assistant. The deployed storefront is [https://nova-audio-163.netlify.app](https://nova-audio-163.netlify.app).

Useful scripts: `npm run build`, `npm run start`, `npm run lint`. `npm run build` typechecks the app.

Place production models at `Client/public/models/nova-h1.glb` (optional `nova-s1.glb`, `nova-buds.glb`). Until those files exist, the stage uses procedural meshes that still follow configurator colors.

### Catalog assistant

```bash
cd ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Leave `OPENAI_API_KEY` empty for offline catalog answers. With a key set, chat uses `OPENAI_MODEL` (default `gpt-4.1-mini`). After the API is up, `POST /ingest` with a JSON body of `{"force": true}`. The assistant reads `NEST_API_URL` for the catalog.

The Render image does not start this service. The storefront answers from its bundled catalog when `AI_SERVICE_URL` does not respond.

## Deploy

These paths match the services that are already live. No Render or Netlify setting change is required for this layout.

### Netlify (storefront)

The site was published with the Netlify CLI from `Client/`. `Client/netlify.toml` sets the build command, the publish directory (`.next`), Node 22, and the Next.js plugin. The CLI base directory stays `Client`.

### Render (API)

`render.yaml` defines the `nova-audio-api` web service. The Render root directory stays empty (the repository root). The Dockerfile path is `./Server/Dockerfile.render` and the Docker build context is `./Server`. The image bundles Postgres, listens on the `PORT` configured for the service, and uses `/health` as the health check.

`CLIENT_ORIGIN` is declared with `sync: false`. Set it in the Render dashboard to the live storefront, comma-separated if there is more than one origin.

## Author

[Amitav Roy Chowdhury](https://github.com/amitavrchy)
