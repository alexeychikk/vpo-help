import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { EnvService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'health' })
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly envService: EnvService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async healthCheck() {
    return this.healthCheckService.check([
      () =>
        this.typeOrmHealthIndicator.pingCheck('database', { timeout: 3000 }),
      () =>
        this.memoryHealthIndicator.checkRSS(
          'memory',
          this.envService.MEMORY_LIMIT,
        ),
    ]);
  }
}
