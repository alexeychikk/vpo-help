import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { UserModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity()
export class UserEntity extends baseEntityWith(
  UserModel as Class<UserModel<ObjectId>>,
) {
  @Index('idx_user_email', { unique: true })
  @Column()
  email!: string;

  constructor(data: EntityConstructorData<UserEntity>) {
    super(data);
  }
}
