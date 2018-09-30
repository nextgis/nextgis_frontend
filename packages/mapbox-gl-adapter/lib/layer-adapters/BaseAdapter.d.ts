import { Map } from 'mapbox-gl';
export declare abstract class BaseAdapter {
    map: Map;
    name: string;
    options: any;
    constructor(map: any, options?: any);
    addLayer(options?: any): string;
}
