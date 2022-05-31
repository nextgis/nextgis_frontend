import { NgwError } from './NgwError';

/**
 * Thrown when ...
 */
export class NetworksResponseError extends NgwError {
  message =
    'There is no response from the server or problem connecting to server.';
  title = 'Network error';
  detail = 'Check network connectivity and try again later.';

  constructor(obj?: Partial<NetworksResponseError>) {
    super(obj);
    Object.setPrototypeOf(this, NetworksResponseError.prototype);
  }
}
