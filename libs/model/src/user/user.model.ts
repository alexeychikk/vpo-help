import { IsEmail, IsEnum } from 'class-validator';
import type { Optional } from 'utility-types';
import type { IdType } from '../common';
import { BaseModel, Role } from '../common';

export class UserModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;

  constructor(data: Optional<UserModel<Id>, keyof BaseModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
