import { Timer } from './timer';

jest.useFakeTimers();

test('runs callback on timeout', async () => {
  const callback = jest.fn();

  const timer = new Timer({ onTimeout: callback, initialTimeLeft: 1000 });
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(true);
  expect(callback).toHaveBeenCalledTimes(0);

  timer.start();
  expect(timer.isRunning).toBe(true);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(false);
  expect(callback).toHaveBeenCalledTimes(0);

  jest.advanceTimersByTime(1001);
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(true);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('can be stopped before time runs out', async () => {
  const callback = jest.fn();

  const timer = new Timer({ onTimeout: callback, initialTimeLeft: 1000 });
  timer.start();

  jest.advanceTimersByTime(500);
  timer.stop();

  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(true);
  expect(callback).toHaveBeenCalledTimes(0);

  jest.advanceTimersByTime(501);
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(true);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('can be suspended and resumed', async () => {
  const callback = jest.fn();

  const timer = new Timer({ onTimeout: callback, initialTimeLeft: 1000 });
  timer.start();

  jest.advanceTimersByTime(500);
  timer.suspend();

  expect(timer.remainingTime).toEqual(500);
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(true);
  expect(timer.isStopped).toBe(false);
  expect(callback).toHaveBeenCalledTimes(0);

  jest.advanceTimersByTime(501);
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(true);
  expect(timer.isStopped).toBe(false);
  expect(callback).toHaveBeenCalledTimes(0);

  timer.resume();
  jest.advanceTimersByTime(501);
  expect(timer.isRunning).toBe(false);
  expect(timer.isSuspended).toBe(false);
  expect(timer.isStopped).toBe(true);
  expect(callback).toHaveBeenCalledTimes(1);
});
