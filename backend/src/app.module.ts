import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './/config/configuration.js';
import { KnexModule } from './/database/knex.module.js';
import { HealthController } from './/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    KnexModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}