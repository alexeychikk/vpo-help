// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClassGetters<Class extends new (...args: any) => any>(
  classParam: Class,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { name: string; value: () => any }[] {
  const descriptors = Object.getOwnPropertyDescriptors(classParam.prototype);
  return Object.entries(descriptors)
    .filter(([key, descriptor]) => key !== 'constructor' && descriptor.get)
    .map(([key, descriptor]) => ({ name: key, value: descriptor.get! }));
}
