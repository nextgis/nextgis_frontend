import { prepareQmsTmsLayer, prepareQmsWmsLayer } from './utils';

import type { QmsLayer, QmsRequestOptions, QmsService } from './interfaces';

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
