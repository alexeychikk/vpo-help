import { IsObject } from 'class-validator';
import type { Optional } from 'utility-types';
import { IsNestedObject } from '@vpo-help/utils';
import { AccessTokenDto, PermissionMap } from '../common';
import { VpoUserModel } from './vpoUser.model';

export class LoginAsVpoResponseDto {
  @IsNestedObject(() => VpoUserModel)
  user!: VpoUserModel<string>;

  @IsObject()
  permissions!: PermissionMap;

  @IsNestedObject(() => AccessTokenDto)
  accessToken!: AccessTokenDto;

  constructor(data: Optional<LoginAsVpoResponseDto>) {
    Object.assign(this, data);
  }
}
