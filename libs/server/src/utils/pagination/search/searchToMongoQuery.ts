import { BadRequestException } from '@nestjs/common';
import { escapeRegExp, isEmpty } from 'lodash';
import type { SearchComparatorDto, SearchQueryDto } from '@vpo-help/model';
import { SearchOperator, SearchType } from '@vpo-help/model';

export function searchToMongoQuery(
  dto: SearchQueryDto,
): Record<string, unknown> | undefined {
  const $and = [
    transformQSearch(dto),
    dto.min && transformComparatorSearch('$gte', dto.min),
    dto.max && transformComparatorSearch('$lte', dto.max),
  ].filter(Boolean);

  return $and.length === 0 ? undefined : $and.length === 1 ? $and[0] : { $and };
}

function transformQSearch({
  q,
  qType,
  qOperator,
}: SearchQueryDto): Record<string, unknown> | undefined {
  if (!q) return;

  const searchType = qType || SearchType.Full;
  const searchOperator = qOperator === SearchOperator.And ? '$and' : '$or';

  if (searchType === 'full') {
    return { $text: { $search: q } };
  }

  try {
    const parsedQ = JSON.parse(q);
    if (isEmpty(parsedQ)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any[]> = {
      [searchOperator]: [],
    };
    Object.keys(parsedQ).forEach((k) => {
      const val = parsedQ[k];
      const numVal = +val;

      if (!isNaN(numVal)) {
        result[searchOperator].push({
          [k]: numVal,
        });
      }

      result[searchOperator].push({
        [k]: { $regex: escapeRegExp(val), $options: 'i' },
      });
    });

    return result;
  } catch (err) {
    throw new BadRequestException(
      `Could not parse 'q' query parameter to JSON`,
    );
  }
}

function transformComparatorSearch(
  operator: string,
  dto: SearchComparatorDto,
): Record<string, unknown> | undefined {
  const result = Object.entries(dto).reduce(
    (res, [key, { value, isOptional }]) => {
      if (isOptional) {
        res.$and ??= [];
        (res.$and as Record<string, unknown>[]).push({
          $or: [
            { [key]: { $exists: false } },
            { [key]: { [operator]: value } },
          ],
        });
      } else {
        res[key] = { [operator]: value };
      }
      return res;
    },
    {} as Record<string, unknown>,
  );
  return isEmpty(result) ? undefined : result;
}
