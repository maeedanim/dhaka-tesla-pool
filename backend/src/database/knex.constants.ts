/**
 * knex.constants.ts — Injection token for the Knex database instance.
 *
 * Why a Symbol instead of a string?
 *   Strings can collide accidentally — if two modules both use
 *   provide: 'DATABASE_CONNECTION', Nest silently overwrites one.
 *   Symbol('KNEX_CONNECTION') is guaranteed unique. Even if another
 *   module creates Symbol('KNEX_CONNECTION'), they won't be ===.
 *
 * Usage in services/repositories:
 *   @Inject(KNEX_CONNECTION) private readonly knex: Knex
 *
 * This is Nest's Dependency Inversion in action: the service
 * depends on an abstract token, and the KnexModule provides
 * the concrete implementation. The service never imports knex()
 * or reads process.env directly.
 */

export const KNEX_CONNECTION = Symbol('KNEX_CONNECTION');