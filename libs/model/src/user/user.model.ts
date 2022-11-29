import { IsEmail, IsEnum } from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';

export class UserModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;

  constructor(data: ModelConstructorData<UserModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
