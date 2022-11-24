import type { ClassConstructor, TypeHelpOptions } from 'class-transformer';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { composeDecorators } from '../misc';

export const IsNestedObject = <T>(
  typeFn: (type?: TypeHelpOptions) => ClassConstructor<T>,
) => composeDecorators(IsObject(), Type(typeFn), ValidateNested());
