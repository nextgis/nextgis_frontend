export class CancelError extends Error {
  name = 'CancelError';

  constructor() {
    super();
    Object.setPrototypeOf(this, CancelError.prototype);
  }
}
