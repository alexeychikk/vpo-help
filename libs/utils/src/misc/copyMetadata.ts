import 'reflect-metadata';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const copyMetadata = (source: any, target: any): void => {
  for (const key of Reflect.getMetadataKeys(source)) {
    Reflect.defineMetadata(key, Reflect.getMetadata(key, source), target);
  }
};
