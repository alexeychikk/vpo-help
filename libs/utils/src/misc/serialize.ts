import type { ObjectIdLike } from 'bson';
// MODIFIED https://github.com/tamj0rd2/dto/blob/master/src/dto.ts

type IsOptional<T> = Extract<T, undefined> extends never ? false : true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any;
type IsFunction<T> = T extends Func ? true : false;
type IsValueType<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | Func
  | Date
  | ObjectIdLike
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Array<any>
  ? true
  : false;

type ReplaceDate<T> = T extends Date ? string : T;
type ReplaceObjectId<T> = T extends ObjectIdLike ? string : T;
type ReplaceArray<T> = T extends Array<infer X> ? Dto<X>[] : T;

type ExcludeFuncsFromObj<T> = Pick<
  T,
  { [K in keyof T]: IsFunction<T[K]> extends true ? never : K }[keyof T]
>;

type Dto<T> = IsFunction<T> extends true
  ? never
  : IsOptional<T> extends true
  ? Serialized<Exclude<T, undefined>> | undefined
  : Serialized<T>;

export type Serialized<T> = IsValueType<T> extends true
  ? ReplaceDate<ReplaceObjectId<ReplaceArray<T>>>
  : { [K in keyof ExcludeFuncsFromObj<T>]: Dto<T[K]> };

export function serialize<T>(obj: T): Serialized<T> {
  return JSON.parse(JSON.stringify(obj));
}
