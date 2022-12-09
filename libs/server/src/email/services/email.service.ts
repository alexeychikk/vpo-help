import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import type { VerificationCodeDto } from '@vpo-help/model';
import { minimize } from '@vpo-help/utils';
import { validateEntity } from '../../utils';
import { MailOptionsDto } from '../entities';
import type { EmailTemplate } from '../templates';
import { VpoVerificationTemplate } from '../templates';

@Injectable()
export class EmailService {
  constructor(readonly mailerService: MailerService) {}

  async sendVpoVerification(options: VerificationCodeDto) {
    const template = new VpoVerificationTemplate({
      verificationCode: options.verificationCode,
      to: options.email,
    });
    return this.sendByTemplate(template);
  }

  protected async sendByTemplate<T extends EmailTemplate>(template: T) {
    const renderResult = template.render();
    const templateDefaults: Partial<MailOptionsDto> = {
      from: template.from || `"ЦЕНТР ДОПОМОГИ ВПО" <vpo@happyold.com.ua>`,
      to: template.to,
      subject: template.subject,
    };
    const mailOptions: Partial<MailOptionsDto> = Object.assign(
      templateDefaults,
      typeof renderResult === 'string' ? { html: renderResult } : renderResult,
    );
    mailOptions.html = minimize(mailOptions.html || '');

    const dto = await validateEntity(MailOptionsDto, mailOptions);
    await this.mailerService.sendMail(dto);
  }
}
