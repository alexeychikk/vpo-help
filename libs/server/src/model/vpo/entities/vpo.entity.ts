import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { ReceivedGoodsDto, VpoModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity()
export class VpoEntity extends baseEntityWith(
  VpoModel as Class<VpoModel<ObjectId>>,
) {
  @Column()
  vpoIssueDate!: Date;

  @Index('idx_vpo_reference_number', { unique: true })
  @Column()
  vpoReferenceNumber!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  middleName!: string;

  @Column()
  dateOfBirth!: Date;

  @Column()
  addressOfRegistration!: string;

  @Column()
  addressOfResidence!: string;

  @Column()
  numberOfRelatives!: number;

  @Column()
  numberOfRelativesBelow16!: number;

  @Column()
  numberOfRelativesAbove65!: number;

  @Index('idx_vpo_schedule_date')
  @Column()
  scheduleDate!: Date;

  @Column()
  receivedHelpDate?: Date;

  @Column()
  receivedGoods?: ReceivedGoodsDto;

  @Column()
  phoneNumber?: string;

  @Column()
  email?: string;

  constructor(data: EntityConstructorData<VpoEntity>) {
    super(data);
  }
}
