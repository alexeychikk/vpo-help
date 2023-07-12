import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import type { Optional } from 'utility-types';

export class SettingsDto {
  @IsInt()
  @Min(1)
  daysToNextVpoRegistration!: number;

  @IsDate()
  startOfRegistrationDate!: Date;

  @IsDate()
  endOfRegistrationDate!: Date;

  @IsBoolean()
  isLastRegistration!: boolean;

  @IsInt()
  @Min(1)
  @Max(31)
  scheduleDaysAvailable!: number;

  constructor(data: Optional<SettingsDto>) {
    Object.assign(this, data);
  }
}

export class UpdateSettingsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  daysToNextVpoRegistration?: number;

  @IsDate()
  @IsOptional()
  startOfRegistrationDate?: Date;

  @IsDate()
  @IsOptional()
  endOfRegistrationDate?: Date;

  @IsBoolean()
  @IsOptional()
  isLastRegistration?: boolean;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  scheduleDaysAvailable?: number;

  constructor(data: Optional<UpdateSettingsDto>) {
    Object.assign(this, data);
  }
}

export enum SettingsCategory {
  Schedule = 'schedule',
  Common = 'common',
}
