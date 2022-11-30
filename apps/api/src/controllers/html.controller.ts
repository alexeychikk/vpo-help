import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AccessType,
  FindByPageNameDto,
  HtmlPageModel,
  Permission,
  UpdateHtmlPageDto,
} from '@vpo-help/model';
import {
  JwtAuthGuard,
  SettingsService,
  UsePermissions,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'html' })
export class HtmlController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UsePermissions({ [Permission.Html]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: HtmlPageModel) {
    return this.settingsService.createHtmlPage(dto);
  }

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  async getByName(@Param() { name }: FindByPageNameDto) {
    return this.settingsService.getHtmlPage(name);
  }

  @Put(':name')
  @UsePermissions({ [Permission.Html]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateByName(
    @Param() { name }: FindByPageNameDto,
    @Body() dto: UpdateHtmlPageDto,
  ) {
    return this.settingsService.updateHtmlPage(name, dto);
  }

  @Delete(':name')
  @UsePermissions({ [Permission.Html]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteByName(@Param() { name }: FindByPageNameDto) {
    return this.settingsService.deleteHtmlPage(name);
  }
}
