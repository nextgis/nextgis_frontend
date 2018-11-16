import { LayerAdapter } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';
export declare class TileAdapter extends BaseAdapter implements LayerAdapter {
    name: string;
    addLayer(options?: any): TileLayer;
}
