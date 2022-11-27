import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { SettingsEntity } from '../entities';

@EntityRepository(SettingsEntity)
export class SettingsRepository extends BaseEntityRepository<SettingsEntity> {}
