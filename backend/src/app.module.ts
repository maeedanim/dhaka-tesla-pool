/**
 * app.module.ts — Root module of the NestJS application.
 *
 * This is the "composition root" — the single place where all
 * feature modules, global config, and infrastructure are wired together.
 *
 * NestJS uses a module tree: AppModule imports sub-modules (AuthModule,
 * TeslasModule, etc.), and each sub-module declares its own controllers,
 * services, and repositories. This is the Nest equivalent of Express's
 * "mount routers on the app" pattern, but with dependency injection
 * built in.
 *
 * Why organize by feature (AuthModule, TeslasModule) instead of by layer
 * (controllers/, services/, repositories/)?
 *   → Each module is a self-contained vertical slice. When you open
 *     the `teslas/` folder, everything about Teslas is right there:
 *     controller, service, repository, DTOs. You don't have to jump
 *     between three top-level folders to understand one feature.
 *     This is the same reasoning behind NestJS's official style guide,
 *     and it scales better as the app grows. (Single Responsibility at
 *     the module level — each module owns one domain concept.)
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { KnexModule } from './database/knex.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [
    /**
     * ConfigModule.forRoot() — loads environment variables into a
     * typed configuration object. `isGlobal: true` makes ConfigService
     * available in every module without re-importing ConfigModule.
     *
     * `load: [configuration]` tells Nest to use our custom
     * configuration factory (src/config/configuration.ts) instead of
     * just raw process.env. This gives us typed, nested access:
     *   configService.get<string>('database.host')
     * instead of the fragile:
     *   process.env.DB_HOST
     */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    /**
     * KnexModule — our custom global module that creates a Knex
     * instance and exposes it via the KNEX_CONNECTION injection token.
     * Any service/repository can @Inject(KNEX_CONNECTION) to get
     * a fully-configured Knex instance connected to PostgreSQL.
     *
     * This is Nest's Dependency Inversion principle in action:
     * services depend on an abstract token, not a concrete import.
     * We can swap the DB layer (e.g. for tests) by providing a
     * different value for the same token.
     */
    KnexModule,
  ],

  /**
   * HealthController is registered at the root level because it
   * doesn't belong to any specific domain module — it's an
   * infrastructure concern (ops/monitoring), not business logic.
   */
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}