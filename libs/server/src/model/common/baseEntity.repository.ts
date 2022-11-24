import { BadRequestException, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import type {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectID,
  ObjectLiteral,
  ReplaceOneOptions,
  SaveOptions,
  UpdateResult,
  UpdateWriteOpResult,
} from 'typeorm';
import { MongoRepository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type {
  IdType,
  PaginatedListDto,
  PaginationSearchSortDto,
} from '@vpo-help/model';
import { BaseModel } from '@vpo-help/model';

export class BaseEntityRepository<
  Entity extends ObjectLiteral,
> extends MongoRepository<Entity> {
  /**
   * Should only be used for saving new entities (because empty-array-columns
   * are ignored for unknown reason). To update an existing entity use `update`
   * method.
   */
  async save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T> {
    if (entity instanceof BaseModel && entity.id) {
      entity.updatedAt = new Date();
    }
    return super.save(entity, options);
  }

  /**
   * This method exists because `save` method above does not actually save
   * empty-array-columns when trying to update an existing entity (fuck typeorm).
   */
  async saveExisting<T extends DeepPartial<Entity>>(entity: T): Promise<T> {
    const { affected } = await this.update(entity.id, entity);
    if (!affected) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }
    return entity;
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return super.update(criteria, {
      ...omit(partialEntity, ['id']),
      updatedAt: new Date(),
    });
  }

  updateOne(
    query: ObjectLiteral,
    { $set, ...restUpdate }: ObjectLiteral,
    options?: ReplaceOneOptions,
  ): Promise<UpdateWriteOpResult> {
    return super.updateOne(
      query,
      { ...restUpdate, $set: { ...$set, updatedAt: new Date() } },
      options,
    );
  }

  async updateById(
    id: IdType,
    update: ObjectLiteral,
    options?: ReplaceOneOptions,
  ): Promise<UpdateWriteOpResult> {
    const res = await this.updateOne(
      { _id: new ObjectId(id) },
      update,
      options,
    );
    if (!res.matchedCount) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return res;
  }

  async findById(id: IdType): Promise<Entity> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const entity = await this.findOneBy({ id: id.toString() });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async paginate({
    limit,
    page,
    sort,
    where,
  }: PaginationSearchSortDto<Entity>): Promise<PaginatedListDto<Entity>> {
    const [items, totalItems] = await this.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: sort as FindOptionsOrder<Entity>,
    });
    return { items, totalItems };
  }
}
