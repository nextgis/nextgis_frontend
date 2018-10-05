import { LayerAdapter } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
export declare class TileAdapter extends BaseAdapter implements LayerAdapter {
    addLayer(options?: any): string;
}
