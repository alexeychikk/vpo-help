import type { FunctionKeys, Optional } from 'utility-types';
import type { IdType } from './id.type';

export class BaseModel<Id extends IdType = IdType> {
  id!: Id;
  createdAt!: Date;
  updatedAt!: Date;

  constructor() {
    const date = Date.now();
    this.createdAt = new Date(date);
    this.updatedAt = new Date(date);
  }
}

export type ModelConstructorData<
  Model extends BaseModel<IdType>,
  OP extends keyof Omit<Model, FunctionKeys<Model>> = never,
> = Omit<Optional<Model, keyof BaseModel<IdType> | OP>, FunctionKeys<Model>>;
