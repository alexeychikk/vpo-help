import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { HtmlPageEntity } from '../entities';

@EntityRepository(HtmlPageEntity)
export class HtmlPageRepository extends BaseEntityRepository<HtmlPageEntity> {}
