import 'reflect-metadata';
const METADATA_KEY = Symbol('promiseChain');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChainKeyMetadata<T = any> = {
  index: number;
  getValue?: (parameter: T) => unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChainKey<T = any>(getValue?: ChainKeyMetadata<T>['getValue']) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyName: string | symbol,
    parameterIndex: number,
  ) => {
    const existingMeta: number | undefined = Reflect.getOwnMetadata(
      METADATA_KEY,
      target,
      propertyName,
    );
    if (existingMeta !== undefined) {
      throw new Error(
        `ChainKey decorator can only be applied once on ${propertyName.toString()}`,
      );
    }
    Reflect.defineMetadata(
      METADATA_KEY,
      { index: parameterIndex, getValue },
      target,
      propertyName,
    );
  };
}

export function ChainKeyToString() {
  return ChainKey((v) => v.toString());
}

const promisesMap = new Map<unknown, Promise<unknown>>();

export function PromiseChain(chainKey?: string) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    const method = descriptor.value!;
    let meta: ChainKeyMetadata | undefined;

    if (!chainKey) {
      meta = Reflect.getOwnMetadata(METADATA_KEY, target, propertyName);

      if (meta === undefined) {
        throw new Error(
          `ChainKey decorator must be applied to one of parameters of ${propertyName.toString()}`,
        );
      }
    }

    descriptor.value = function (...args: unknown[]) {
      let finalChainKey;
      if (chainKey) {
        finalChainKey = chainKey;
      } else {
        const chainKeyParameter = args[meta!.index];
        finalChainKey = meta!.getValue
          ? meta!.getValue(chainKeyParameter)
          : chainKeyParameter;
      }
      const existingPromise =
        promisesMap.get(finalChainKey) || Promise.resolve();
      const promise = existingPromise
        .catch((err) => err)
        .then(() => method.apply(this, args));
      promisesMap.set(finalChainKey, promise);
      return promise;
    };

    return descriptor;
  };
}

PromiseChain.clearKey = (key: unknown) => {
  promisesMap.delete(key);
};
