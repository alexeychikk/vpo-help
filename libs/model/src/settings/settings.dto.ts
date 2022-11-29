import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';
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

export class UpdateSettingsDto extends SettingsDto {
  @IsOptional()
  daysToNextVpoRegistration!: number;

  @IsOptional()
  endOfWarDate!: Date;

  @IsOptional()
  scheduleDaysAvailable!: number;

  @IsOptional()
  helpCenterTimeZoneOffset = -120;
}

export enum SettingsCategory {
  Schedule = 'SCHEDULE',
  Common = 'COMMON',
}
