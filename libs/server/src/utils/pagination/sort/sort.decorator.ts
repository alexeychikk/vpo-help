import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { SortQueryDto } from '@vpo-help/model';
import { validateEntity } from '../../validation';
import { transformSortQuery } from './transformSortQuery';

export const Sort = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const entity = await validateEntity(SortQueryDto, {
      sort: transformSortQuery(req.query),
    });
    req.paginationSearchSort ??= {};
    return Object.assign(req.paginationSearchSort, entity);
  },
);
