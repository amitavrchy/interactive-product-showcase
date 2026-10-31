# NOVA Audio — Interactive Product Showcase

Premium 3D product experience: Next.js + NestJS + FastAPI RAG assistant.

## Stack

| App | Path | Port |
|-----|------|------|
| Client | `Client/` | 3000 |
| API | `Server/` | 4000 |
| AI | `ai/` | 8000 |

## Quick start

### 1. Database (SQLite by default)

No Docker required. `Server/.env` uses `DATABASE_URL=file:./dev.db`.

```bash
cd Server
npm install
npx prisma db push
npm run prisma:seed
npm run start:dev
```

### 2. AI service

```bash
cd ai
# activate .venv if present, then:
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional: set `OPENAI_API_KEY` in `ai/.env`. Without it, chat uses offline catalog fallback.

Ingest catalog:

```bash
curl -X POST http://127.0.0.1:8000/ingest -H "Content-Type: application/json" -d "{\"force\":true}"
```

### 3. Client

```bash
cd Client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Client falls back to local catalog if the API is offline.

## Seed users

- `admin@nova.audio` / `Admin123!`
- `demo@nova.audio` / `Demo123!`

## Postgres (optional)

```bash
cd Server
docker compose up -d
# set DATABASE_URL to postgresql://postgres:postgres@localhost:5432/interactive_product_showcase
# update prisma schema provider to postgresql, then:
npx prisma db push
npm run prisma:seed
```

## GLB assets

Place models in `Client/public/models/` (see README there). Until then, procedural R3F meshes are used.
