import { LayerAdapter } from '@nextgis/webmap';
import { TileAdapter } from './TileAdapter';
export declare class OsmAdapter extends TileAdapter implements LayerAdapter {
    addLayer(options?: any): string;
}
