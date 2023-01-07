import { IsDate, IsOptional, Length } from 'class-validator';
import { IsNestedArray } from '@vpo-help/utils';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel, Role } from '../common';
import { IsVpoIssueDate, IsVpoReferenceNumber } from './decorators';
import { ReceivedHelpDto } from './receivedHelp.dto';
import { VpoUserModel } from './vpoUser.model';

export class VpoBaseModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsVpoReferenceNumber()
  @IsOptional()
  mainVpoReferenceNumber?: string;

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

  @IsDate()
  dateOfBirth!: Date;

  @Length(1, 200)
  addressOfRegistration!: string;

  @Length(1, 200)
  addressOfResidence!: string;

  @IsDate()
  scheduleDate!: Date;

  @IsDate()
  @IsOptional()
  receivedHelpDate?: Date;

  @IsNestedArray(() => ReceivedHelpDto)
  @IsOptional()
  receivedGoods?: ReceivedHelpDto[];

  toVpoUserModel(): VpoUserModel<string> {
    return new VpoUserModel({
      id: this.id?.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: Role.Vpo,
      scheduleDate: this.scheduleDate,
      receivedHelpDate: this.receivedHelpDate,
      vpoReferenceNumber: this.vpoReferenceNumber,
    });
  }

  constructor(data: ModelConstructorData<VpoBaseModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}
