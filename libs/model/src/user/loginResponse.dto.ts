import type { Optional } from 'utility-types';
import { IsNestedObject } from '@vpo-help/utils';
import { AccessTokenDto } from './accessToken.dto';
import { UserModel } from './user.model';

export class LoginResponseDto {
  @IsNestedObject(() => UserModel)
  user!: UserModel<string>;

  @IsNestedObject(() => AccessTokenDto)
  accessToken!: AccessTokenDto;

  constructor(data: Optional<LoginResponseDto>) {
    Object.assign(this, data);
  }
}
