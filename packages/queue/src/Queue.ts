type PromiseFunc = (options: { signal: AbortSignal }) => Promise<any>;
type Abort = () => void;
type PromiseFuncOrPromiseWithAbortArray = (options: {
  signal: AbortSignal;
}) => ReturnType<PromiseFunc> | [ReturnType<PromiseFunc>, Abort];
type AbatablePromise = {
  id: string | number;
  timeout?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  completed?: boolean;
  abortController: AbortController;
  promise: PromiseFuncOrPromiseWithAbortArray;
  abort?: Abort;
};

interface PromiseQueueOptions {
  /** Concurrent promises count */
  concurrency?: number;
  /** Time in ms */
  delay?: number;
  limit?: number;
  timeout?: number;
  debounce?: number;
}

interface QueueAddOptions {
  id?: string | number;
  timeout?: number;
  abort?: Abort;
}

/**
 * Manages a queue of asynchronous tasks, each potentially with an abort mechanism.
 * The queue supports concurrency control and optional delay between task executions.
 *
 * @example
 * ```javascript
 * const queue = new Queue({ concurrency: 2, delay: 100 });
 *
 * const controller = new AbortController();
 * const fetchData = () => fetch('https://api.example.com/data', { signal: controller.signal });
 * queue.add(fetchData, controller.abort);
 *
 * setTimeout(() => {
 *   queue.abort();
 * }, 200);
 * ```
 *
 * @remarks
 * This queue class is designed to help manage asynchronous tasks that might need to be aborted.
 * It is ideal for scenarios where tasks are initiated based on external events and might need to be cancelled if conditions change.
 */
export class Queue {
  private queue: AbatablePromise[] = [];
  private activeRequests: AbatablePromise[] = [];
  private concurrency: number;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private resumeTimer?: ReturnType<typeof setTimeout>;
  private delay: number;
  private timeout?: number;
  private paused = false;
  private idleResolvers: Array<() => void> = [];
  readonly debounce: number;

  /**
   * @param {PromiseQueueOptions} options - Configuration options for the queue.
   */
  constructor({
    delay = 0,
    limit,
    timeout,
    debounce,
    concurrency = 1,
  }: PromiseQueueOptions = {}) {
    this.concurrency = limit ?? concurrency;
    this.delay = debounce ?? delay;
    this.debounce = this.delay;
    this.timeout = timeout;
  }

  setLimit(limit: number): void {
    this.concurrency = limit;
    this._next();
  }

  /**
   * Adds a task to the queue, which can be either a simple asynchronous function or an array containing a function and its abort handler.
   *
   * @param {PromiseFuncOrPromiseWithAbortArray} promise - The asynchronous task function or a tuple containing the task and an abort function.
   * @param {Abort} [abort] - An optional abort function for the task.
   *
   * @example
   * ```javascript
   * // Add a task without an abort function.
   * queue.add(() => new Promise(resolve => setTimeout(resolve, 1000)));
   *
   * // Add a task with an abort function.
   * const controller = new AbortController();
   * queue.add(() => fetch('https://example.com', { signal: controller.signal }), controller.abort);
   * ```
   */
  add(
    promise: PromiseFuncOrPromiseWithAbortArray,
    abort?: Abort | QueueAddOptions,
  ): void {
    const options = typeof abort === 'function' ? { abort } : abort;
    if (options?.id !== undefined) {
      this.removeById(options.id);
    }
    this.queue.push({
      id: options?.id ?? Math.random().toString(36).slice(2),
      promise,
      abort: options?.abort,
      abortController: new AbortController(),
      timeout: options?.timeout ?? this.timeout,
    });
    this.debouncedNext();
  }

  /**
   * Aborts all tasks in the queue that have an abort function.
   *
   * @example
   * queue.abort(); // Aborts all abortable tasks in the queue.
   */
  abort(): void {
    for (const item of [...this.queue, ...this.activeRequests]) {
      this.abortRequest(item);
      this.clearRequestTimeout(item);
      item.completed = true;
    }
    this.queue.length = 0;
    this.activeRequests.length = 0;
    this._clearTimeout();
    this.checkIdle();
  }

  remove(id: string | number): void {
    this.removeById(id);
  }

  clearQueue(): void {
    for (const item of this.queue) {
      this.abortRequest(item);
      item.completed = true;
    }
    this.queue.length = 0;
    this._clearTimeout();
    this.checkIdle();
  }

  waitAll(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isIdle()) {
        resolve();
      } else {
        this.idleResolvers.push(resolve);
      }
    });
  }

  pause(pauseDuration?: number): void {
    this.paused = true;
    this._clearTimeout();
    this._clearResumeTimer();
    if (pauseDuration) {
      this.resumeTimer = setTimeout(() => this.resume(), pauseDuration);
    }
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this._clearResumeTimer();
    this._next();
  }

  private debouncedNext(): void {
    if (this.paused) return;
    if (this.activeRequests.length) {
      this._next();
      return;
    }
    this._clearTimeout();
    this.timeoutId = setTimeout(() => this._next(), this.delay);
  }

  private _clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private _clearResumeTimer(): void {
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = undefined;
    }
  }

  private _next(): void {
    if (this.paused) return;
    while (this.activeRequests.length < this.concurrency && this.queue.length) {
      const item = this.queue.shift()!;
      if (item.abortController.signal.aborted) continue;
      this.activeRequests.push(item);
      if (item.timeout && item.timeout > 0) {
        item.timeoutId = setTimeout(() => {
          this.abortRequest(
            item,
            new DOMException('Request timed out', 'TimeoutError'),
          );
          this.finishRequest(item);
        }, item.timeout);
      }

      try {
        const execute = item.promise({ signal: item.abortController.signal });
        const request = Array.isArray(execute) ? execute[0] : execute;
        if (Array.isArray(execute)) {
          const abort = item.abort;
          item.abort = abort
            ? () => {
                abort();
                execute[1]();
              }
            : execute[1];
        }
        // Handle both outcomes without creating an unhandled rejection.
        Promise.resolve(request).then(
          () => this.finishRequest(item),
          () => this.finishRequest(item),
        );
      } catch (error) {
        this.finishRequest(item);
        console.error(error);
      }
    }
    this.checkIdle();
  }

  private removeById(id: string | number): void {
    this.queue = this.queue.filter((item) => {
      if (item.id !== id) return true;
      this.abortRequest(item);
      item.completed = true;
      return false;
    });
    for (const item of [...this.activeRequests]) {
      if (item.id === id) {
        this.abortRequest(item);
        this.finishRequest(item);
      }
    }
    this.checkIdle();
  }

  private abortRequest(item: AbatablePromise, reason?: unknown): void {
    if (!item.abortController.signal.aborted) {
      item.abortController.abort(reason);
    }
    item.abort?.();
  }

  private clearRequestTimeout(item: AbatablePromise): void {
    if (item.timeoutId) {
      clearTimeout(item.timeoutId);
      item.timeoutId = undefined;
    }
  }

  private finishRequest(item: AbatablePromise): void {
    if (item.completed) return;
    item.completed = true;
    this.clearRequestTimeout(item);
    this.activeRequests = this.activeRequests.filter((x) => x !== item);
    this.checkIdle();
    this._next();
  }

  private isIdle(): boolean {
    return this.queue.length === 0 && this.activeRequests.length === 0;
  }

  private checkIdle(): void {
    if (this.isIdle()) {
      this.idleResolvers.splice(0).forEach((resolve) => resolve());
    }
  }
}
