import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type { Class, FunctionKeys, Optional } from 'utility-types';
import type { BaseModel } from '@vpo-help/model';
import { DecorateIf } from '@vpo-help/utils';
import { ObjectIdTransformer } from './objectIdTransformer.decorator';

export function baseEntityWith<T extends Class<BaseModel<ObjectId>>>(
  ModelClass: T,
  {
    createdAtIndex = true,
    updatedAtIndex = true,
  }: { createdAtIndex?: boolean; updatedAtIndex?: boolean } = {},
) {
  @Entity()
  class Temp extends ModelClass {
    @ObjectIdColumn()
    @ObjectIdTransformer()
    id!: ObjectId;

    @Column()
    @DecorateIf(() => Index('idx_created_at'), () => createdAtIndex)
    createdAt!: Date;

    @Column()
    @DecorateIf(() => Index('idx_updated_at'), () => updatedAtIndex)
    updatedAt!: Date;
  }
  return Temp;
}

export type EntityConstructorData<
  T extends BaseModel<ObjectId>,
  OP extends keyof Omit<T, FunctionKeys<T>> = never,
> = Omit<Optional<T, keyof BaseModel<ObjectId> | OP>, FunctionKeys<T>>;
