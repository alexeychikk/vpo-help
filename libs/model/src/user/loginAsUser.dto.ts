import { IsEmail, Length } from 'class-validator';
import type { Optional } from 'utility-types';

export class LoginAsUserDto {
  @IsEmail()
  email!: string;

  @Length(5, 20)
  password!: string;

  constructor(data: Optional<LoginAsUserDto>) {
    Object.assign(this, data);
  }
}
