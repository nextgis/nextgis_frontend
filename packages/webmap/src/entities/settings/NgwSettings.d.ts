import { AppOptions } from '../../interfaces/WebMapApp';
import { AppSettings, Settings } from '../../interfaces/AppSettings';
export declare class NgwSettings implements AppSettings {
    private _apiConnector;
    getSettings(appConfig?: AppOptions): Promise<Settings | false>;
    private _apiConnect;
}
