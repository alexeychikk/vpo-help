import { Injectable } from '@nestjs/common';
import type {
  IdType,
  PaginationSearchSortDto,
  VpoModel,
} from '@vpo-help/model';
import { VpoEntity } from '../entities';
import { VpoRepository } from './vpo.repository';

@Injectable()
export class VpoService {
  constructor(private readonly vpoRepository: VpoRepository) {}

  async register({
    id,
    createdAt,
    updatedAt,
    ...vpo
  }: VpoModel): Promise<VpoEntity> {
    const entity = new VpoEntity({ ...vpo });
    return this.vpoRepository.save(entity);
  }

  async findById(id: IdType): Promise<VpoEntity> {
    return this.vpoRepository.findById(id);
  }

  async findByReferenceNumber(vpoReferenceNumber: string): Promise<VpoEntity> {
    return this.vpoRepository.findOneOrFail({ where: { vpoReferenceNumber } });
  }

  async paginate(dto: PaginationSearchSortDto<VpoEntity>) {
    return this.vpoRepository.paginate(dto);
  }
}
