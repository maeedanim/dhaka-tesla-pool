/**
 * knexfile.ts — Knex CLI configuration for migrations and seeds.
 *
 * This file is read by the Knex CLI when you run commands like:
 *   npm run db:migrate        (knex migrate:latest)
 *   npm run db:migrate:rollback
 *   npm run db:seed           (knex seed:run)
 *
 * Why does this import from configuration.ts instead of reading
 * process.env directly?
 *   → DRY. The database connection details are defined once in
 *     configuration.ts and used in two places:
 *       1. Here — for Knex CLI commands (migrations, seeds)
 *       2. knex.module.ts — for the running NestJS application
 *     If we hardcoded DB config here separately, we'd have two
 *     copies that could drift out of sync.
 *
 * Note: This file is at the project root (not inside src/) because
 * the Knex CLI expects to find it at the top level by default.
 * The --knexfile flag in package.json scripts explicitly points here.
 *
 * Environment-specific configs:
 *   Currently only 'development' is defined. In production, you'd
 *   add a 'production' key with SSL, tighter pool settings, etc.
 *   Knex picks the config matching NODE_ENV, or you pass --env.
 */

import type { Knex } from 'knex';

/**
 * Import the shared configuration factory.
 * The .js extension is required because we're using ESM modules
 * (the "type": "module" in package.json), and TypeScript's NodeNext
 * module resolution requires explicit extensions.
 */
import configuration from './src/config/configuration.js';

/** Call the factory to get the resolved config object. */
const config = configuration();

const knexConfig: Record<string, Knex.Config> = {
  development: {
    /** PostgreSQL driver via the 'pg' (node-postgres) package. */
    client: 'pg',

    connection: {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
    },

    pool: {
      min: config.database.pool.min,
      max: config.database.pool.max,
    },

    /**
     * Directory where migration files live.
     * Migrations are version-controlled SQL schema changes that
     * can be applied forward (migrate:latest) or rolled back
     * (migrate:rollback). They're the backbone of reproducible
     * database setup — anyone cloning the repo can run migrations
     * and get the exact same schema.
     */
    migrations: {
      directory: './src/database/migrations',
    },

    /**
     * Directory where seed files live.
     * Seeds populate the database with test/demo data
     * (Jashim, Bullet, Nusrat, Rafiq, Shirin).
     * Unlike migrations, seeds are idempotent and re-runnable.
     */
    seeds: {
      directory: './src/database/seeds',
    },
  },
};

export default knexConfig;