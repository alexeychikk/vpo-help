import { ArrayMaxSize, IsOptional, Length } from 'class-validator';
import { IsNestedArray, IsNestedObject } from '@vpo-help/utils';
import { VpoModel } from './vpo.model';
import { VpoRelativeModel } from './vpoRelative.model';

export class RegisterVpoBulkDto {
  @IsNestedObject(() => VpoModel)
  mainVpo!: VpoModel;

  @IsNestedArray(() => VpoRelativeModel)
  @ArrayMaxSize(20)
  @IsOptional()
  relativeVpos: VpoRelativeModel[] = [];

  @Length(6, 6)
  verificationCode!: string;

  constructor(data: RegisterVpoBulkDto) {
    Object.assign(this, data);
  }
}
