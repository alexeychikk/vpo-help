import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { EnvBaseService } from '../env';
import { EnvModule } from '../env';
import { LoggerModule } from '../logger';
import { JwtAuthGuard } from './guards';
import { AuthService, JwtStrategy, PasswordService } from './services';

@Module({
  imports: [
    LoggerModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvModule.ENV_SERVICE_PROVIDER_NAME],
      useFactory: (env: EnvBaseService) => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: '24d' },
      }),
    }),
  ],
  providers: [PasswordService, AuthService, JwtStrategy, JwtAuthGuard],
  exports: [PasswordService, AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
