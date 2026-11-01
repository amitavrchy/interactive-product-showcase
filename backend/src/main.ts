import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const origins = (config.get<string>('CLIENT_ORIGIN') ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const local of [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ]) {
    if (!origins.includes(local)) origins.push(local);
  }

  app.enableCors({ origin: origins, credentials: true });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (/^\/(auth|orders|payments|configs)(\/|$)/.test(req.path)) {
      res.setHeader('Cache-Control', 'private, no-store');
    }
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      req.headers.origin &&
      !origins.includes(req.headers.origin)
    ) {
      res.status(403).json({ message: 'This request origin is not permitted.' });
      return;
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = config.get<number>('PORT') ?? 4000;
  const host = config.get<string>('HOST') ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`NOVA API listening on http://${host}:${port}`);
}
await bootstrap();