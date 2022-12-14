import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { Role, UserModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity({ name: 'user' })
export class UserEntity extends baseEntityWith(
  UserModel as Class<UserModel<ObjectId>>,
) {
  @Index('idx_user_email', { unique: true })
  @Column()
  email!: string;

  @Column()
  role!: Role;

  @Column()
  passwordHash!: string;

  constructor(data: EntityConstructorData<UserEntity>) {
    super(data);
  }
}
