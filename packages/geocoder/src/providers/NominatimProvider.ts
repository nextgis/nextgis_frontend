import { fixUrlStr } from '@nextgis/utils';

import { BaseProvider } from './BaseProvider';

import type { LngLatArray } from '@nextgis/utils';
import type { FeatureCollection } from 'geojson';

import type { ResultItem } from '../types/ResultItem';
import type { SearchItem } from '../types/SearchItem';

import type { BaseProviderOptions } from './BaseProviderOptions';

/**
 * Nominatim based options {@link https://nominatim.org/release-docs/latest/api/Search}
 */
export interface NominatimProviderOptions extends BaseProviderOptions {
  /** Browser language string */
  language?: string;
  /** Comma-separated list of country codes {}*/
  countrycodes?: string;
  /** Limit the number of search results */
  limit?: number;
  /** Include address details in the results */
  addressdetails?: boolean;
  /** Restrict the results to the specified viewbox */
  bounded?: boolean;
  /** Focuses the search on the given area [minLon, minLat, maxLon, maxLat] */
  viewbox?: [number, number, number, number];
}

export class NominatimProvider
  extends BaseProvider<NominatimProviderOptions>
  implements NominatimProviderOptions
{
  searchUrl = 'https://nominatim.openstreetmap.org';
  private _abortControllers: AbortController[] = [];

  constructor(public options?: NominatimProviderOptions) {
    super();
    if (options && options.searchUrl) {
      this.searchUrl = options.searchUrl;
    }
  }

  abort(): void {
    this._abortControllers.forEach((controller) => {
      controller.abort();
    });
    this._abortControllers = [];
  }

  async *search(val: string): AsyncGenerator<SearchItem, void, unknown> {
    const params = new URLSearchParams({
      format: 'geojson',
      polygon_geojson: '1',
      q: val,
      limit: this.options?.limit?.toString() || '10',
    });

    if (this.options?.countrycodes) {
      params.append('countrycodes', this.options.countrycodes);
    }
    if (this.options?.addressdetails) {
      params.append('addressdetails', '1');
    }
    if (this.options?.language) {
      params.append('accept-language', this.options.language);
    }
    if (this.options?.bounded) {
      params.append('bounded', '1');
    }
    if (this.options?.viewbox) {
      const [minLon, minLat, maxLon, maxLat] = this.options.viewbox;
      params.append('viewbox', `${minLon},${minLat},${maxLon},${maxLat}`);
    }

    const url = fixUrlStr(`${this.searchUrl}/search?${params.toString()}`);
    const controller = new AbortController();
    this._abortControllers.push(controller);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const geojson = (await response.json()) as FeatureCollection;
      const features: SearchItem[] = geojson.features.map((x) => {
        return {
          geom: x,
          extent: x.bbox,
          text: x.properties && x.properties.display_name,
          query: val,
        };
      });

      for (const item of features) {
        item.result = () => this.result(item);
        yield item;
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // ignore
      } else {
        throw error;
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
    const params = new URLSearchParams({
      format: 'geojson',
      lat: lat.toString(),
      lon: lng.toString(),
    });

    if (this.options?.addressdetails) {
      params.append('addressdetails', '1');
    }
    if (this.options?.language) {
      params.append('accept-language', this.options.language);
    }

    const url = fixUrlStr(`${this.searchUrl}/reverse?${params.toString()}`);
    const controller = new AbortController();
    this._abortControllers.push(controller);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const geojson = (await response.json()) as FeatureCollection;
      const feature = geojson.features[0];
      const item: SearchItem = {
        geom: feature,
        extent: feature.bbox,
        text: feature.properties && feature.properties.display_name,
        query: `${lat}, ${lng}`,
      };

      item.result = () => this.result(item);
      yield item;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // ignore
      } else {
        throw error;
      }
    }
  }
}
