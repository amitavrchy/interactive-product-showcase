# NOVA Audio API

NestJS API for the catalog, accounts, orders, payments, and saved configurations. Setup, environment variables, and deploy notes are in the [repository README](../README.md).

```bash
cp .env.example .env
npm install
npx prisma generate
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

The API listens on port 4000. PostgreSQL must be reachable at `DATABASE_URL` before the process will finish booting.
