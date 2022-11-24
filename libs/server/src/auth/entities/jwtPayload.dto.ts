import { IsEmail, IsMongoId } from 'class-validator';
import type { Optional } from 'utility-types';

export class JwtPayload {
  @IsMongoId()
  sub!: string;

  @IsEmail()
  email!: string;

  constructor(data: Optional<JwtPayload>) {
    Object.assign(this, data);
  }
}
