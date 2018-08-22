import { Ngw } from '@nextgis/api-connector';

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export class NgwKit {

  url: string;
  resourceId: number;
  connector: Ngw;

  constructor(options?) {
    this.url = options.baseUrl;
    this.resourceId = options.resourceId;
    this.connector = new Ngw({ baseUrl: this.url });
  }

  getSettings() {
    return new Promise((resolve) => {
      this.connector.request('resource.item', (data) => {
        const webmap = data.webmap;
        if (webmap) {

          this._updateItemsUrl(webmap.root_item)

          resolve(data.webmap);
        }
      }, { id: this.resourceId });
    });
  }

  private _updateItemsUrl(item) {
    if (item) {
      if (item.children) {
        item.children.forEach((x) => this._updateItemsUrl(x));
      } else if (item.item_type === 'layer' && item.layer_adapter === 'image') {
        const url = fixUrlStr(this.url + '/api/component/render/image');
        item.url = url;
      }
    }
  }
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
