import type { AnyDecorator } from './composeDecorators';
import { composeDecorators } from './composeDecorators';

export const DecorateIf = (
  decoratorFn: () => AnyDecorator,
  predicate: () => boolean | undefined,
) =>
  composeDecorators(
    ...([predicate() ? decoratorFn() : undefined].filter(
      Boolean,
    ) as AnyDecorator[]),
  );
