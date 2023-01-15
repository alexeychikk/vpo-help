import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessType, Permission, UpdateSettingsDto } from '@vpo-help/model';
import {
  JwtAuthGuard,
  SettingsService,
  UsePermissions,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'settings' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put()
  @UsePermissions({ [Permission.Settings]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateCommonSettings(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSettings() {
    return this.settingsService.getCommonSettings();
  }
}
