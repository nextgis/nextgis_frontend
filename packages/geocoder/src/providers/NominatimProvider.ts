import { fixUrlStr } from '@nextgis/utils';

import { BaseProvider } from './BaseProvider';

import type { BaseProviderOptions } from './BaseProviderOptions';
import type { ResultItem } from '../types/ResultItem';
import type { SearchItem } from '../types/SearchItem';
import type { LngLatArray } from '@nextgis/utils';
import type { FeatureCollection } from 'geojson';

export class NominatimProvider extends BaseProvider {
  searchUrl = 'https://nominatim.openstreetmap.org';

  private _abort: (() => void)[] = [];

  constructor(options?: BaseProviderOptions) {
    super(options);
    if (options && options.searchUrl) {
      this.searchUrl = options.searchUrl;
    }
  }

  abort(): void {
    this._abort.forEach((x) => x());
    this._abort = [];
  }

  async *search(val: string): AsyncGenerator<SearchItem, void, unknown> {
    // RFC2616 accept - language string
    const url = fixUrlStr(
      // `${this.baseUrl}/search?format=geojson&polygon_geojson=1${window.locale === 'ru' ? '&accept-language=ru-RU,en-US' : ''}&q=${val}`
      `${this.searchUrl}/search?format=geojson&polygon_geojson=1&q=${val}`,
    );
    const request = new Promise<SearchItem[]>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = () => {
        try {
          const geojson = JSON.parse(xhr.responseText) as FeatureCollection;
          const features: SearchItem[] = geojson.features.map((x) => {
            return {
              geom: x,
              extent: x.bbox,
              text: x.properties && x.properties.display_name,
              query: val,
            };
          });
          resolve(features);
        } catch (er) {
          reject(er);
        }
      };

      xhr.onerror = (er) => {
        reject(er);
      };

      this._abort.push(xhr.abort);

      xhr.send();
    }).catch((er) => {
      if (er.name === 'CancelError') {
        //
      }
      throw er;
    });
    const items = await request;
    if (items) {
      for (const i of items) {
        i.result = () => this.result(i);
        yield i;
      }
    }
  }

  result(model: SearchItem): Promise<ResultItem> {
    return Promise.resolve({
      text: model.text,
      extent: model.extent || [],
      geom: model.geom,
    });
  }

  async *reverse(
    coordinates: LngLatArray,
  ): AsyncGenerator<SearchItem, void, unknown> {
    const [lng, lat] = coordinates;
    const url = fixUrlStr(
      `${this.searchUrl}/reverse?format=geojson&lat=${lat}&lon=${lng}`,
    );
    const request = new Promise<SearchItem>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = () => {
        try {
          const geojson = JSON.parse(xhr.responseText) as FeatureCollection;
          const feature = geojson.features[0];
          const result: SearchItem = {
            geom: feature,
            extent: feature.bbox,
            text: feature.properties && feature.properties.display_name,
            query: `${lat}, ${lng}`,
          };
          resolve(result);
        } catch (er) {
          reject(er);
        }
      };
      xhr.onerror = (er) => {
        reject(er);
      };

      this._abort.push(xhr.abort);

      xhr.send();
    }).catch((er) => {
      if (er.name === 'CancelError') {
        //
      }
      throw er;
    });

    const item = await request;
    if (item) {
      item.result = () => this.result(item);
      yield item;
    }
  }
}
