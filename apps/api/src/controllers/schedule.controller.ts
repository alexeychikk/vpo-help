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
import { AccessType, Permission, ScheduleDto } from '@vpo-help/model';
import {
  JwtAuthGuard,
  SettingsService,
  UsePermissions,
  VpoService,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'schedule' })
export class ScheduleController {
  constructor(
    private readonly vpoService: VpoService,
    private readonly settingsService: SettingsService,
  ) {}

  @Put()
  @UsePermissions({ [Permission.Schedule]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSchedule(@Body() dto: ScheduleDto) {
    return this.settingsService.updateSchedule(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSchedule() {
    return this.settingsService.getSchedule();
  }

  @Get('available')
  @HttpCode(HttpStatus.OK)
  async getAvailableSchedule() {
    return this.vpoService.getAvailableSchedule();
  }
}
