import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsInt, Max, Min } from 'class-validator';
import type { Optional } from 'utility-types';

export class SettingsDto {
  @IsInt()
  @Min(1)
  daysToNextVpoRegistration!: number;

  @IsDate()
  endOfWarDate!: Date;

  @IsInt()
  @Min(1)
  @Max(31)
  scheduleDaysAvailable!: number;

  @IsInt()
  helpCenterTimeZoneOffset = -120;

  constructor(data: Optional<SettingsDto>) {
    Object.assign(this, data);
  }
}

export class UpdateSettingsDto extends PartialType(SettingsDto) {}

export enum SettingsCategory {
  Schedule = 'SCHEDULE',
  Common = 'COMMON',
}
