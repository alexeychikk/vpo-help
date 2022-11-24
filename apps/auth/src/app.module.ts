import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthModule,
  EnvModule,
  LoggerModule,
  ModelModule,
} from '@vpo-help/server';
import { AuthController } from './controllers';
import { JwtAuthGuard } from './guards';
import { AuthService, JwtStrategy } from './services';
import { EnvService } from './services/env.service';

@Module({
  imports: [
    EnvModule.register(EnvService),
    LoggerModule,
    ModelModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule.register(EnvService)],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: '24d' },
      }),
    }),
    AuthModule,
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AppModule {}
