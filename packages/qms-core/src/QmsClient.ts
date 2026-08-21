import { prepareQmsTmsLayer, prepareQmsWmsLayer } from './utils';

import type {
  QmsLayer,
  QmsRequestOptions,
  QmsSearchOptions,
  QmsSearchService,
  QmsService,
} from './interfaces';

export const QMS_URL = 'https://qms.nextgis.com';

export class QmsClient {
  static url = QMS_URL;

  readonly url: string;

  constructor() {
    this.url = QmsClient.url.replace(/\/$/, '').trim();
  }

  async getService(
    id: number,
    options: QmsRequestOptions = {},
  ): Promise<QmsService> {
    const service = await this._getJson<QmsService>(
      `${this.url}/api/v1/geoservices/${id}`,
      options,
    );
    if (service.type !== 'tms' && service.type !== 'wms') {
      throw new Error('Unsupported QMS service type.');
    }
    return service;
  }

  async getLayer(
    id: number,
    options: QmsRequestOptions = {},
  ): Promise<QmsLayer> {
    const service = await this.getService(id, options);
    if (service.type === 'tms') {
      return prepareQmsTmsLayer(service);
    }
    return prepareQmsWmsLayer(service);
  }

  async searchServices(
    search: string,
    { limit = 10, offset, signal, type }: QmsSearchOptions,
  ): Promise<QmsSearchService[]> {
    const params = new URLSearchParams({
      search,
      limit: String(limit),
      type,
    });
    if (offset !== undefined) {
      params.set('offset', String(offset));
    }
    const response = await this._getJson<{ results: QmsSearchService[] }>(
      `${this.url}/api/v1/geoservices/?${params}`,
      { signal },
    );
    return response.results;
  }

  private async _getJson<T>(
    url: string,
    { signal }: QmsRequestOptions,
  ): Promise<T> {
    const response = await fetch(url, {
      signal,
    });
    if (!response.ok) {
      throw new Error(
        `QMS request failed with status ${response.status}: ${url}`,
      );
    }
    return response.json() as Promise<T>;
  }
}
