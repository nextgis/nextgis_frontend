import { RuntimeParams } from '@nextgis/webmap';
import { Params, StateData } from './interfaces';

export class UrlRuntimeParams implements RuntimeParams {
  private _params: Params = {};

  get(name: string): any {
    return this.params()[name];
  }

  params(): Record<string, string> {
    // if (this._params) {
    //   return this._params;
    // }
    const params: Params = {};
    window.location.href.replace(/[?&]+(\w+)([^&]*)/gi, function (m, key) {
      params[key] = true;
      return ''; // does not matter
    });
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        params[key] = decodeURIComponent(value);
        return ''; // does not matter
      },
    );
    this._params = params;
    return params;
  }

  set(name: string, value: string): StateData {
    if (value) {
      let search: string;
      const urlComponent = encodeURIComponent(value);
      const existUrlParam = this.get(name);
      if (existUrlParam) {
        search = location.search.replace(
          new RegExp('([?|&]' + name + '=)' + '(.+?)(&|$)'),
          '$1' + urlComponent + '$3',
        );
      } else if (location.search.length) {
        search = location.search + '&' + name + '=' + urlComponent;
      } else {
        search = '?' + name + '=' + urlComponent;
      }
      const params: Params = {};
      params[name] = value;
      this._params[name] = value;
      const data: StateData = { state: { url: search, params }, url: search };
      this._pushState(data);
      return data;
    } else {
      return this.remove(name);
    }
  }

  remove(name: string): StateData {
    const sourceUrl = location.search;
    let rtn = sourceUrl.split('?')[0];
    let param: string;
    let paramsArr: string[];
    const queryString =
      sourceUrl.indexOf('?') !== -1 ? sourceUrl.split('?')[1] : '';
    if (queryString !== '') {
      paramsArr = queryString.split('&');
      for (let i = paramsArr.length - 1; i >= 0; i -= 1) {
        param = paramsArr[i].split('=')[0];
        if (param === name) {
          paramsArr.splice(i, 1);
        }
      }
      rtn = rtn + '?' + paramsArr.join('&');
    }

    delete this._params[name];

    const data: StateData = { state: { url: rtn, type: 'remove' }, url: rtn };
    this._pushState(data);

    return data;
  }

  private _pushState(data: StateData): void {
    if (history) {
      history.replaceState(null, document.title, data.url);
    }
  }
}
