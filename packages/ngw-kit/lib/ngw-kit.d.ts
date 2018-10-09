import { NgwConnector } from '@nextgis/ngw-connector';
import { WebMap, StarterKit } from '@nextgis/webmap';
export interface NgwConfig {
    applicationUrl: string;
    assetUrl: string;
    amdUrl: string;
    id: number;
}
export interface NgwKitOptions {
    baseUrl?: string;
    pixelRadius?: number;
    resourceId?: number;
    auth?: {
        login: string;
        password: string;
    };
}
export declare class NgwKit implements StarterKit {
    options: NgwKitOptions;
    url: string;
    resourceId: number;
    connector: NgwConnector;
    pixelRadius: number;
    constructor(options?: NgwKitOptions);
    getSettings(): Promise<{}>;
    onMapClick(ev: any, webMap: WebMap): void;
    sendIdentifyRequest(ev: any, webMap: WebMap, options?: {
        layers?: string[];
    }): Promise<{
        [x: string]: any;
    }>;
    private _updateItemsUrl;
}
export declare function fixUrlStr(url: string): string;
