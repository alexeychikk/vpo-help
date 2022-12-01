import { isClass } from './isClass';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClassGetters<Class extends new (...args: any) => any>(
  classParam: Class,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { name: string; value: () => any }[] {
  let proto = classParam.prototype;
  let descriptors: { [x: string]: PropertyDescriptor } = {};

  while (proto) {
    descriptors = {
      ...Object.getOwnPropertyDescriptors(proto),
      ...descriptors,
    };

    const parentClass = Object.getPrototypeOf(proto).constructor;
    if (!isClass(parentClass) || parentClass === Object) {
      break;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return Object.entries(descriptors)
    .filter(([key, descriptor]) => key !== 'constructor' && descriptor.get)
    .map(([key, descriptor]) => ({ name: key, value: descriptor.get! }));
}
