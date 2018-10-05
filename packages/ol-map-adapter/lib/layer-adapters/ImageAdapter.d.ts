import { LayerAdapter } from '@nextgis/webmap';
export declare class ImageAdapter implements LayerAdapter {
    name: string;
    addLayer(options?: any): any;
}
export declare function queryToObject(str: string): {
    [name: string]: any;
};
