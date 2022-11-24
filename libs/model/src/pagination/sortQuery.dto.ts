import { IsObject, IsOptional } from 'class-validator';
import { SortDirectionMap } from './sortDirection.enum';

export class SortQueryDto {
  @IsObject()
  @IsOptional()
  sort?: SortDirectionMap;
}
