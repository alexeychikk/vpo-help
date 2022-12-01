import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsSearchComparator } from './isSearchComparator.decorator';
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

  @IsSearchComparator()
  @IsOptional()
  min?: SearchComparatorDto;

  @IsSearchComparator()
  @IsOptional()
  max?: SearchComparatorDto;
}

export type SearchComparatorDto = Record<
  string,
  {
    value: string | number | Date;
    isOptional?: boolean;
  }
>;
