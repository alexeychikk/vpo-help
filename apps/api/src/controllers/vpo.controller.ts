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
  PaginationSearchSortDto,
  Role,
  VpoModel,
  VpoUserModel,
} from '@vpo-help/model';
import type { VpoEntity } from '@vpo-help/server';
import { PaginationSearchSort, VpoService } from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'vpo' })
export class VpoController {
  constructor(private vpoService: VpoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() vpoModel: VpoModel) {
    const vpo = await this.vpoService.register(vpoModel);
    return new VpoUserModel({
      id: vpo.id,
      createdAt: vpo.createdAt,
      updatedAt: vpo.updatedAt,
      role: Role.Vpo,
      scheduleDate: vpo.scheduleDate,
      vpoReferenceNumber: vpo.vpoReferenceNumber,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@PaginationSearchSort() dto: PaginationSearchSortDto<VpoEntity>) {
    return this.vpoService.paginate(dto);
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async export(
    @PaginationSearchSort() dto: PaginationSearchSortDto<VpoEntity>,
  ) {
    // TODO
  }

  @Get('import')
  @HttpCode(HttpStatus.OK)
  async import() {
    // TODO
  }
}
