import { BadRequestException } from '@nestjs/common';
import { transformSortQuery } from './transformSortQuery';

test('converts query object to SortDirectionMap', () => {
  const res = transformSortQuery({
    q: 'search',
    'sort[field1]': 'asc',
    'sort[field2]': 'desc',
    'sort[]': 'asc',
    sort: 'desc',
  });

  expect(res).toEqual({
    field1: 1,
    field2: -1,
  });
});

test('throws BadRequestException if sort field has invalid value', () => {
  expect(() => transformSortQuery({ 'sort[field]': '' })).toThrow(
    BadRequestException,
  );

  expect(() => transformSortQuery({ 'sort[field]': 'foo' })).toThrow(
    BadRequestException,
  );

  expect(() => transformSortQuery({ 'sort[field]': 0 })).toThrow(
    BadRequestException,
  );

  expect(() => transformSortQuery({ 'sort[field]': {} })).toThrow(
    BadRequestException,
  );
});
