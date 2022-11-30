import { Global, Logger, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import type { EnvBaseService } from '../env';
import { EnvModule } from '../env';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [EnvModule.ENV_SERVICE_PROVIDER_NAME],
      useFactory: (env: EnvBaseService) => ({
        // fixes https://github.com/iamolegga/nestjs-pino/issues/253#issuecomment-695090696
        forRoutes: ['(.*)'],
        pinoHttp: {
          formatters: { level: (label: string) => ({ level: label }) },
          level: env.IS_DEV ? 'trace' : env.IS_TEST ? 'warn' : 'info',
          mixin: () => ({
            hostname: env.NAME,
            v: env.IS_DEV ? undefined : env.VERSION,
          }),
          messageKey: 'message',
          prettyPrint: env.IS_DEV
            ? { colorize: true, translateTime: 'yyyy-MM-dd HH:mm:ss.l' }
            : undefined,
          redact: {
            paths: [
              'req.id',
              'req.headers.accept',
              'req.headers["accept-encoding"]',
              'req.headers.authorization',
              'req.headers["cache-control"]',
              'req.headers.cookie',
              'req.headers.connection',
              'req.headers["content-length"]',
              'req.headers["content-type"]',
              env.IS_DEV ? 'req.headers.host' : null,
              'req.headers["postman-token"]',
              env.IS_DEV ? 'req.headers["user-agent"]' : null,
              'req.headers["x-request-id"]',
              'req.headers["x-real-ip"]',
              'req.headers["x-forwarded-for"]',
              'req.headers["x-geoip-build-timestamp"]',
              'req.headers["x-geoip-continent-code"]',
              'req.headers["x-geoip-continent-name"]',
              'req.headers["x-geoip-country-code"]',
              'req.headers["x-geoip-country-name"]',
              'req.headers["x-geoip-location-latitude"]',
              'req.headers["x-geoip-location-longitude"]',
              'req.headers["x-geoip-location-timezone"]',
              'req.headers["x-sub-authorization"]',
              env.IS_DEV ? 'req.remoteAddress' : null,
              env.IS_DEV ? 'req.remotePort' : null,
              'res.headers',
            ].filter(Boolean),
            remove: true,
          },
        },
      }),
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
