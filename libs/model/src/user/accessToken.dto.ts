import { IsString } from 'class-validator';
import type { Optional } from 'utility-types';

export class AccessTokenDto {
  @IsString()
  access_token!: string;

  constructor(data: Optional<AccessTokenDto>) {
    Object.assign(this, data);
  }
}
