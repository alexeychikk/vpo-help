import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function getParamDecoratorFactory<Value>(
  decorator: () => ParameterDecorator,
) {
  class Test {
    test(@decorator() value: Value) {
      return value;
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  const { factory } = args[Object.keys(args)[0]];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fakeRequest: any, data?: any): Value =>
    factory(data, {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => fakeRequest),
      })),
    });
}
