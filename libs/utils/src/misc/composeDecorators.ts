/**
 * Slightly modified version of
 * @see https://github.com/nestjs/nest/blob/master/packages/common/decorators/core/apply-decorators.ts
 * that also accepts ParameterDecorator
 */
export function composeDecorators(
  ...decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator | ParameterDecorator
  >
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => {
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        (decorator as ClassDecorator)(target);
        continue;
      }
      (decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey!,
        descriptor!,
      );
    }
  };
}
