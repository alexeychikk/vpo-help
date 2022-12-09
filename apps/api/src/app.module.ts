import 'reflect-metadata';

import { Module } from '@nestjs/common';
import {
  AuthModule,
  EmailModule,
  EnvModule,
  LoggerModule,
  ModelModule,
} from '@vpo-help/server';
import {
  AuthController,
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
  ],
  providers: [ShutdownService],
  controllers: [
    AuthController,
    HtmlController,
    ScheduleController,
    SettingsController,
    VpoController,
  ],
})
export class AppModule {}
