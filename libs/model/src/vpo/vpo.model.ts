import {
  IsDate,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  Length,
  Max,
  Min,
} from 'class-validator';
import type { Optional } from 'utility-types';
import type { IdType } from '../common';
import { BaseModel } from '../common';
import { IsVpoReferenceNumber } from './isVpoReferenceNumber.decorator';
import { ReceivedGoodsDto } from './receivedGoods.dto';

export class VpoModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @Length(1, 50)
  firstName!: string;

  @Length(1, 50)
  lastName!: string;

  @Length(1, 50)
  middleName!: string;

  @IsDate()
  dateOfBirth!: Date;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @Length(1, 200)
  addressOfRegistration!: string;

  @Length(1, 200)
  addressOfResidence!: string;

  @IsInt()
  @Min(0)
  @Max(50)
  numberOfRelatives!: number;

  @IsInt()
  @Min(0)
  @Max(50)
  numberOfRelativesBelow16!: number;

  @IsInt()
  @Min(0)
  @Max(50)
  numberOfRelativesAbove65!: number;

  @IsDate()
  scheduleDate!: Date;

  @IsObject()
  @IsOptional()
  receivedGoods?: ReceivedGoodsDto;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  constructor(data: Optional<VpoModel<Id>, keyof BaseModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
