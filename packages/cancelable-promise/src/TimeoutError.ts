export class TimeoutError extends Error {
  name = 'TimeoutError';

  constructor() {
    super();
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
