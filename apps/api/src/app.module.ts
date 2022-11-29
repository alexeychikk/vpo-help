import { Module } from '@nestjs/common';
import {
  AuthModule,
  EnvModule,
  LoggerModule,
  ModelModule,
} from '@vpo-help/server';
import { AuthController, VpoController } from './controllers';
import { EnvService } from './services';

@Module({
  imports: [
    EnvModule.register(EnvService),
    LoggerModule,
    ModelModule,
    AuthModule,
  ],
  controllers: [AuthController, VpoController],
})
export class AppModule {}
