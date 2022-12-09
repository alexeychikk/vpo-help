import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { BaseModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity()
export class VerificationCodeEntity extends baseEntityWith(
  BaseModel as Class<BaseModel<ObjectId>>,
) {
  @Index('idx_verification_code_email')
  @Column()
  email!: string;

  @Column()
  codeHash!: string;

  constructor(data: EntityConstructorData<VerificationCodeEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
