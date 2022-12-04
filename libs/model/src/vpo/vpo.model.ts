import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  Length,
  Max,
  Min,
} from 'class-validator';
import { IsNestedArray } from '@vpo-help/utils';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoIssueDate, IsVpoReferenceNumber } from './decorators';
import { ReceivedHelpDto } from './receivedHelp.dto';
import { VpoUserModel } from './vpoUser.model';

export class VpoModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsVpoIssueDate()
  vpoIssueDate!: Date;

  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  @Length(1, 50)
  firstName!: string;

  @Length(1, 50)
  lastName!: string;

  @Length(1, 50)
  middleName!: string;

  @IsPhoneNumber()
  phoneNumber!: string;

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

  @IsNestedArray(() => ReceivedHelpDto)
  @IsOptional()
  receivedGoods?: ReceivedHelpDto[];

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
