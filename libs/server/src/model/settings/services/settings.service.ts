import type { OnModuleInit } from '@nestjs/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { sortBy } from 'lodash';
import type {
  ScheduleDto,
  SettingsDto,
  UpdateHtmlPageDto,
  UpdateSettingsDto,
} from '@vpo-help/model';
import {
  DEFAULT_SCHEDULE,
  DEFAULT_SETTINGS,
  HtmlPageModel,
  SettingsCategory,
} from '@vpo-help/model';
import { HtmlPageEntity, SettingsEntity } from '../entities';
import { HtmlPageRepository } from './htmlPage.repository';
import { SettingsRepository } from './settings.repository';

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
        properties: DEFAULT_SETTINGS,
      }),
    );

    await this.initSettings(
      new SettingsEntity({
        category: SettingsCategory.Schedule,
        properties: DEFAULT_SCHEDULE,
      }),
    );

    await this.initHtmlPage(
      new HtmlPageModel({
        name: 'info',
        content: {
          addresses: '',
          schedule: '',
        },
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

  private async initHtmlPage(page: HtmlPageModel) {
    try {
      await this.getHtmlPage(page.name);
    } catch (error) {
      await this.createHtmlPage(page);
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
    Object.entries(dto).forEach(
      ([day, slots]) => (dto[+day as Day] = sortBy(slots, 'timeFrom')),
    );
    return this.updateSettings(SettingsCategory.Schedule, dto);
  }

  async getHtmlPage(name: string): Promise<HtmlPageEntity> {
    const doc = await this.htmlPageRepository.findOne({ name });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async createHtmlPage(dto: HtmlPageModel): Promise<HtmlPageEntity> {
    const page = await this.htmlPageRepository.findOne({ name: dto.name });
    if (page) throw new ConflictException();
    const entity = plainToInstance(HtmlPageEntity, dto);
    return this.htmlPageRepository.save(entity);
  }

  async updateHtmlPage(
    name: string,
    dto: UpdateHtmlPageDto,
  ): Promise<HtmlPageEntity> {
    const page = await this.getHtmlPage(name);
    if (dto.name) page.name = dto.name;
    page.content = dto.content;
    return this.htmlPageRepository.saveExisting(page);
  }

  async deleteHtmlPage(name: string) {
    const entity = await this.getHtmlPage(name);
    await this.htmlPageRepository.delete(entity.id);
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
    if (!doc) throw new NotFoundException();
    return doc.properties as Ret;
  }
}
