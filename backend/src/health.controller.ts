import { Controller, Get, Inject } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX_CONNECTION } from './database/knex.constants.js';

interface HealthResponse {
  status: 'ok';
  service: 'dhaka-tesla-pool-api';
  database: 'connected';
}

@Controller('health')
export class HealthController {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly db: Knex,
  ) {}

  @Get()
  async getHealth(): Promise<HealthResponse> {
    await this.db.raw('SELECT 1');

    return {
      status: 'ok',
      service: 'dhaka-tesla-pool-api',
      database: 'connected',
    };
  }
}