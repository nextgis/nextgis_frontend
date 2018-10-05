import { StarterKit } from '@nextgis/webmap';
export interface QmsOptions {
    url: string;
}
interface GeoserviceInList {
    id: number;
    guid: string;
    name: string;
    desc: string;
    type: string;
    epsg: number;
}
export declare class QmsKit implements StarterKit {
    options: QmsOptions;
    url: string;
    map: any;
    constructor(options?: QmsOptions);
    getLayerAdapters(): Promise<{
        name: string;
        createAdapter: (webmap: any) => Promise<(m: any, options: any) => void>;
    }[]>;
    getQmsServices(): Promise<GeoserviceInList[]>;
    private _createAdapter;
}
export {};
