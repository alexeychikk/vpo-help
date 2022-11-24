import { IsEmail } from 'class-validator';
import type { Optional } from 'utility-types';

export class LoginDto {
  @IsEmail()
  email!: string;

  constructor(data: Optional<LoginDto>) {
    Object.assign(this, data);
  }
}
