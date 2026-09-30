/**
 * knex.module.ts — Global NestJS module that provides a Knex instance.
 *
 * This module creates a single Knex connection pool and exports it
 * under the KNEX_CONNECTION injection token. Because it's decorated
 * with @Global(), any module in the app can inject the Knex instance
 * without explicitly importing KnexModule — it's available everywhere.
 *
 * Architecture reasoning:
 *   - We're using Knex.js instead of TypeORM or Prisma because the
 *     assignment requires understanding the actual SQL (especially for
 *     the seat-reservation transaction and fare aggregation). Knex gives
 *     us a thin query builder on top of raw SQL, so we see what's
 *     happening without an ORM's abstraction layer hiding the queries.
 *
 *   - The KNEX_CONNECTION token is a Symbol (not a string), which
 *     prevents accidental collisions with other providers. This is
 *     a Nest best practice for custom injection tokens.
 *
 *   - The useFactory pattern lets us inject ConfigService to read
 *     database config from the centralized configuration.ts.
 *     (Dependency Inversion — this module depends on ConfigService's
 *     abstract interface, not on process.env directly.)
 *
 * Connection pool:
 *   Knex maintains a pool of persistent PostgreSQL connections.
 *   When a service runs a query, it borrows a connection from the pool,
 *   executes the query, and returns the connection. This avoids the
 *   overhead of opening/closing a TCP connection per query.
 *   pool.min keeps connections warm; pool.max caps concurrent usage.
 */

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import { KNEX_CONNECTION } from './knex.constants.js';

@Global()
@Module({
  providers: [
    {
      /**
       * The injection token — services @Inject(KNEX_CONNECTION) to get
       * the live Knex instance. Using a Symbol here is Nest's recommended
       * approach for non-class tokens.
       */
      provide: KNEX_CONNECTION,

      /**
       * inject: [ConfigService] tells Nest's DI container to resolve
       * ConfigService and pass it as the first argument to useFactory.
       * This is constructor injection for factory providers.
       */
      inject: [ConfigService],

      /**
       * useFactory creates and returns the Knex instance.
       * This runs once at application startup (singleton scope by default).
       * Every subsequent @Inject(KNEX_CONNECTION) gets the same instance.
       */
      useFactory: (configService: ConfigService): Knex => {
        return knex({
          /** 'pg' = the PostgreSQL driver (node-postgres / pg package). */
          client: 'pg',

          connection: {
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            database: configService.get<string>('database.name'),
            user: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
          },

          pool: {
            min: configService.get<number>('database.pool.min') ?? 2,
            max: configService.get<number>('database.pool.max') ?? 10,
          },
        });
      },
    },
  ],

  /**
   * exports: [KNEX_CONNECTION] makes the Knex instance available
   * to any module that imports KnexModule. Because this module is
   * @Global(), that means every module in the app can inject it
   * without an explicit import.
   */
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}