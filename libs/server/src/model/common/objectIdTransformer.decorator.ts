import { Transform } from 'class-transformer';
import type { ValidationOptions } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { composeDecorators } from '@vpo-help/utils';

export const ObjectIdTransformer = (validationOptions?: ValidationOptions) =>
  composeDecorators(
    IsMongoId(validationOptions),
    Transform(
      ({ value }) =>
        Array.isArray(value)
          ? value.map((v) => v.toString())
          : value.toString(),
      { toPlainOnly: true },
    ),
    Transform(
      ({ value }) =>
        Array.isArray(value)
          ? value.map((v) => new ObjectId(v))
          : new ObjectId(value),
      { toClassOnly: true },
    ),
  );
