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
  MinDate,
} from 'class-validator';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoReferenceNumber } from './isVpoReferenceNumber.decorator';
import { ReceivedGoodsDto } from './receivedGoods.dto';
import { VpoUserModel } from './vpoUser.model';

export class VpoModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @MinDate(new Date(`2022-01-01`))
  vpoIssueDate!: Date;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @Length(1, 50)
  firstName!: string;

  @Length(1, 50)
  lastName!: string;

  @Length(1, 50)
  middleName!: string;

  @IsDate()
  dateOfBirth!: Date;

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
  @IsOptional()
  numberOfRelativesBelow16 = 0;

  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  numberOfRelativesAbove65 = 0;

  @IsDate()
  scheduleDate!: Date;

  @IsDate()
  @IsOptional()
  receivedHelpDate?: Date;

  @IsObject()
  @IsOptional()
  receivedGoods?: ReceivedGoodsDto;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  toVpoUserModel(): VpoUserModel<string> {
    return new VpoUserModel({
      id: this.id?.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: Role.Vpo,
      scheduleDate: this.scheduleDate,
      vpoReferenceNumber: this.vpoReferenceNumber,
    });
  }

  constructor(data: ModelConstructorData<VpoModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
