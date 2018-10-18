import { LayerAdapter } from '@nextgis/webmap';
import { GeoJSON } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';
export declare class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {
    name: string;
    addLayer(options?: any): GeoJSON<any>;
}
