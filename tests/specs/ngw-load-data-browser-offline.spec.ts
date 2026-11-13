import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadData } from '../../packages/ngw-connector/src/utils/loadData';
import { NetworkError } from '../../packages/ngw-connector/src/errors/NetworkError';
import { NgwError } from '../../packages/ngw-connector/src/errors/NgwError';

import type { RequestOptions } from '../../packages/ngw-connector/src/interfaces';

const url = 'https://example.invalid/api/resource';

class OfflineXHR {
  static requests: OfflineXHR[] = [];
  static last(): OfflineXHR {
    const result = this.requests[this.requests.length - 1];
    if (!result) throw new Error('No XMLHttpRequest created');
    return result;
  }

  readonly headers: Record<string, string> = {};
  readonly upload = { onprogress: null as ((e: ProgressEvent) => void) | null };
  onload: (() => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  status = 0;
  statusText = '';
  responseText = '';
  response: unknown;
  responseType: XMLHttpRequestResponseType = '';
  withCredentials = false;
  method = '';
  requestedUrl = '';
  async = false;
  body: Document | XMLHttpRequestBodyInit | null = null;
  aborted = false;

  constructor() {
    OfflineXHR.requests.push(this);
  }

  open(method: string, requestedUrl: string, async: boolean): void {
    this.method = method;
    this.requestedUrl = requestedUrl;
    this.async = async;
  }

  setRequestHeader(name: string, value: string): void {
    this.headers[name] = value;
  }

  send(body: Document | XMLHttpRequestBodyInit | null): void {
    this.body = body;
  }

  abort(): void {
    this.aborted = true;
  }

  respond(status: number, body = '', statusText = ''): void {
    this.status = status;
    this.statusText = statusText;
    this.responseText = body;
    this.onload?.();
  }

  fail(status = 0): void {
    this.status = status;
    this.onerror?.(new Event('error'));
  }
}

describe('NGW browser HTTP transport without network requests', () => {
  let success = vi.fn<(data: unknown) => void>();
  let failure = vi.fn<(reason?: unknown) => void>();
  let cancel = vi.fn<(cancelHandler: () => void) => void>();

  beforeEach(() => {
    OfflineXHR.requests = [];
    vi.stubGlobal('XMLHttpRequest', OfflineXHR);
    success = vi.fn<(data: unknown) => void>();
    failure = vi.fn<(reason?: unknown) => void>();
    cancel = vi.fn<(cancelHandler: () => void) => void>();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const send = (options: RequestOptions = {}) => {
    loadData(url, success, options, failure, cancel);
    return OfflineXHR.last();
  };

  it('uses an asynchronous GET by default', () => {
    const xhr = send();
    expect(xhr.method).toBe('GET');
    expect(xhr.requestedUrl).toBe(url);
    expect(xhr.async).toBe(true);
    expect(xhr.body).toBeNull();
    expect(cancel).toHaveBeenCalledWith(expect.any(Function));
  });

  it('serializes object payloads to JSON for POST requests', () => {
    const xhr = send({ method: 'POST', data: { resource: 42, visible: true } });
    expect(xhr.method).toBe('POST');
    expect(xhr.body).toBe('{"resource":42,"visible":true}');
  });

  it('sends already serialized strings without modification', () => {
    const xhr = send({ method: 'PATCH', data: '{"name":"updated"}' });
    expect(xhr.body).toBe('{"name":"updated"}');
  });

  it('applies headers and credentials', () => {
    const xhr = send({
      headers: { Authorization: 'Bearer secret', Accept: 'application/json' },
      withCredentials: true,
    });
    expect(xhr.headers).toEqual({
      Authorization: 'Bearer secret', Accept: 'application/json',
    });
    expect(xhr.withCredentials).toBe(true);
  });

  it('parses a successful JSON response', () => {
    send().respond(200, '{"id":7,"name":"sample"}');
    expect(success).toHaveBeenCalledWith({ id: 7, name: 'sample' });
    expect(failure).not.toHaveBeenCalled();
  });

  it('returns non-JSON successful responses as text', () => {
    send().respond(200, 'OK');
    expect(success).toHaveBeenCalledWith('OK');
  });

  it.each([200, 204, 205])('treats HTTP %i with an empty body as undefined', (status) => {
    send().respond(status, '');
    expect(success).toHaveBeenCalledOnce();
    expect(success).toHaveBeenCalledWith(undefined);
  });

  it('delivers the unmodified Blob response when requested', () => {
    const xhr = send({ responseType: 'blob' });
    const blob = new Blob(['offline-image'], { type: 'image/png' });
    xhr.response = blob;
    xhr.respond(200);
    expect(xhr.responseType).toBe('blob');
    expect(success).toHaveBeenCalledWith(blob);
  });

  it('turns structured HTTP errors into NgwError with the server details', () => {
    send().respond(403, JSON.stringify({
      title: 'Permission denied', message: 'Access prohibited', detail: 'Private resource',
    }), 'Forbidden');
    expect(success).not.toHaveBeenCalled();
    expect(failure).toHaveBeenCalledOnce();
    const error = failure.mock.calls[0][0] as NgwError;
    expect(error).toBeInstanceOf(NgwError);
    expect(error.status_code).toBe(403);
    expect(error.title).toBe('Permission denied');
    expect(error.message).toBe('Access prohibited');
  });

  it('keeps the HTTP status and plain-text body for unstructured errors', () => {
    send().respond(502, 'Bad gateway upstream', 'Bad Gateway');
    expect(failure).toHaveBeenCalledOnce();
    const error = failure.mock.calls[0][0] as NgwError;
    expect(error.status_code).toBe(502);
    expect(error.title).toBe('HTTP 502');
    expect(error.message).toBe('Bad gateway upstream');
  });

  it('uses the HTTP status text if there is no response body', () => {
    send().respond(404, '', 'Not Found');
    const error = failure.mock.calls[0][0] as NgwError;
    expect(error.status_code).toBe(404);
    expect(error.message).toBe('Not Found');
  });

  it('translates status-zero network failures to NetworkError', () => {
    send().fail();
    expect(failure).toHaveBeenCalledOnce();
    expect(failure.mock.calls[0][0]).toBeInstanceOf(NetworkError);
  });

  it('preserves the original error event for nonzero-status transport failures', () => {
    send().fail(503);
    expect(failure.mock.calls[0][0]).toBeInstanceOf(Event);
  });

  it('wires the cancellation callback to the active request', () => {
    const xhr = send();
    const abort = cancel.mock.calls[0][0];
    abort();
    expect(xhr.aborted).toBe(true);
  });

  it('reports upload percentages only for computable progress', () => {
    const onProgress = vi.fn<(percentComplete: number, event: ProgressEvent) => void>();
    const xhr = send({ method: 'POST', onProgress });
    const progress = new ProgressEvent('progress', {
      lengthComputable: true, loaded: 10, total: 40,
    });
    xhr.upload.onprogress?.(progress);
    expect(onProgress).toHaveBeenCalledWith(25, progress);
    xhr.upload.onprogress?.(new ProgressEvent('progress'));
    expect(onProgress).toHaveBeenCalledOnce();
  });

  it('sends uploaded files and additional form fields in FormData', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const xhr = send({ method: 'POST', file, data: { description: 'sample' } });
    expect(xhr.body).toBeInstanceOf(FormData);
    const body = xhr.body as FormData;
    expect(body.get('file')).toBeInstanceOf(File);
    expect((body.get('file') as File).name).toBe('test.txt');
    expect(body.get('description')).toBe('sample');
  });
});
