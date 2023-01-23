import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { EmailHolderDto, LoginAsUserDto, LoginAsVpoDto } from '@vpo-help/model';
import {
  AuthService,
  EmailService,
  VerificationService,
} from '@vpo-help/server';
import { EnvService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
    private readonly emailService: EmailService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async loginAsUser(@Body() dto: LoginAsUserDto) {
    return this.authService.loginAsUser(dto);
  }

  @Post('login/vpo')
  @HttpCode(200)
  async loginAsVpo(@Body() dto: LoginAsVpoDto) {
    return this.authService.loginAsVpo(dto);
  }

  @Post('send-vpo-verification')
  @HttpCode(200)
  async sendVpoVerification(@Body() dto: EmailHolderDto) {
    if (!this.envService.EMAIL_VERIFICATION_ENABLED) {
      throw new NotFoundException();
    }

    const { verificationCode } =
      await this.verificationService.createVerificationCodeByEmail(dto);
    await this.emailService.sendVpoVerification({
      email: dto.email,
      verificationCode,
    });
  }
}
