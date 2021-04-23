import { fixUrlStr } from '@nextgis/utils';
import CancelablePromise from '@nextgis/cancelable-promise';
import { BaseProvider } from './BaseProvider';
import { BaseProviderOptions } from './BaseProviderOptions';
import { FeatureCollection } from 'geojson';
import { SearchItem } from '../types/SearchItem';
import { ResultItem } from '../types/ResultItem';

export class NominatimProvider extends BaseProvider {
  searchUrl = 'https://nominatim.openstreetmap.org';

  private _requests: CancelablePromise[] = [];

  constructor(options?: BaseProviderOptions) {
    super(options);
  }

  abort(): void {
    this._requests.forEach((x) => x.cancel());
    this._requests = [];
  }

  async *search(val: string): AsyncGenerator<SearchItem, void, unknown> {
    // RFC2616 accept - language string
    const url = fixUrlStr(
      // `${this.baseUrl}/search?format=geojson&polygon_geojson=1${window.locale === 'ru' ? '&accept-language=ru-RU,en-US' : ''}&q=${val}`
      `${this.searchUrl}/search?format=geojson&polygon_geojson=1&q=${val}`,
    );
    const request = new CancelablePromise<SearchItem[]>(
      (resolve, reject, onCancel) => {
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

        onCancel(() => {
          xhr.abort();
        });

        xhr.send();
      },
    ).catch((er) => {
      if (er.name === 'CancelError') {
        //
      }
      throw er;
    });
    this._requests.push(request);
    const items = await request;
    if (items) {
      for (const i of items) {
        i.result = () => this.result(i);
        yield i;
      }
    }
  }

  result(model: SearchItem): CancelablePromise<ResultItem> {
    return CancelablePromise.resolve({
      text: model.text,
      extent: model.extent || [],
      geom: model.geom,
    });
  }
}
