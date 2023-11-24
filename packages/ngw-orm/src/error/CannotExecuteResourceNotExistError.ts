import type { Connection } from '../connection/Connection';

export class CannotExecuteResourceNotExistError extends Error {
  name = 'CannotExecuteResourceNotExistError';

  constructor(resource: string | number, connection: Connection) {
    super();
    Object.setPrototypeOf(this, CannotExecuteResourceNotExistError.prototype);
    this.message = `Cannot find resource "${resource}" on "${connection.baseUrl}" connection.`;
  }
}
