/**
 * configuration.ts — Typed application configuration factory.
 *
 * NestJS's ConfigModule calls this function at startup and caches
 * the result. Every service in the app can then access config values
 * via ConfigService.get<T>('key.path') with type safety.
 *
 * Why a factory function instead of reading process.env directly?
 *   1. Centralized defaults — if DB_HOST isn't set, it defaults to
 *      'localhost' HERE, not scattered across 10 files.
 *   2. Type coercion — process.env values are always strings.
 *      We parseInt()/Number() them once here, so downstream code
 *      gets real numbers, not "5432"-the-string. (DRY)
 *   3. Nested access — configService.get('database.host') is more
 *      readable and refactor-safe than process.env.DB_HOST.
 *   4. Testability — in tests, you can override ConfigService to
 *      return test values without touching real env vars.
 *
 * The knexfile.ts also imports this factory for Knex CLI commands
 * (migrations, seeds), so the DB config is defined once and used
 * in two places. (DRY — single source of truth for config.)
 */

export default () => ({
  /** Current environment: 'development', 'production', or 'test'. */
  nodeEnv: process.env.NODE_ENV ?? 'development',

  /** Port the NestJS HTTP server listens on. */
  port: Number(process.env.PORT ?? 5000),

  database: {
    /** PostgreSQL hostname — 'localhost' for dev, 'postgres' inside Docker Compose. */
    host: process.env.DB_HOST ?? 'localhost',
    /** PostgreSQL port — default 5432, mapped in docker-compose.yml. */
    port: Number(process.env.DB_PORT ?? 5432),
    /** Database name. Created automatically by the Postgres container. */
    name: process.env.DB_NAME ?? 'dhaka_tesla_pool',
    /** Database user. Matches POSTGRES_USER in docker-compose.yml. */
    user: process.env.DB_USER ?? 'postgres',
    /** Database password. Matches POSTGRES_PASSWORD in docker-compose.yml. */
    password: process.env.DB_PASSWORD ?? 'postgres',

    pool: {
      /**
       * Connection pool sizing.
       * min=2 keeps two connections warm to avoid cold-start latency.
       * max=10 is generous for a dev/MVP workload; in production you'd
       * tune this based on expected concurrency and pgBouncer.
       */
      min: Number(process.env.DB_POOL_MIN ?? 2),
      max: Number(process.env.DB_POOL_MAX ?? 10),
    },
  },

  jwt: {
    /**
     * JWT signing secret — MUST be a long, random string in production.
     * The empty-string default will cause auth to fail loudly if the
     * env var is missing, which is intentional (fail-fast).
     */
    secret: process.env.JWT_SECRET ?? '',
    /** Token expiry — '1d' = 24 hours. Adjust per security requirements. */
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});