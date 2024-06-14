export class AbortError extends Error {
  constructor(message = 'AbortError') {
    super(message);
    this.name = 'AbortError';
  }
}
