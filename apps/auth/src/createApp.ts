import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import helmet from 'fastify-helmet';
import { ClassValidationPipe, LoggerService } from '@vpo-help/server';
import { AppModule } from './app.module';
import type { EnvService } from './services';

export async function createApp({ env }: { env: EnvService }) {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: true, logger: false },
  );

  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.enableCors({ origin: env.CORS_ORIGIN });
  await app.register(helmet, { contentSecurityPolicy: false });
  app.useGlobalPipes(new ClassValidationPipe());

  return app;
}
