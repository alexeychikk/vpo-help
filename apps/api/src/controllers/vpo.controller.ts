import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AccessType,
  FindByIdDto,
  PaginationSearchSortDto,
  Permission,
  VpoModel,
} from '@vpo-help/model';
import type { VpoEntity } from '@vpo-help/server';
import {
  CsvService,
  JwtAuthGuard,
  PaginationSearchSort,
  UsePermissions,
  VpoService,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'vpo' })
export class VpoController {
  constructor(
    private readonly vpoService: VpoService,
    private readonly csvService: CsvService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() vpoModel: VpoModel) {
    const vpo = await this.vpoService.register(vpoModel);
    return vpo.toVpoUserModel();
  }

  @Get(':id')
  @UsePermissions({ [Permission.Vpo]: [AccessType.Read] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getById(@Param() dto: FindByIdDto) {
    return this.vpoService.findById(dto.id);
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
    return this.csvService.exportVpoList(dto);
  }

  @Post('import')
  @UsePermissions({ [Permission.VpoImport]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async import() {
    // TODO
  }
}
