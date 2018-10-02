import { NgwConnector } from '@nextgis/ngw-connector';
import { WebMap } from '@nextgis/webmap';
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
    pixelRadius: 10;
    constructor(options?: any);
    getSettings(): Promise<{}>;
    onMapClick(ev: any, webMap: WebMap): void;
    sendIdentifyRequest(ev: any, webMap: WebMap, options?: {
        layers?: string[];
    }): Promise<{}>;
    private _updateItemsUrl;
}
export declare function fixUrlStr(url: string): string;
