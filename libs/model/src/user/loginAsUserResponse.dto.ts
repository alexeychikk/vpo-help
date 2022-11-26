import { IsObject } from 'class-validator';
import type { Optional } from 'utility-types';
import { IsNestedObject } from '@vpo-help/utils';
import { AccessTokenDto, PermissionMap } from '../common';
import { UserModel } from './user.model';

export class LoginAsUserResponseDto {
  @IsNestedObject(() => UserModel)
  user!: UserModel<string>;

  @IsObject()
  permissions!: PermissionMap;

  @IsNestedObject(() => AccessTokenDto)
  accessToken!: AccessTokenDto;

  constructor(data: Optional<LoginAsUserResponseDto>) {
    Object.assign(this, data);
  }
}
