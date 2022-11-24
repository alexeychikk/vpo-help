import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import type { Class } from 'utility-types';
import type { EnvBaseService } from './envBase.service';

@Module({})
export class EnvModule {
  static ENV_SERVICE_PROVIDER_NAME = 'EnvService';
  static register<S extends EnvBaseService>(service: Class<S>): DynamicModule {
    const envProvider = {
      provide: EnvModule.ENV_SERVICE_PROVIDER_NAME,
      useExisting: service,
    };

    return {
      global: true,
      module: EnvModule,
      providers: [service, envProvider],
      exports: [service, envProvider],
    };
  }
}
