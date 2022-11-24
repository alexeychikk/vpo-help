import { composeDecorators } from '@vpo-help/utils';
import { Pagination } from './pagination.decorator';
import { Search } from './search';
import { Sort } from './sort';

export const PaginationSearchSort = () =>
  composeDecorators(Pagination(), Search(), Sort()) as ParameterDecorator;

export const PaginationSearch = () =>
  composeDecorators(Pagination(), Search()) as ParameterDecorator;

export const PaginationSort = () =>
  composeDecorators(Pagination(), Sort()) as ParameterDecorator;
