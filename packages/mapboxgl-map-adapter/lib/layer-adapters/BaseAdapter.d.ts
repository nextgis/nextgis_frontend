import { LayerAdapter } from '@nextgis/webmap';
import { Map } from 'mapbox-gl';
export declare abstract class BaseAdapter implements LayerAdapter {
    map: Map;
    name: string;
    options: any;
    constructor(map: any, options?: any);
    addLayer(options?: any): string;
}
