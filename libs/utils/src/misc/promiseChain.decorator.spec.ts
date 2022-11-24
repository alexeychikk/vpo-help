import { ChainKey, PromiseChain } from './promiseChain.decorator';
import { sleep } from './sleep';

class TestService {
  state: Record<string, string> = {};

  private async updateState(key: string, param: string) {
    await sleep(10);
    this.state[key] = this.state[key]
      ? `${this.state[key]},${param}`
      : `${key}:${param}`;
  }

  @PromiseChain()
  async methodResolves(@ChainKey() key: string, param: string) {
    await this.updateState(key, param);
    return param;
  }

  @PromiseChain()
  async methodRejects(@ChainKey() key: string) {
    await sleep(10);
    throw new Error(`${key} bar`);
  }

  @PromiseChain()
  async methodResolvesComplexKey(
    @ChainKey((v) => v.key) foo: { key: string; param: string },
  ) {
    await this.updateState(foo.key, foo.param);
    return foo.param;
  }

  @PromiseChain('decorator-key')
  async methodResolvesWithoutParam() {
    await this.updateState('decorator-key', 'param');
  }
}

test('chains several async calls with the same key', async () => {
  const service = new TestService();

  void service.methodResolves('key1', 'bar');
  void service.methodResolves('key2', 'qux');
  void service.methodResolves('key1', 'bat');
  void service.methodResolves('key2', 'hex');
  await service.methodResolves('key1', 'baz');
  await service.methodResolves('key2', 'tax');

  expect(service.state['key1']).toBe('key1:bar,bat,baz');
  expect(service.state['key2']).toBe('key2:qux,hex,tax');
});

test('chain is not broken if something rejects in the middle of it', async () => {
  const service = new TestService();
  const key = 'foo';
  const errorCatcher = jest.fn();

  const errorContext = async () => {
    try {
      await service.methodRejects(key);
    } catch (e) {
      errorCatcher(e);
      return e;
    }
  };

  const promiseBar = service.methodResolves(key, 'bar');
  const promiseBaz = service.methodResolves(key, 'baz');
  const promiseError = errorContext();
  const promiseQux = service.methodResolves(key, 'qux');

  await expect(service.methodResolves(key, 'tax')).resolves.toEqual('tax');
  await expect(promiseBar).resolves.toEqual('bar');
  await expect(promiseBaz).resolves.toEqual('baz');
  await expect(promiseQux).resolves.toEqual('qux');
  await expect(promiseError).resolves.toEqual(new Error('foo bar'));

  expect(service.state[key]).toBe('foo:bar,baz,qux,tax');
  expect(errorCatcher).toBeCalledWith(new Error('foo bar'));
});

test('throws error if the last call in the chain throws error', async () => {
  const service = new TestService();
  const key = 'foo';

  void service.methodResolves(key, 'bar');
  void service.methodResolves(key, 'baz');
  await expect(service.methodRejects(key)).rejects.toThrow(
    new Error('foo bar'),
  );

  expect(service.state[key]).toBe('foo:bar,baz');
});

test('chain key can be retrieved by a custom function', async () => {
  const service = new TestService();
  const key = 'foo';

  void service.methodResolvesComplexKey({ key, param: 'bar' });
  void service.methodResolves(key, 'baz');
  void service.methodRejects(key);
  await service.methodResolvesComplexKey({ key, param: 'qux' });

  expect(service.state[key]).toBe('foo:bar,baz,qux');
});

test('chains several async calls without using ChainKey decorator', async () => {
  const service = new TestService();
  const key = 'decorator-key';

  void service.methodResolvesWithoutParam();
  void service.methodResolves(key, 'baz');
  void service.methodRejects(key);
  await service.methodResolvesWithoutParam();

  expect(service.state[key]).toBe('decorator-key:param,baz,param');
});
