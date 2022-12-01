import { transformComparatorQuery } from './transformComparatorQuery';

test('converts query object to SearchComparatorDto', () => {
  const res = transformComparatorQuery({
    q: 'search',
    'min[field1]': 'foo',
    'min-[field2]': 5,
    'max-[field1]': '10',
    'max[field2]': new Date().toISOString(),
    'max[field3]': new Date(),
    'min[]': 'foo',
    max: 'bar',
  });

  expect(res).toEqual({
    min: {
      field1: { value: 'foo', isOptional: false },
      field2: { value: 5, isOptional: true },
    },
    max: {
      field1: { value: 10, isOptional: true },
      field2: { value: expect.any(Date), isOptional: false },
      field3: { value: expect.any(Date), isOptional: false },
    },
  });
});
