import Ngw from '@ngw-front/api-connector';

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
        if (data && data.webmap) {
          resolve(data.webmap);
        }
      }, { id: this.resourceId });
    });
  }
}
