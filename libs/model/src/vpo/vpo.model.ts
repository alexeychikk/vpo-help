import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  Max,
  Min,
} from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { IsTaxIdNumber } from './decorators';
import { VpoBaseModel } from './vpoBase.model';

export class VpoModel<Id extends IdType = IdType> extends VpoBaseModel<Id> {
  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phoneNumber!: string;

  @IsTaxIdNumber()
  taxIdNumber!: string;

  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  numberOfRelatives?: number;

  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  numberOfRelativesBelow16?: number;

  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  numberOfRelativesAbove65?: number;

  constructor(data: ModelConstructorData<VpoModel<Id>>) {
    super(data);
  }
}
