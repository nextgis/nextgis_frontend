import { WebLayerEntry } from '../WebLayerEntry';
import { MapAdapter } from './MapAdapter';
import { StarterKit } from './AppSettings';
import { MapControl } from './MapControl';
export interface MapOptions {
    target: string | HTMLElement;
    logo?: string;
    controls?: Array<string | MapControl>;
    controlsOptions?: {
        [controlName: string]: any;
    };
    minZoom?: number;
    center?: [number, number];
    bounds?: [number, number, number, number];
    zoom?: number;
}
export interface AppOptions {
    mapAdapter: MapAdapter;
    starterKits?: StarterKit[];
}
export interface WebMapAppEvents {
    'build-map': MapAdapter;
    'add-layers': WebLayerEntry;
}
