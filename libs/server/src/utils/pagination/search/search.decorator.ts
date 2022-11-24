import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { SearchQueryDto } from '@vpo-help/model';
import { validateEntity } from '../../validation';
import { searchToMongoQuery } from './searchToMongoQuery';

export const Search = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const dto = await validateEntity(SearchQueryDto, req.query);
    const entity = { where: searchToMongoQuery(dto) };
    req.paginationSearchSort ??= {};
    return Object.assign(req.paginationSearchSort, entity);
  },
);
