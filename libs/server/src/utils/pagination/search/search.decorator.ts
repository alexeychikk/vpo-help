import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { SearchQueryDto } from '@vpo-help/model';
import { validateEntity } from '../../validation';
import { searchToMongoQuery } from './searchToMongoQuery';
import { transformComparatorQuery } from './transformComparatorQuery';

export const Search = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const dto = await validateEntity(SearchQueryDto, {
      q: req.query.q,
      qType: req.query.qType,
      qOperator: req.query.qOperator,
      ...transformComparatorQuery(req.query),
    });
    const entity = { where: searchToMongoQuery(dto) };
    req.paginationSearchSort ??= {};
    return Object.assign(req.paginationSearchSort, entity);
  },
);
