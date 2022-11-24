import type { ClassConstructor } from 'class-transformer';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { composeDecorators } from '../misc';

export const IsNestedArray = <T>(typeFn: () => ClassConstructor<T>) =>
  composeDecorators(IsArray(), Type(typeFn), ValidateNested({ each: true }));
