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
