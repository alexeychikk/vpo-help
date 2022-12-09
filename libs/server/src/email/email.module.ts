import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import type { EnvBaseService } from '../env';
import { EnvModule } from '../env';
import { EmailService } from './services';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvModule.ENV_SERVICE_PROVIDER_NAME],
      useFactory: (env: EnvBaseService) => ({
        transport: env.SMTP_TRANSPORT,
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
