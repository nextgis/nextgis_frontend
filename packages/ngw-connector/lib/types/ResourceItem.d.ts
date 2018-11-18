export interface TreeItem {
    item_type: 'root' | 'group' | 'layer';
    display_name?: string;
    id?: number;
    _layer?: any;
    _parent?: TreeGroup;
}
export interface TreeGroup extends TreeItem {
    item_type: 'group';
    group_expanded?: boolean;
    children: Array<TreeLayer | TreeGroup>;
}
export interface TreeLayer extends TreeItem {
    item_type: 'layer';
    layer_adapter: string;
    layer_enabled: boolean;
    draw_order_position: any;
    layer_max_scale_denom: any;
    layer_min_scale_denom: any;
    layer_style_id: number;
    layer_transparency: any;
}
export interface ResourceItem {
    resource: {
        id: number;
        cls: string;
        parent: {
            id: number;
            parent: {
                id: any;
            };
        };
        owner_user: {
            id: number;
        };
        permissions: any[];
        keyname: any;
        display_name: string;
        description: string;
        children: boolean;
        interfaces: any[];
        scopes: string[];
    };
    resmeta: {
        items: {};
    };
    webmap: {
        extent_left: number;
        extent_right: number;
        extent_bottom: number;
        extent_top: number;
        draw_order_enabled: any;
        bookmark_resource: any;
        root_item: TreeGroup;
    };
}
