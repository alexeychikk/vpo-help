import { filterMapInPairs } from './filterMapInPairs';

class Animal {
  id: string;
  compat: Record<string, boolean>;

  constructor(id: string, compat: Record<string, boolean>) {
    this.id = id;
    this.compat = compat;
  }

  isCompatible(key: string): boolean {
    return !!this.compat[key];
  }
}

test('returns elements that accepted by predicate', () => {
  const animals: Record<string, Animal> = {
    a: new Animal('a', { c: true, e: true }),
    b: new Animal('b', { d: true, e: true }),
    c: new Animal('c', { a: true, d: true }),
    f: new Animal('f', {}),
    d: new Animal('d', { b: true, c: true }),
    e: new Animal('e', { a: true, b: true }),
    x: new Animal('x', {}),
  };

  const predicate = jest.fn((a1, a2) => a1.isCompatible(a2.id));
  const result = filterMapInPairs(animals, predicate);

  expect(JSON.parse(JSON.stringify(result))).toEqual(
    JSON.parse(
      JSON.stringify({
        a: new Animal('a', { c: true, e: true }),
        b: new Animal('b', { d: true, e: true }),
        c: new Animal('c', { a: true, d: true }),
        d: new Animal('d', { b: true, c: true }),
        e: new Animal('e', { a: true, b: true }),
      }),
    ),
  );

  const { length } = Object.keys(animals);
  const maxTimesCalled = (length * (length - 1)) / 2;
  expect(predicate.mock.calls.length).toBeLessThanOrEqual(maxTimesCalled);
});
