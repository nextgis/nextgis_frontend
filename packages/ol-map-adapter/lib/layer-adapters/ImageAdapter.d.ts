import { LayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
export declare class ImageAdapter implements LayerAdapter {
    name: string;
    layer: any;
    addLayer(options?: ImageAdapterOptions): any;
}
