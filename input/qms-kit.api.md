## API Report File for "@nextgis/qms-kit"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { AdapterOptions } from '@nextgis/webmap';
import type { LayerAdapterCreators } from '@nextgis/webmap';
import type { LayerAdaptersOptions } from '@nextgis/webmap';
import type { MainLayerAdapter } from '@nextgis/webmap';
import type { RasterAdapterOptions } from '@nextgis/webmap';
import type { StarterKit } from '@nextgis/webmap';
import type { Type } from '@nextgis/utils';
import type { WebMap } from '@nextgis/webmap';

// @public (undocumented)
export const alias: {
    [key in QmsLayerType]: keyof LayerAdaptersOptions;
};

// @public (undocumented)
export function createQmsAdapter(webMap: WebMap, url?: string, createOpt?: Partial<QmsAdapterOptions>): Type<MainLayerAdapter>;

// @public (undocumented)
export interface GeoserviceInList {
    // (undocumented)
    desc: string;
    // (undocumented)
    epsg: number;
    // (undocumented)
    guid: string;
    // (undocumented)
    id: number;
    // (undocumented)
    name: string;
    // (undocumented)
    type: string;
}

// @public (undocumented)
export interface QmsAdapter extends MainLayerAdapter {
    // (undocumented)
    qms?: QmsBasemap;
}

// @public (undocumented)
export interface QmsAdapterOptions extends RasterAdapterOptions {
    // (undocumented)
    name?: string;
    // (undocumented)
    qms?: QmsBasemap;
    // (undocumented)
    qmsId?: number;
    // (undocumented)
    url: string;
}

// @public (undocumented)
export interface QmsBasemap {
    // (undocumented)
    alt_urls?: string[];
    // (undocumented)
    boundary?: any;
    // (undocumented)
    boundary_area?: any;
    // (undocumented)
    copyright_text: string;
    // (undocumented)
    copyright_url: string;
    // (undocumented)
    created_at?: Date;
    // (undocumented)
    cumulative_status?: string;
    // (undocumented)
    desc: string;
    // (undocumented)
    epsg: number;
    // (undocumented)
    extent?: number[];
    // (undocumented)
    guid: string;
    // (undocumented)
    icon: number;
    // (undocumented)
    id: number;
    // (undocumented)
    last_status?: number;
    // (undocumented)
    license_name: string;
    // (undocumented)
    license_url: string;
    // (undocumented)
    name: string;
    // (undocumented)
    origin_url?: string;
    // (undocumented)
    source?: string;
    // (undocumented)
    source_url?: string;
    // (undocumented)
    submitter?: string;
    // (undocumented)
    terms_of_use_url: string;
    // (undocumented)
    type: QmsLayerType;
    // (undocumented)
    updated_at?: Date;
    // (undocumented)
    url: string;
    // (undocumented)
    y_origin_top: boolean;
    // (undocumented)
    z_max: any;
    // (undocumented)
    z_min: any;
}

// @public (undocumented)
export class QmsKit implements StarterKit {
    constructor(options?: QmsOptions);
    // (undocumented)
    getLayerAdapters(): Promise<LayerAdapterCreators[]>;
    // (undocumented)
    options: QmsOptions;
    // (undocumented)
    url: string;
    // (undocumented)
    static utils: {
        createQmsAdapter: typeof createQmsAdapter;
    };
}

// @public (undocumented)
export type QmsLayerType = 'tms';

// @public (undocumented)
export interface QmsOptions {
    // (undocumented)
    url: string;
}

// @public (undocumented)
export function updateQmsOptions(qms: QmsBasemap): AdapterOptions & {
    url: string;
};


// (No @packageDocumentation comment for this package)

```