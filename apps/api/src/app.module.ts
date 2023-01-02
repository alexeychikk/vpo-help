import 'reflect-metadata';

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {
  AuthModule,
  EmailModule,
  EnvModule,
  LoggerModule,
  ModelModule,
} from '@vpo-help/server';
import {
  AuthController,
  HealthController,
  HtmlController,
  ScheduleController,
  SettingsController,
  VpoController,
} from './controllers';
import { EnvService, ShutdownService } from './services';

@Module({
  imports: [
    EnvModule.register(EnvService),
    LoggerModule,
    ModelModule,
    EmailModule,
    AuthModule,
    TerminusModule,
  ],
  providers: [ShutdownService],
  controllers: [
    AuthController,
    HealthController,
    HtmlController,
    ScheduleController,
    SettingsController,
    VpoController,
  ],
})
export class AppModule {}
