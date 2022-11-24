// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isClass(thing: any) {
  // eslint-disable-next-line no-prototype-builtins
  return typeof thing === 'function' && !thing.hasOwnProperty('arguments');
}
