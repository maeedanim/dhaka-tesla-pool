/**
 * health.controller.ts — Simple health check endpoint.
 *
 * Purpose: Provides a GET /api/health endpoint that verifies
 * both the API process and the database connection are alive.
 *
 * Why a separate controller instead of putting this in AppModule?
 *   → Health checks are an infrastructure concern, not business logic.
 *     Keeping it in its own file makes it easy to find and extend
 *     (e.g. adding Redis or external API health checks later).
 *     (Single Responsibility — this controller does exactly one thing.)
 *
 * The response shape is typed via the HealthResponse interface,
 * so TypeScript catches any drift between what we promise and
 * what we return.
 */

import { Controller, Get, Inject } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX_CONNECTION } from './database/knex.constants.js';

/**
 * Typed response for the health endpoint.
 * Using an interface (not `any`) ensures the controller always
 * returns the exact shape monitoring tools expect.
 */
interface HealthResponse {
  status: 'ok';
  service: 'dhaka-tesla-pool-api';
  database: 'connected';
}

@Controller('health')
export class HealthController {
  /**
   * Constructor injection — Nest's DI container resolves the
   * KNEX_CONNECTION token and passes the live Knex instance here.
   *
   * We use @Inject(KNEX_CONNECTION) because KNEX_CONNECTION is a
   * Symbol token (not a class), so Nest can't infer it from the type alone.
   * This is the Dependency Inversion principle: the controller depends on
   * an abstract token, not a concrete Knex import.
   */
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  /**
   * GET /api/health
   *
   * Runs a trivial query (SELECT 1) to prove the database connection
   * is alive. If the query fails, NestJS's default exception handling
   * returns a 500. If it succeeds, we return the typed HealthResponse.
   *
   * This endpoint is intentionally NOT behind authentication —
   * load balancers and monitoring tools need to hit it without a token.
   */
  @Get()
  async getHealth(): Promise<HealthResponse> {
    // Smoke-test the database connection — if this throws,
    // the global exception filter will return a 500 automatically.
    await this.knex.raw('SELECT 1');

    return {
      status: 'ok',
      service: 'dhaka-tesla-pool-api',
      database: 'connected',
    };
  }
}