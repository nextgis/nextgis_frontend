import { AppOptions } from '../../interfaces/WebMapApp';
import { AppSettings, Settings } from '../../interfaces/AppSettings';
import { NgwConfig } from '../../interfaces/NgwConfig';
import { Ngw } from '@ngw-front/api-connector';

export class NgwSettings implements AppSettings {

  private _apiConnector: Ngw = new Ngw();

  async getSettings(appConfig?: AppOptions): Promise<Settings | false> {
    const ngwConfig = appConfig.ngwConfig as NgwConfig;
    this._apiConnector.options.baseUrl = ngwConfig.applicationUrl;
    try {
      const apiSettings = await this._apiConnect(appConfig);
      if (apiSettings) {
        const settings = apiSettings as Settings;
        return settings;
      }
      return false;
    } catch (er) {
      console.log(er);
      return false;
    }
  }

  private async _apiConnect(appConfig: AppOptions): Promise<any> {
    const ngwConfig = appConfig.ngwConfig as NgwConfig;
    return new Promise((resolve) => {
      this._apiConnector.request('resource.item', (data) => {
        resolve(data);
      }, { id: ngwConfig.id });
    });
  }
}
