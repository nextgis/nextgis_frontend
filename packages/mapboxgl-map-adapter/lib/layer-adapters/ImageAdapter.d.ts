import { LayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
export declare class ImageAdapter extends BaseAdapter implements LayerAdapter {
    addLayer(options?: ImageAdapterOptions): string;
}
