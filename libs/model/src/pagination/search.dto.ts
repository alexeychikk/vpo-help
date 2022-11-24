import type { FindOptionsWhere } from 'typeorm';

export type SearchDto<Entity = unknown> = {
  where?: FindOptionsWhere<Entity>;
};
