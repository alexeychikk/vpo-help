export const resolveUntil = async <T>(
  fn: (resolve: (payload: T) => void, reject: (err: Error) => void) => void,
  {
    maxWait = 1500,
    rejectMessage = `resolveUntil failed: promise was not resolved in ${maxWait}ms`,
  }: { maxWait?: number; rejectMessage?: string } = {},
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(rejectMessage));
    }, maxWait);

    try {
      fn(
        (payload) => {
          clearTimeout(timeout);
          resolve(payload);
        },
        (err) => {
          clearTimeout(timeout);
          reject(err);
        },
      );
    } catch (e) {
      clearTimeout(timeout);
      reject(e);
    }
  });
};
