import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AccessType,
  PaginationSearchSortDto,
  Permission,
  VpoModel,
} from '@vpo-help/model';
import type { VpoEntity } from '@vpo-help/server';
import {
  JwtAuthGuard,
  PaginationSearchSort,
  UsePermissions,
  VpoService,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'vpo' })
export class VpoController {
  constructor(private vpoService: VpoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() vpoModel: VpoModel) {
    const vpo = await this.vpoService.register(vpoModel);
    return vpo.toVpoUserModel();
  }

  @Get()
  @UsePermissions({ [Permission.VpoList]: [AccessType.Read] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async list(@PaginationSearchSort() dto: PaginationSearchSortDto<VpoEntity>) {
    return this.vpoService.paginate(dto);
  }

  @Get('export')
  @UsePermissions({ [Permission.VpoExport]: [AccessType.Read] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async export(
    @PaginationSearchSort() dto: PaginationSearchSortDto<VpoEntity>,
  ) {
    // TODO
  }

  @Post('import')
  @UsePermissions({ [Permission.VpoImport]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async import() {
    // TODO
  }
}
