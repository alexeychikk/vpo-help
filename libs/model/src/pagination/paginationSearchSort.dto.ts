import type { PaginationDto } from './pagination.dto';
import type { SearchDto } from './search.dto';
import type { SortDto } from './sort.dto';

/**
 * Usage from client:
 * @example
 * ```txt
 * ?page=2&limit=3000
 * ?q=foo
 * ?q={"foo":"bar","baz":123}&qType=partial&qOperator=and
 * ?sort[field1]=asc&sort[field2]=desc
 * ?min[field1]=3&max-[field2]=2022-01-01T00:00:00.000Z
 * ```
 */
export type PaginationSearchSortDto<Entity = unknown> = PaginationDto &
  SearchDto<Entity> &
  SortDto<Entity>;

export type PaginationSearchDto<Entity = unknown> = PaginationDto &
  SearchDto<Entity>;

export type PaginationSortDto<Entity = unknown> = PaginationDto &
  SortDto<Entity>;
