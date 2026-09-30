import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: 'ok';
  service: 'dhaka-tesla-pool-api';
}

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'dhaka-tesla-pool-api',
    };
  }
}