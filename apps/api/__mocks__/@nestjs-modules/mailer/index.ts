import { Injectable, Module } from '@nestjs/common';

@Module({})
export class MailerModule {
  static forRootAsync() {
    return {
      global: true,
      module: MailerModule,
      providers: [MailerService],
      exports: [MailerService],
    };
  }
}

@Injectable()
export class MailerService {
  sendMail = jest.fn();
}
