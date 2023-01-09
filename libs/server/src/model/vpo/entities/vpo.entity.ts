import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import type { ReceivedHelpDto } from '@vpo-help/model';
import { VpoModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity({ name: 'vpo' })
export class VpoEntity extends baseEntityWith(
  VpoModel as Class<VpoModel<ObjectId>>,
) {
  @Index('idx_vpo_email')
  @Column()
  email!: string;

  @Index('idx_vpo_issue_date')
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

  @Index('idx_vpo_phone_number')
  @Column()
  phoneNumber!: string;

  @Index('idx_vpo_tax_id_number')
  @Column()
  taxIdNumber!: string;

  @Index('idx_vpo_date_of_birth')
  @Column()
  dateOfBirth!: Date;

  @Column()
  addressOfRegistration!: string;

  @Column()
  addressOfResidence!: string;

  @Column()
  numberOfRelatives?: number;

  @Column()
  numberOfRelativesBelow16?: number;

  @Column()
  numberOfRelativesAbove65?: number;

  @Index('idx_vpo_schedule_date')
  @Column()
  scheduleDate!: Date;

  @Index('idx_vpo_received_help_date')
  @Column()
  receivedHelpDate?: Date;

  @Column()
  receivedGoods?: ReceivedHelpDto[];

  constructor(data: EntityConstructorData<VpoEntity>) {
    super(data);
  }
}
