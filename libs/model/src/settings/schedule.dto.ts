import { IsDate, IsInt, Length, Max, Min } from 'class-validator';
import type { Optional } from 'utility-types';
import { IsNestedArray } from '@vpo-help/utils';

export class ScheduleDto {
  /**
   * Sunday
   */
  @IsNestedArray(() => ScheduleSlotDto)
  0: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  1: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  2: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  3: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  4: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  5: ScheduleSlotDto[];

  @IsNestedArray(() => ScheduleSlotDto)
  6: ScheduleSlotDto[];

  constructor(data: Optional<ScheduleDto>) {
    Object.assign(this, data);
  }
}

export class ScheduleSlotDto {
  @Length(5)
  timeFrom!: string;

  @Length(5)
  timeTo!: string;

  @IsInt()
  @Min(1)
  @Max(10000)
  numberOfPersons!: number;

  constructor(data: Optional<ScheduleSlotDto>) {
    Object.assign(this, data);
  }
}

export class ScheduleAvailableDto {
  @IsNestedArray(() => ScheduleSlotAvailableDto)
  items!: ScheduleSlotAvailableDto[];

  constructor(data: Optional<ScheduleAvailableDto>) {
    Object.assign(this, data);
  }
}

export class ScheduleSlotAvailableDto {
  @IsDate()
  dateFrom!: Date;

  @IsDate()
  dateTo!: Date;

  constructor(data: Optional<ScheduleSlotAvailableDto>) {
    Object.assign(this, data);
  }
}
