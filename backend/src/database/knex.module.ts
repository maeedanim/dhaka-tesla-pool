import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import { KNEX_CONNECTION } from './/knex.constants.js';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Knex => {
        return knex({
          client: 'pg',
          connection: {
            host: configService.getOrThrow<string>('database.host'),
            port: configService.getOrThrow<number>('database.port'),
            database: configService.getOrThrow<string>('database.name'),
            user: configService.getOrThrow<string>('database.user'),
            password: configService.getOrThrow<string>('database.password'),
          },
          pool: {
            min: configService.getOrThrow<number>('database.pool.min'),
            max: configService.getOrThrow<number>('database.pool.max'),
          },
        });
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}