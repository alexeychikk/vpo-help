import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { PaginationQueryDto } from '@vpo-help/model';
import { validateEntity } from '../validation';

export const Pagination = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const entity = await validateEntity(PaginationQueryDto, req.query);
    req.paginationSearchSort ??= {};
    return Object.assign(req.paginationSearchSort, entity);
  },
);
