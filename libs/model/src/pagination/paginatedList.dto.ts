export type PaginatedListDto<Entity> = {
  items: Entity[];
  totalItems: number;
};
