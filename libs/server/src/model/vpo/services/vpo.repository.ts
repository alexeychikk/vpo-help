import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { VpoEntity } from '../entities';

@EntityRepository(VpoEntity)
export class VpoRepository extends BaseEntityRepository<VpoEntity> {}
