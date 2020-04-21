/**
 * Thrown when consumer tries to connect when he already connected.
 */
export class CancelError extends Error {
  name = 'CancelError';

  constructor() {
    super();
    Object.setPrototypeOf(this, CancelError.prototype);
  }
}
