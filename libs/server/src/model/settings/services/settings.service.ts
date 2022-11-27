import { Injectable } from '@nestjs/common';
import { HtmlPageRepository } from '@vpo-help/server';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly htmlPageRepository: HtmlPageRepository,
  ) {}
}
