import { BadRequestException } from '@nestjs/common';
import { isDateString } from 'class-validator';
import { isEmpty } from 'lodash';
import type { SearchComparatorDto } from '@vpo-help/model';

const MIN_FIELD_REGEX = /^min(-?)\[(.+)\]$/i;
const MAX_FIELD_REGEX = /^max(-?)\[(.+)\]$/i;

export function transformComparatorQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
): { min?: SearchComparatorDto; max?: SearchComparatorDto } {
  try {
    const min = extractComparatorFields(query, MIN_FIELD_REGEX);
    const max = extractComparatorFields(query, MAX_FIELD_REGEX);
    return {
      ...(min ? { min } : undefined),
      ...(max ? { max } : undefined),
    };
  } catch (err) {
    throw new BadRequestException(
      `search comparator query must be in format 'min[field1]=2&max[field2]=2022-01-01T00:00:00.000Z'`,
    );
  }
}

function extractComparatorFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
  regex: RegExp,
): SearchComparatorDto | undefined {
  const result = Object.keys(query)
    .filter((key) => regex.test(key))
    .reduce((res, key) => {
      const match = key.match(regex);
      if (!match) throw new Error();

      const [, isOptional, name] = match;
      res[name] = {
        value: transformComparatorValue(query[key]),
        isOptional: !!isOptional,
      };
      return res;
    }, {} as SearchComparatorDto);

  return isEmpty(result) ? undefined : result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformComparatorValue(value: any): string | number | Date {
  if (value instanceof Date) return value;
  const numValue = +value;
  if (!isNaN(numValue)) return numValue;
  if (isDateString(value)) return new Date(value);
  return value;
}
