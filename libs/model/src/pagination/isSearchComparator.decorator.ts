import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { isObject, ValidateBy } from 'class-validator';

export function IsSearchComparator(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isSearchComparator',
      validator: {
        validate: (value: unknown) => {
          return (
            isObject(value) &&
            Object.values(value).every(
              (propertyValue) =>
                (['string', 'number'].includes(typeof propertyValue.value) ||
                  propertyValue.value instanceof Date) &&
                (propertyValue.isOptional === undefined ||
                  typeof propertyValue.isOptional === 'boolean'),
            )
          );
        },
        defaultMessage: ({ property }: ValidationArguments) =>
          `Search comparator ${property} must be of type string | number | Date`,
      },
    },
    validationOptions,
  );
}
