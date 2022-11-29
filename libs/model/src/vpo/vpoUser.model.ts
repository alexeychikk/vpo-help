import { IsDate, IsEnum } from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoReferenceNumber } from './isVpoReferenceNumber.decorator';

export class VpoUserModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsEnum(Role)
  role!: Role;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @IsDate()
  scheduleDate!: Date;

  constructor(data: ModelConstructorData<VpoUserModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
