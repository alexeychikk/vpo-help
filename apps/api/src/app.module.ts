import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule, LoggerModule, ModelModule } from '@vpo-help/server';
import { AuthController, UserController } from './controllers';
import { JwtAuthGuard } from './guards';
import { AuthService, EnvService, JwtStrategy } from './services';

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
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController, UserController],
})
export class AppModule {}
