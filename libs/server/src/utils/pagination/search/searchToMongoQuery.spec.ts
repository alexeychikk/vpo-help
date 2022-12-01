import { BadRequestException } from '@nestjs/common';
import { SearchOperator, SearchType } from '@vpo-help/model';
import { searchToMongoQuery } from './searchToMongoQuery';

test('converts `q` query parameter to mongo text search query', () => {
  const where = searchToMongoQuery({ q: 'foo' });
  expect(where).toEqual({ $text: { $search: 'foo' } });
});

test('converts `q` and `qType: "partial"` query parameters to mongo query', () => {
  const where = searchToMongoQuery({
    q: '{"foo":"[bar-*]"}',
    qType: SearchType.Partial,
  });
  expect(where).toEqual({
    $or: [{ foo: { $regex: '\\[bar-\\*\\]', $options: 'i' } }],
  });
});

test('converts `q`, `qType: "partial"`, `qOperator: "and"` query parameters to mongo query', () => {
  const where = searchToMongoQuery({
    q: '{"foo":"bar", "baz": 123}',
    qType: SearchType.Partial,
    qOperator: SearchOperator.And,
  });
  expect(where).toEqual({
    $and: [
      { foo: { $regex: 'bar', $options: 'i' } },
      { baz: 123 },
      { baz: { $regex: '123', $options: 'i' } },
    ],
  });
});

test('throws UnprocessableEntityException if `qType: "partial"` and `q` is not JSON', () => {
  expect(() =>
    searchToMongoQuery({
      q: '"foo":"bar"',
      qType: SearchType.Partial,
    }),
  ).toThrow(BadRequestException);
});

test('returns undefined if q is empty', () => {
  expect(searchToMongoQuery({})).toEqual(undefined);
  expect(searchToMongoQuery({ q: '' })).toEqual(undefined);
  expect(searchToMongoQuery({ q: '{}', qType: SearchType.Partial })).toEqual(
    undefined,
  );
});

test('converts min and max to mongo queries', () => {
  expect(
    searchToMongoQuery({
      min: { foo: { value: 'bar' }, baz: { value: 10, isOptional: true } },
    }),
  ).toEqual({
    foo: { $gte: 'bar' },
    $and: [{ $or: [{ baz: { $exists: false } }, { baz: { $gte: 10 } }] }],
  });

  const date = new Date();
  expect(
    searchToMongoQuery({
      max: { foo: { value: 'oops' }, baz: { value: date } },
    }),
  ).toEqual({
    foo: { $lte: 'oops' },
    baz: { $lte: date },
  });
});

test('multiple operators become $and query', () => {
  expect(
    searchToMongoQuery({
      q: 'foo',
      min: { foo: { value: 'bar' } },
      max: { baz: { value: 10 } },
    }),
  ).toEqual({
    $and: [
      { $text: { $search: 'foo' } },
      { foo: { $gte: 'bar' } },
      { baz: { $lte: 10 } },
    ],
  });
});
