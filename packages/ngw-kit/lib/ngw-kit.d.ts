import NgwConnector from '@nextgis/ngw-connector';
import { WebMap, StarterKit } from '@nextgis/webmap';
export interface NgwLayerOptions {
    id: number;
    adapter?: 'IMAGE' | 'TILE';
}
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
    static updateWmsParams: (params: any, resourceId: any) => {
        resource: any;
        extent: any;
        size: string;
        timestamp: number;
    };
    static addNgwLayer(options: NgwLayerOptions, webMap: WebMap, baseUrl: any): any;
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
    private _updateItemsParams;
}
export declare function fixUrlStr(url: string): string;
