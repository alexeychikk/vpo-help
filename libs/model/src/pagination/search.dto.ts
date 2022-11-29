import type { FindConditions } from 'typeorm';

export type SearchDto<Entity = unknown> = {
  where?: FindConditions<Entity>;
};
