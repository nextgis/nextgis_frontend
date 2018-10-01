import { NgwConnector } from '@nextgis/ngw-connector';
export interface NgwConfig {
    applicationUrl: string;
    assetUrl: string;
    amdUrl: string;
    id: number;
}
export declare class NgwKit {
    url: string;
    resourceId: number;
    connector: NgwConnector;
    constructor(options?: any);
    getSettings(): Promise<{}>;
    private _updateItemsUrl;
}
export declare function fixUrlStr(url: string): string;
