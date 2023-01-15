import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { Optional } from 'utility-types';

export class SettingsDto {
  @IsInt()
  @Min(1)
  daysToNextVpoRegistration!: number;

  @IsDate()
  endOfRegistrationDate!: Date;

  @IsInt()
  @Min(1)
  @Max(31)
  scheduleDaysAvailable!: number;

  constructor(data: Optional<SettingsDto>) {
    Object.assign(this, data);
  }
}

export class UpdateSettingsDto extends SettingsDto {
  @IsOptional()
  daysToNextVpoRegistration!: number;

  @IsOptional()
  endOfRegistrationDate!: Date;

  @IsOptional()
  scheduleDaysAvailable!: number;
}

export enum SettingsCategory {
  Schedule = 'schedule',
  Common = 'common',
}
