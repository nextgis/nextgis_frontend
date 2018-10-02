import { MapClickEvent } from './MapAdapter';
import { WebMap } from '../webmap';
export interface TreeItem {
    item_type: 'root' | 'group' | 'layer';
    display_name?: string;
    id?: number;
    _layer?: any;
}
export interface TreeGroup extends TreeItem {
    item_type: 'root' | 'group';
    group_expanded?: boolean;
    children: Array<TreeLayer | TreeGroup>;
}
export interface TreeLayer extends TreeItem {
    item_type: 'layer';
    layer_adapter: 'image' | 'tile';
    layer_enabled: boolean;
    draw_order_position: any;
    layer_max_scale_denom: any;
    layer_min_scale_denom: any;
    layer_style_id: number;
    layer_transparency: any;
    layer_url: string;
}
export interface AppSettings {
    extent_left?: number;
    extent_right?: number;
    extent_bottom?: number;
    extent_top?: number;
    draw_order_enabled?: any;
    bookmark_resource?: any;
    root_item?: TreeGroup;
}
export interface StarterKit {
    getSettings?(): Promise<AppSettings | false>;
    getLayerAdapters?(): Promise<any>;
    onMapClick?(evt: MapClickEvent, webMap?: WebMap): any;
}
