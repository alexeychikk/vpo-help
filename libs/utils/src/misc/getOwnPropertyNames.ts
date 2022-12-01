import { isClass } from './isClass';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOwnPropertyNames(proto: any) {
  const props = new Set<string>();
  while (proto) {
    Object.getOwnPropertyNames(proto).forEach((name) => {
      if (name === 'constructor') return;
      const descriptor = Object.getOwnPropertyDescriptor(proto, name)!;
      if ((descriptor.get || descriptor.set) == null) {
        props.add(name);
      }
    });

    const parentClass = Object.getPrototypeOf(proto).constructor;
    if (!isClass(parentClass) || parentClass === Object) {
      break;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return [...props];
}
