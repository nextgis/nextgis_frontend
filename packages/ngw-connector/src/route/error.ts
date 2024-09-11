import type { LunkwillData } from './type';

export class BaseAPIError extends Error {
  title: string;

  constructor(message: string) {
    super(message || 'Something went wrong.');
    this.name = 'BaseAPIError';
    this.title = 'Unknown API error';
    // Maintains proper stack trace for where the error was thrown (V8-specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseAPIError);
    }
  }
}

export class NetworksResponseError extends BaseAPIError {
  readonly detail: string;

  // prettier-ignore
  constructor(message?: string) {
        super(message || "There is no response from the server or problem connecting to server.");
        this.title = "Network error";
        this.detail = "Check network connectivity and try again later.";
    }
}

export class InvalidResponseError extends BaseAPIError {
  constructor(message?: string) {
    super(message || 'Something went wrong.');
    this.title = 'Unexpected server response';
  }
}

export interface ServerResponseErrorData {
  message: string;
  title?: string;
  detail?: string;
  exception?: string;
}

export class ServerResponseError extends BaseAPIError {
  readonly detail: string | null;
  readonly data: ServerResponseErrorData;

  constructor(data: ServerResponseErrorData) {
    super(data.message);
    this.title = data.title || this.title;
    this.detail = data.detail || null;
    this.data = data;
  }
}

export class LunkwillError extends Error {
  readonly title: string;
  readonly data: LunkwillData;

  // prettier-ignore
  constructor(message?: string, data: LunkwillData = {}) {
        super(message || "Unexpected error while processing long-running request.");
        this.name = "LunkwillError";
        this.title = "Long-running request error";
        this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LunkwillError);
        }
    }
}

export class LunkwillRequestCancelled extends LunkwillError {
  constructor(data: LunkwillData) {
    super('Long-running request was cancelled.', data);
  }
}

export class LunkwillRequestFailed extends LunkwillError {
  constructor(data: LunkwillData) {
    super(undefined, data);
  }
}
