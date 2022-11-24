export enum SortDirection {
  asc = 1,
  desc = -1,
}

export type SortDirectionMap<Entity = unknown> = Record<
  keyof Entity,
  SortDirection
>;
