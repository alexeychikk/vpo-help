import { BadRequestException } from '@nestjs/common';
import { escapeRegExp, isEmpty } from 'lodash';
import type { SearchQueryDto } from '@vpo-help/model';
import { SearchOperator, SearchType } from '@vpo-help/model';

export function searchToMongoQuery({
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
