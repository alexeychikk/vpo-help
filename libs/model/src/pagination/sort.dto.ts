import type { SortDirectionMap } from './sortDirection.enum';

export type SortDto<Entity = unknown> = {
  sort?: SortDirectionMap<Entity>;
};
