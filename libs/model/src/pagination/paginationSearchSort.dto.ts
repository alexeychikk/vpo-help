import type { PaginationDto } from './pagination.dto';
import type { SearchDto } from './search.dto';
import type { SortDto } from './sort.dto';

export type PaginationSearchSortDto<Entity = unknown> = PaginationDto &
  SearchDto<Entity> &
  SortDto<Entity>;

export type PaginationSearchDto<Entity = unknown> = PaginationDto &
  SearchDto<Entity>;

export type PaginationSortDto<Entity = unknown> = PaginationDto &
  SortDto<Entity>;
