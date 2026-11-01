# NOVA Audio

A cinematic 3D storefront for the NOVA Audio headphone and speaker line, backed by a NestJS catalog API and an optional FastAPI catalog assistant.

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-assistant-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

## Live demo

> **TODO — public URLs are not in this repository.**  
> The GitHub homepage field is empty. `frontend/netlify.toml`, `render.yaml`, the env examples, and the source only name localhost. Replace the lines below when the deploys are public.

| Surface | URL |
| --- | --- |
| Storefront | TODO |
| API | TODO |

Local addresses once the apps are running: storefront [http://localhost:3000](http://localhost:3000), API [http://localhost:4000](http://localhost:4000), assistant [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Overview

NOVA Audio is a three-part product experience. The storefront is a Next.js shop with a WebGL product stage, a color and engraving configurator, cart, and checkout. The API owns the catalog, accounts, orders, payments, and saved configurations in PostgreSQL. A separate FastAPI service answers product questions from the catalog and falls back to an offline template when `OPENAI_API_KEY` is unset. The storefront also keeps a local catalog, so the shop still renders if the API or the assistant is down.

The seeded catalog is the NOVA H1 Wireless Headphones, the NOVA S1 Portable Speaker, and the NOVA Buds Pro.

## Features

- Scroll-led home page: preloader, hero, product chapters, color story, specs, reviews, and a buy call to action
- React Three Fiber product stage with drag orbit; procedural meshes stand in until GLB files are added under `frontend/public/models/`
- Configurator for color, cushion, and engraving, with a live price and shareable saved configurations
- Catalog, product pages, compare, cart, and Stripe checkout when keys are present
- Accounts, order history, and an admin product screen
- JWT auth with customer and admin roles
- Catalog assistant widget with citations, plus a storefront fallback when the assistant service is offline

## Tech stack

| Part | Stack |
| --- | --- |
| `frontend/` | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, TanStack Query, React Hook Form, Zod, React Three Fiber, GSAP, Framer Motion, Embla, Stripe.js |
| `backend/` | NestJS 12, Prisma 6, PostgreSQL 16, Passport JWT, Stripe, Vitest |
| `ai/` | FastAPI, LangChain, Chroma, OpenAI (optional) |

Node.js 22 is the version pinned for the Netlify build.

## Project structure

```text
.
├── frontend/          Next.js storefront (Netlify)
│   ├── src/           App routes, 3D stage, configurator, cart
│   ├── public/models/ Drop GLB assets here
│   └── netlify.toml
├── backend/           NestJS API (Render)
│   ├── src/           Auth, products, orders, payments, configs
│   ├── prisma/        Schema, migrations, seed
│   ├── Dockerfile.render
│   └── docker-compose.yml
├── ai/                FastAPI catalog assistant
├── render.yaml        Render blueprint (repo root; do not move)
├── PROJECT_SPEC.md    Original product and build spec
└── README.md
```

`render.yaml` stays at the repository root because Render reads the blueprint from there. `frontend/netlify.toml` stays beside the Next.js app.

## Getting started

Install [Node.js 22](https://nodejs.org) and npm. The API needs PostgreSQL 16. Docker Compose in `backend/` starts it. The assistant needs Python 3.12.

### API

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
docker compose up -d
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

`GET http://localhost:4000/health` should report the service up. Seeded local accounts:

| Email | Password | Role |
| --- | --- | --- |
| `admin@nova.audio` | `Admin123!` | Admin |
| `demo@nova.audio` | `Demo123!` | Customer |

Replace `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` before sharing a machine. Both must be at least 32 characters. The process exits on boot if `JWT_SECRET` is missing, and Prisma exits if Postgres is unreachable.

Useful scripts: `npm run build`, `npm run start:prod`, `npm run lint`, `npm test`.

### Storefront

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `NEXT_PUBLIC_API_URL` defaults to `http://localhost:4000`. `AI_SERVICE_URL` defaults to `http://127.0.0.1:8000`.

Useful scripts: `npm run build`, `npm run start`, `npm run lint`. `npm run build` typechecks the app.

Place production models at `frontend/public/models/nova-h1.glb` (optional `nova-s1.glb`, `nova-buds.glb`). Until those files exist, the stage uses procedural meshes that still follow configurator colors.

### Catalog assistant

```bash
cd ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Leave `OPENAI_API_KEY` empty for the offline catalog answers. With a key set, chat uses the model named by `OPENAI_MODEL` (default `gpt-4.1-mini`). Ingest the catalog after the API is up:

```bash
curl -X POST http://127.0.0.1:8000/ingest -H "Content-Type: application/json" -d '{"force":true}'
```

The Render image does not start this service. The storefront answers from its local catalog when `http://127.0.0.1:8000` is down.

## Deploy

### Netlify (storefront)

`frontend/netlify.toml` sets the build command, publish directory (`.next`), Node 22, and the Next.js plugin. In the Netlify site settings, set **Base directory** to `frontend`.

This app used to live in `Client/`. If the site still has base directory `Client`, change it to `frontend` or the build will not find `package.json`.

### Render (API)

`render.yaml` defines the `nova-audio-api` web service. Docker context is `./backend` and the Dockerfile is `./backend/Dockerfile.render`. The service bundles Postgres in that image and listens on port 4000. Health check path is `/health`.

Leave the Render **root directory** as the repository root so those paths resolve. If the service was created while the API lived in `Server/`, sync the blueprint or set the Docker context to `./backend` and the Dockerfile path to `./backend/Dockerfile.render`.

`CLIENT_ORIGIN` is declared with `sync: false`. Set it in the Render dashboard to the storefront origin (comma-separated if you have more than one). The API allows localhost origins in addition to that list.

## Author

[Amitav Roy Chowdhury](https://github.com/amitavrchy)

## License

This repository does not include a `LICENSE` file. The API package is marked `UNLICENSED` in `backend/package.json`.
