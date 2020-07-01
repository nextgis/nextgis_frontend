/**
 * Thrown when consumer tries to execute operation allowed only if connection is opened.
 */
export class CannotExecuteNotConnectedError extends Error {
  name = 'CannotExecuteNotConnectedError';

  constructor() {
    super();
    Object.setPrototypeOf(this, CannotExecuteNotConnectedError.prototype);
    this.message = `Cannot execute operation because connection is not yet established.`;
  }
}
