import type { RuntimeParams } from '@nextgis/webmap';

import type { Params, StateData } from './interfaces';

export class UrlRuntimeParams<P extends Params = Params>
  implements RuntimeParams<P>
{
  private _params = {} as P;

  get(name: keyof P): string {
    return this.params()[name];
  }

  params(): P {
    const params: Params = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      params[key] = value || true;
    });
    this._params = params as P;
    return this._params;
  }

  set(key: keyof P, value: string): StateData<P> {
    return this.update({ [key]: value } as Partial<P>);
  }

  update(params: Partial<P>): StateData<P> {
    const searchParams = new URLSearchParams(location.search);

    Object.keys(params).forEach((key) => {
      const value = params[key as keyof P];
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
        this._params[key as keyof P] = value;
      }
    });

    const search = '?' + searchParams.toString();
    const data: StateData<P> = {
      state: { url: search, params: this._params },
      url: search,
    };
    this._pushState(data);

    return data;
  }

  remove(name: string): StateData<P> {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete(name);
    const search = searchParams.toString() ? '?' + searchParams.toString() : '';

    delete this._params[name];

    const data: StateData<P> = {
      state: { url: search, type: 'remove' },
      url: search,
    };
    this._pushState(data);

    return data;
  }

  private _pushState(data: StateData<P>): void {
    if (history) {
      history.replaceState(null, document.title, data.url);
    }
  }
}
