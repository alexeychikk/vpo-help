import { BadRequestException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import type { SortDirectionMap } from '@vpo-help/model';
import { SortDirection } from '@vpo-help/model';

const SORT_FIELD_REGEX = /^sort\[(.+)\]$/i;

export function transformSortQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
): SortDirectionMap | undefined {
  try {
    const result = Object.keys(query)
      .filter((key) => SORT_FIELD_REGEX.test(key))
      .reduce((res, key) => {
        if (typeof query[key] !== 'string') throw new Error();
        const match = key.match(SORT_FIELD_REGEX);
        if (!match) throw new Error();

        const [, name] = match;
        const ascOrDesc: keyof typeof SortDirection = query[key].toLowerCase();
        const value = SortDirection[ascOrDesc];
        if (!value) throw new Error();
        (res as Record<string, unknown>)[name] = value;

        return res;
      }, {} as SortDirectionMap);

    return isEmpty(result) ? undefined : result;
  } catch (err) {
    throw new BadRequestException(
      `sort query must be in format 'sort[field1]=asc&sort[field2]=desc'`,
    );
  }
}
