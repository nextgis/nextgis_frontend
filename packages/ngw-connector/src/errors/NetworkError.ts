/**
 * Thrown when...
 */
export class NetworkError extends Error {
  name = 'NetworkError';

  constructor(url: string) {
    super();
    Object.setPrototypeOf(this, NetworkError.prototype);
    this.message = `Unable to request ${url}.
    Possibly invalid NGW URL entered or CORS not configured to get request from ${location.origin}`; // /control-panel/cors
  }
}
