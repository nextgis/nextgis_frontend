// iimport { RuntimeParams } from '../../Interfaces/RuntimeParams';

export class UrlParams { // implements RuntimeParams {

  private _params: { [paramName: string]: any };

  getParam(name: string): any {
    return this.getParams()[name];
  }

  getParams() {
    if (this._params) {
      return this._params;
    }
    const params = {};
    window.location.href.replace(/[?&]+(\w+)([^&]*)/gi, function(m, key) {
      params[key] = true;
      return ''; // does not matter
    });
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      params[key] = decodeURIComponent(value);
      return ''; // does not matter
    });
    this._params = params;
    return params;
  }

  setParam(name, value) {
    if (value) {
      let search;
      const urlComponent = encodeURIComponent(value);
      const existUrlParam = this.getParam(name);
      if (existUrlParam) {
        search = location.search.replace(new RegExp('([?|&]' + name + '=)' + '(.+?)(&|$)'),
          '$1' + urlComponent + '$3');
      } else if (location.search.length) {
        search = location.search + '&' + name + '=' + urlComponent;
      } else {
        search = '?' + name + '=' + urlComponent;
      }
      const params = {};
      params[name] = value;
      this._params[name] = value;
      const data = { state: { url: search, params }, url: search };
      this._pushState(data);
      return data;
    } else {
      return this.removeParam(name);
    }
  }

  removeParam(name: string) {
    const sourceUrl = location.search;
    let rtn = sourceUrl.split('?')[0];
    let param;
    let paramsArr;
    const queryString = (sourceUrl.indexOf('?') !== -1) ? sourceUrl.split('?')[1] : '';
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

    const data = { state: { url: rtn, type: 'remove' }, url: rtn };
    this._pushState(data);

    return data;
  }

  private _pushState(data) {
    if (history) {
      history.replaceState(data.state, document.title, data.url);
    }
  }
}
