import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import {
  AccessType,
  FindByIdDto,
  PaginationSearchSortDto,
  Permission,
  RegisterVpoDto,
  VpoExportQueryDto,
  VpoModel,
} from '@vpo-help/model';
import type { VpoEntity } from '@vpo-help/server';
import {
  CsvService,
  JwtAuthGuard,
  PaginationSearchSort,
  UsePermissions,
  VerificationService,
  VpoService,
} from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'vpo' })
export class VpoController {
  constructor(
    private readonly vpoService: VpoService,
    private readonly verificationService: VerificationService,
    private readonly csvService: CsvService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterVpoDto) {
    await this.verificationService.verifyCodeByEmail({
      email: dto.email,
      verificationCode: dto.verificationCode,
    });
    const model = plainToInstance(VpoModel, instanceToPlain(dto));
    const entity = await this.vpoService.register(model);
    return entity.toVpoUserModel();
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
    @Query() query: VpoExportQueryDto,
  ) {
    return this.csvService.exportVpoList(dto, query);
  }

  @Post('import')
  @UsePermissions({ [Permission.VpoImport]: [AccessType.Write] })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async import(@Req() req: FastifyRequest) {
    const fileData = await req.file();
    if (!fileData) throw new BadRequestException();
    return this.csvService.updateVpoListFromFile(fileData);
  }
}
