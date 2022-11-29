import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import type { ScheduleDto, SettingsDto } from '@vpo-help/model';
import { BaseModel, SettingsCategory } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity()
export class SettingsEntity extends baseEntityWith(
  BaseModel as Class<BaseModel<ObjectId>>,
) {
  @Index('idx_settings_category')
  @Column()
  category!: SettingsCategory;

  @Column()
  properties!: SettingsDto | ScheduleDto;

  constructor(data: EntityConstructorData<SettingsEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
