export function filterMapInPairs<T>(
  map: Record<string, T>,
  predicate: (t1: T, t2: T) => boolean,
): Record<string, T> {
  const result: Record<string, T> = {};
  const ids: string[] = [];

  // First run to create an array of id-s and compare 1st el with the rest
  for (const id in map) {
    ids.push(id);
    if (ids.length !== 1 && predicate(map[ids[0]], map[id])) {
      result[ids[0]] = map[ids[0]];
      result[id] = map[id];
    }
  }

  for (let i = 1, { length } = ids; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      if (
        (!result[ids[i]] || !result[ids[j]]) &&
        predicate(map[ids[i]], map[ids[j]])
      ) {
        result[ids[i]] = map[ids[i]];
        result[ids[j]] = map[ids[j]];
      }
    }
  }

  return result;
}
