import { noop } from 'lodash';

export class Timer {
  protected timeout?: ReturnType<typeof setTimeout>;
  protected timeLeft?: number;
  protected initialTimeLeft: number;
  protected startedAt?: Date;
  protected onTimeout: () => void;

  constructor(options: { onTimeout: () => void; initialTimeLeft: number }) {
    this.onTimeout = options.onTimeout;
    this.initialTimeLeft = options.initialTimeLeft;
  }

  get isRunning(): boolean {
    return !!this.timeout;
  }

  get isSuspended(): boolean {
    return !this.timeout && this.timeLeft !== undefined;
  }

  get isStopped(): boolean {
    return !this.timeout && this.startedAt === undefined;
  }

  get remainingTime(): number {
    return this.timeLeft || 0;
  }

  start(timeLeft = this.initialTimeLeft) {
    this.stop();
    this.timeout = setTimeout(() => {
      this.stop();
      this.onTimeout();
    }, timeLeft);
    this.timeLeft = timeLeft;
    this.startedAt = new Date();
  }

  stop() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = undefined;
    this.timeLeft = undefined;
    this.startedAt = undefined;
  }

  suspend() {
    if (this.isSuspended || !this.isRunning) return;
    clearTimeout(this.timeout!);
    this.timeout = undefined;
    this.timeLeft = this.timeLeft! - (Date.now() - this.startedAt!.getTime());
  }

  resume() {
    if (!this.isSuspended) return;
    this.start(this.timeLeft!);
  }
}

export class FakeTimer extends Timer {
  constructor() {
    super({ onTimeout: noop, initialTimeLeft: Infinity });
  }

  start(timeLeft = this.initialTimeLeft) {
    this.timeout = {} as Timer['timeout'];
    this.timeLeft = timeLeft;
    this.startedAt = new Date();
  }

  stop() {
    this.timeout = undefined;
    this.timeLeft = undefined;
    this.startedAt = undefined;
  }

  suspend() {
    if (this.isSuspended || !this.isRunning) return;
    this.timeout = undefined;
  }

  resume() {
    if (!this.isSuspended) return;
    this.start(this.timeLeft!);
  }
}
