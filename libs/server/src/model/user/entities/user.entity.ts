import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { Role, UserModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity()
export class UserEntity extends baseEntityWith(
  UserModel as Class<UserModel<ObjectId>>,
) {
  @Index('idx_user_email', { unique: true })
  @Column()
  email!: string;

  @Column()
  role!: Role;

  constructor(data: EntityConstructorData<UserEntity>) {
    super(data);
  }
}
