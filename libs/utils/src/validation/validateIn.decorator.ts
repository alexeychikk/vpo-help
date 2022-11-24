import type { ValidationOptions } from 'class-validator';
import { ValidateBy } from 'class-validator';

export function ValidateIn<
  Constraint,
  Value,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Root extends Record<string, any>,
>(
  options: {
    getConstraint: (obj: Root) => Constraint;
    getValue: (obj: Root) => Value;
    validate: (constraint: Constraint, value: Value) => boolean;
  },
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'validateIn',
      validator: {
        validate(_, innerOptions) {
          const constraint = options.getConstraint(
            innerOptions!.object as Root,
          );
          const valueToValidate = options.getValue(
            innerOptions!.object as Root,
          );
          return options.validate(constraint, valueToValidate);
        },
      },
    },
    validationOptions,
  );
}
