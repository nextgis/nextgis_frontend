import { LayerAdapter } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
export declare class MvtAdapter extends BaseAdapter implements LayerAdapter {
    addLayer(options?: any): string;
}
