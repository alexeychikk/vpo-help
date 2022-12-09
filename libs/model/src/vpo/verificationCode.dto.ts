import { IsEmail, Length } from 'class-validator';

export class VerificationCodeDto {
  @IsEmail()
  email!: string;

  @Length(6, 6)
  verificationCode!: string;

  constructor(data: VerificationCodeDto) {
    Object.assign(this, data);
  }
}
