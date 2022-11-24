import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SearchOperator } from './searchOperator.enum';
import { SearchType } from './searchType.enum';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(SearchType)
  @IsOptional()
  qType?: string;

  @IsEnum(SearchOperator)
  @IsOptional()
  qOperator?: string;
}
