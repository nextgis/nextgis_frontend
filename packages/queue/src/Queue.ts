type PromiseFunc = () => Promise<any>;
type Abort = () => void;
type PromiseFuncOrPromiseWithAbortArray =
  | PromiseFunc
  | (() => [Promise<any>, Abort]);
type AbatablePromise = {
  promise: PromiseFuncOrPromiseWithAbortArray;
  abort?: Abort;
};

interface PromiseQueueOptions {
  /** Concurrent promises count */
  concurrency?: number;
  /** Time in ms */
  delay?: number;
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
  private concurrency: number;
  private activeCount: number = 0;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private delay: number;
  private toAbort: Abort[] = [];

  /**
   * @param {PromiseQueueOptions} options - Configuration options for the queue.
   */
  constructor({ concurrency = 1, delay = 0 }: PromiseQueueOptions = {}) {
    this.concurrency = concurrency;
    this.delay = delay;
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
  add(promise: PromiseFuncOrPromiseWithAbortArray, abort?: () => void): void {
    this.queue.push({ promise, abort });
    this.debouncedNext();
  }

  /**
   * Aborts all tasks in the queue that have an abort function.
   *
   * @example
   * queue.abort(); // Aborts all abortable tasks in the queue.
   */
  abort() {
    for (const abort of this.toAbort) {
      abort();
    }
    this.toAbort = [];
    this.queue = [];
    this._clearTimeout();
  }

  private debouncedNext() {
    this._clearTimeout();
    this.timeoutId = setTimeout(() => this._next(), this.delay);
  }

  private _clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private _next() {
    while (this.activeCount < this.concurrency && this.queue.length > 0) {
      const { promise, abort } = this.queue.shift()!;
      this.activeCount++;
      let toAbort = abort;
      let request: Promise<any>;
      const execute = promise();
      if (Array.isArray(execute)) {
        request = execute[0];
        toAbort = execute[1];
      } else {
        request = execute;
      }

      if (toAbort) {
        this.toAbort.push(toAbort);
      }

      request.finally(() => {
        this.activeCount--;
        if (toAbort) {
          this.toAbort = this.toAbort.filter((a) => a !== toAbort);
        }
        this.debouncedNext();
      });
    }
  }
}
