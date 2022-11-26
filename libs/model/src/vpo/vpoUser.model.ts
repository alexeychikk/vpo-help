import { IsDate, IsEnum } from 'class-validator';
import type { Optional } from 'utility-types';
import type { IdType } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoReferenceNumber } from './isVpoReferenceNumber.decorator';

export class VpoUserModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsEnum(Role)
  role!: Role;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @IsDate()
  scheduleDate!: Date;

  constructor(data: Optional<VpoUserModel<Id>, keyof BaseModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
