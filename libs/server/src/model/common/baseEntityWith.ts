import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type { Class, FunctionKeys, Optional } from 'utility-types';
import type { BaseModel } from '@vpo-help/model';
import { ObjectIdTransformer } from './objectIdTransformer.decorator';

export function baseEntityWith<T extends Class<BaseModel<ObjectId>>>(
  ModelClass: T,
) {
  @Entity()
  class Temp extends ModelClass {
    @ObjectIdColumn()
    @ObjectIdTransformer()
    id!: ObjectId;

    @Column()
    @Index('idx_created_at')
    createdAt!: Date;

    @Column()
    @Index('idx_updated_at')
    updatedAt!: Date;
  }
  return Temp;
}

export type EntityConstructorData<
  T extends BaseModel<ObjectId>,
  OP extends keyof Omit<T, FunctionKeys<T>> = never,
> = Omit<Optional<T, keyof BaseModel<ObjectId> | OP>, FunctionKeys<T>>;
