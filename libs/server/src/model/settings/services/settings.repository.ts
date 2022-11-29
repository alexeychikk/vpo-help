import { EntityRepository } from 'typeorm';
import type { SettingsCategory } from '@vpo-help/model';
import { BaseEntityRepository } from '../../common';
import { SettingsEntity } from '../entities';

@EntityRepository(SettingsEntity)
export class SettingsRepository extends BaseEntityRepository<SettingsEntity> {
  async updateSettings(
    category: SettingsCategory,
    properties: SettingsEntity['properties'],
  ) {
    return this.updateOne({ category }, { $set: { properties } });
  }
}
