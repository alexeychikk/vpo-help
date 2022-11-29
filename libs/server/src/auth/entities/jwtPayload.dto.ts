import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsObject,
  IsOptional,
} from 'class-validator';
import type { Optional } from 'utility-types';
import { IsVpoReferenceNumber, PermissionMap, Role } from '@vpo-help/model';

export class JwtPayload {
  @IsMongoId()
  sub!: string;

  @IsEnum(Role)
  role!: Role;

  @IsObject()
  permissions!: PermissionMap;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsVpoReferenceNumber()
  @IsOptional()
  vpoReferenceNumber?: string;

  constructor(data: Optional<JwtPayload>) {
    Object.assign(this, data);
  }
}
