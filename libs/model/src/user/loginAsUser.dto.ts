import { IsEmail, Length } from 'class-validator';

export class LoginAsUserDto {
  @IsEmail()
  email!: string;

  @Length(5, 20)
  password!: string;

  constructor(data: LoginAsUserDto) {
    Object.assign(this, data);
  }
}
