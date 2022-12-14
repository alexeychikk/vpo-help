import { IsDate, IsEnum, IsOptional } from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoReferenceNumber } from './decorators';

export class VpoUserModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsEnum(Role)
  role!: Role;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @IsDate()
  scheduleDate!: Date;

  @IsDate()
  @IsOptional()
  receivedHelpDate?: Date;

  constructor(data: ModelConstructorData<VpoUserModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
