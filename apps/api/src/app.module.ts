import { Module } from '@nestjs/common';
import {
  AuthModule,
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
import { EnvService } from './services';

@Module({
  imports: [
    EnvModule.register(EnvService),
    LoggerModule,
    ModelModule,
    AuthModule,
  ],
  controllers: [
    AuthController,
    HtmlController,
    ScheduleController,
    SettingsController,
    VpoController,
  ],
})
export class AppModule {}
