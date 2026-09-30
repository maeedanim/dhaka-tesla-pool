/**
 * main.ts — NestJS application entrypoint.
 *
 * This file bootstraps the entire backend. Every global concern
 * (validation, CORS, URL prefix) is registered here once, so
 * individual controllers and modules never need to worry about them.
 *
 * Why register things globally here instead of per-module?
 *   - ValidationPipe: one pipe validates ALL incoming DTOs.
 *     We don't wire validators per-route. (DRY)
 *   - CORS: one origin allowlist, one place to change it.
 *   - Global prefix 'api': every route becomes /api/...,
 *     so the frontend can proxy or distinguish API calls easily.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /**
   * Global URL prefix — every route is now /api/health, /api/auth/login, etc.
   * This keeps API routes cleanly separated from any static-file or
   * frontend-proxy routes that might share the same domain in production.
   */
  app.setGlobalPrefix('api');

  /**
   * CORS (Cross-Origin Resource Sharing)
   * ---
   * The Next.js dev server runs on port 3000, but the NestJS API runs
   * on port 5000. Browsers block cross-origin requests by default.
   * Enabling CORS here lets the frontend fetch from the API.
   *
   * `credentials: true` allows the browser to send cookies/auth headers.
   *
   * In production, you'd restrict `origin` to your actual domain
   * instead of allowing localhost.
   */
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  /**
   * Global ValidationPipe — the single most important line for input safety.
   * ---
   * `whitelist: true`
   *    → Strips any properties from the request body that are NOT
   *      decorated in the DTO class. If a client sends { name: "X", isAdmin: true }
   *      but the DTO only has @IsString() name, the `isAdmin` field is silently removed.
   *
   * `forbidNonWhitelisted: true`
   *    → Instead of silently stripping unknown fields, throw a 400 error.
   *      This makes the API strict: the client knows immediately if they sent
   *      a field the server doesn't expect. Catches typos and injection attempts.
   *
   * `transform: true`
   *    → Automatically transforms plain JSON objects into DTO class instances.
   *      This is needed for class-validator decorators to work, and it also
   *      coerces types (e.g. query param "5" → number 5 when @Type(() => Number)).
   *
   * Why here and not per-route?
   *    Nest's global pipe runs on EVERY endpoint. We never forget to validate.
   *    Individual routes can still add extra pipes if needed, but the baseline
   *    is always enforced. (KISS — one config, consistent behavior everywhere.)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Start listening on the configured port (default: 5000).
   * The port comes from the environment variable, making it easy
   * to change per-environment without touching code.
   */
  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  console.log(`🚀 Dhaka Tesla Pool API running on http://localhost:${port}/api`);
}

void bootstrap();