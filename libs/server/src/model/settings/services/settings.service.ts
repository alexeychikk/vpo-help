import type { OnModuleInit } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateSettingsDto } from '@vpo-help/model';
import {
  ScheduleDto,
  ScheduleSlotDto,
  SettingsCategory,
  SettingsDto,
} from '@vpo-help/model';
import { SettingsEntity } from '../entities';
import { HtmlPageRepository } from './htmlPage.repository';
import { SettingsRepository } from './settings.repository';

const DEFAULT_DAY_SCHEDULE = [
  new ScheduleSlotDto({
    timeFrom: '13:00',
    timeTo: '13:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '13:30',
    timeTo: '14:00',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '14:00',
    timeTo: '14:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '14:30',
    timeTo: '15:00',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '15:00',
    timeTo: '15:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '15:30',
    timeTo: '16:00',
    numberOfPersons: 40,
  }),
];

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly htmlPageRepository: HtmlPageRepository,
  ) {}

  async onModuleInit() {
    await this.initSettings(
      new SettingsEntity({
        category: SettingsCategory.Common,
        properties: new SettingsDto({
          daysToNextVpoRegistration: 60,
          endOfWarDate: new Date('2025-01-01'),
          scheduleDaysAvailable: 2,
        }),
      }),
    );

    await this.initSettings(
      new SettingsEntity({
        category: SettingsCategory.Schedule,
        properties: new ScheduleDto({
          0: [],
          1: [],
          2: DEFAULT_DAY_SCHEDULE,
          3: DEFAULT_DAY_SCHEDULE,
          4: DEFAULT_DAY_SCHEDULE,
          5: [],
          6: [],
        }),
      }),
    );
  }

  private async initSettings(defaultSettings: SettingsEntity) {
    const existingSettings = await this.settingsRepository.findOne({
      category: defaultSettings.category,
    });
    if (!existingSettings) {
      await this.settingsRepository.save(defaultSettings);
    }
  }

  async getAllSettings() {
    const list = await this.settingsRepository.find();
    return list.reduce(
      (res, doc) => Object.assign(res, { [doc.category]: doc.properties }),
      {} as {
        common: SettingsDto;
        schedule: ScheduleDto;
      },
    );
  }

  async getCommonSettings(): Promise<SettingsDto> {
    return this.getSettings(SettingsCategory.Common);
  }

  async getSchedule(): Promise<ScheduleDto> {
    return this.getSettings(SettingsCategory.Schedule);
  }

  async updateCommonSettings(
    dto: Partial<UpdateSettingsDto>,
  ): Promise<SettingsDto> {
    return this.updateSettings(SettingsCategory.Common, dto);
  }

  async updateSchedule(dto: Partial<ScheduleDto>): Promise<ScheduleDto> {
    return this.updateSettings(SettingsCategory.Schedule, dto);
  }

  private async updateSettings<Ret extends SettingsEntity['properties']>(
    category: SettingsCategory,
    dto: Partial<SettingsEntity['properties']>,
  ): Promise<Ret> {
    const properties = await this.getSettings(category);
    Object.assign(properties, dto);
    await this.settingsRepository.updateSettings(category, properties);
    return properties as Ret;
  }

  private async getSettings<Ret extends SettingsEntity['properties']>(
    category: SettingsCategory,
  ): Promise<Ret> {
    const doc = await this.settingsRepository.findOne({ category });
    if (!doc) {
      throw new NotFoundException();
    }
    return doc.properties as Ret;
  }
}
