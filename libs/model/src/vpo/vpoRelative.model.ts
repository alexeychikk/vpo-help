import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { IsTaxIdNumber } from './decorators';
import { VpoBaseModel } from './vpoBase.model';

export class VpoRelativeModel<
  Id extends IdType = IdType,
> extends VpoBaseModel<Id> {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsTaxIdNumber()
  @IsOptional()
  taxIdNumber?: string;

  constructor(data: ModelConstructorData<VpoRelativeModel<Id>>) {
    super(data);
  }
}
