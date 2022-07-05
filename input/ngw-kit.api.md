## API Report File for "@nextgis/ngw-kit"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="node" />

import { AdapterOptions } from '@nextgis/webmap';
import { BasemapWebmapItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { EventEmitter } from 'events';
import { Feature } from 'geojson';
import type { FeatureCollection } from 'geojson';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FeatureItemExtensions } from '@nextgis/ngw-connector';
import type { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import { FeatureProperties } from '@nextgis/utils';
import type { FeatureResource } from '@nextgis/ngw-connector';
import type { FileMeta } from '@nextgis/ngw-connector';
import type { FilterOptions } from '@nextgis/webmap';
import type { GeoJsonAdapterOptions } from '@nextgis/webmap';
import type { GeoJsonObject } from 'geojson';
import { Geometry } from 'geojson';
import { GeometryType } from '@nextgis/ngw-connector';
import type { IdOnly } from '@nextgis/ngw-connector';
import type { ImageAdapterOptions } from '@nextgis/webmap';
import { Item } from '@nextgis/item';
import type { ItemOptions } from '@nextgis/item';
import { JsonMap } from '@nextgis/utils';
import { LayerAdapter } from '@nextgis/webmap';
import type { LayerAdapterCreators } from '@nextgis/webmap';
import { LayerAdapterDefinition } from '@nextgis/webmap';
import type { LayerAdaptersOptions } from '@nextgis/webmap';
import type { LayerFeature } from '@nextgis/ngw-connector';
import type { LngLatBoundsArray } from '@nextgis/utils';
import { MainLayerAdapter } from '@nextgis/webmap';
import type { MapClickEvent } from '@nextgis/webmap';
import type { MvtAdapterOptions } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import type { NgwDateFormat } from '@nextgis/ngw-connector';
import type { NgwDateTimeFormat } from '@nextgis/ngw-connector';
import type { OnLayerMouseOptions } from '@nextgis/webmap';
import { Point } from 'geojson';
import type { Polygon } from 'geojson';
import type { Position } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { RasterAdapterOptions } from '@nextgis/webmap';
import type { RequestOptions } from '@nextgis/ngw-connector';
import type { ResourceDefinition } from '@nextgis/ngw-connector';
import { ResourceItem } from '@nextgis/ngw-connector';
import type { StarterKit } from '@nextgis/webmap';
import type StrictEventEmitter from 'strict-event-emitter-types';
import { Type } from '@nextgis/utils';
import type { VectorAdapterLayerType } from '@nextgis/webmap';
import type { VectorLayerAdapter } from '@nextgis/webmap';
import { WebMap } from '@nextgis/webmap';
import type { WebMapEvents } from '@nextgis/webmap';
import type { WebmapResource } from '@nextgis/ngw-connector';

// @public (undocumented)
export function addFeatureAttachment(options: GetNgwItemOptions & {
    fileMeta: FileMeta;
}): IdOnly;

// @public @deprecated (undocumented)
export function addNgwLayer(options: NgwLayerOptions, webMap: WebMap, connector: NgwConnector): Promise<Type<ResourceAdapter> | undefined>;

// @public (undocumented)
export interface AppSettings {
    // (undocumented)
    bookmark_resource?: any;
    // (undocumented)
    draw_order_enabled?: any;
    // (undocumented)
    extent_bottom?: number;
    // (undocumented)
    extent_left?: number;
    // (undocumented)
    extent_right?: number;
    // (undocumented)
    extent_top?: number;
    // (undocumented)
    root_item?: TreeGroup;
}

// @public (undocumented)
export type ClassAdapter = Promise<Type<LayerAdapter> | undefined>;

// @public (undocumented)
export interface CompanyLogoOptions {
    // (undocumented)
    cssClass?: string;
    // (undocumented)
    padding?: string;
}

// @public (undocumented)
export function createFeatureFieldFilterQueries<G extends Geometry = Geometry, P extends {
    [field: string]: any;
} = {
    [field: string]: any;
}>(opt: FetchNgwItemsOptions<P> & Required<Pick<FetchNgwItemsOptions, 'filters'>>): CancelablePromise<FeatureItem<P, G>[]>;

// @public (undocumented)
export function createGeoJsonAdapter(props: GetClassAdapterOptions): Promise<Type<VectorLayerAdapter>>;

// @public (undocumented)
export function createGeoJsonFeature<G extends Geometry | null = Geometry, P extends FeatureProperties = FeatureProperties>(item: Pick<FeatureItem, 'id' | 'geom' | 'fields'>): Feature<G, P>;

// @public (undocumented)
export function createIdentifyItem<F = FeatureProperties, G extends Geometry = Geometry>(opt: IdentifyItemOptions): IdentifyItem<F, G>;

// @public (undocumented)
export function createNgwLayerAdapter(options: NgwLayerOptions, webMap: WebMap, connector: NgwConnector): Promise<Type<ResourceAdapter> | undefined>;

// Warning: (ae-forgotten-export) The symbol "CreateOnFirstShowAdapterOptions" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "FirstShowAdapter" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function createOnFirstShowAdapter({ webMap, adapterOptions, onLayerAdded, createAdapter, }: CreateOnFirstShowAdapterOptions_2): Promise<Type<FirstShowAdapter>>;

// Warning: (ae-forgotten-export) The symbol "CreateOnFirstShowAdapterOptions" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function createOnFirstShowNgwAdapter({ webMap, connector, item, adapterOptions, idPrefix, }: CreateOnFirstShowAdapterOptions): Promise<Type<MainLayerAdapter>>;

// @public (undocumented)
export function createPopupContent(feature: Feature, item?: ResourceItem): HTMLElement | string;

// @public (undocumented)
export function createRasterAdapter({ layerOptions, webMap, connector, item, }: GetClassAdapterOptions): Promise<Type<MainLayerAdapter> | undefined>;

// @public (undocumented)
export function deleteFeatureAttachment(options: GetNgwItemOptions & {
    attachmentId: number;
}): Promise<void>;

// @public (undocumented)
export function extendNgwWebmapLayerAdapter(opt: ExtendNgwWebmapLayerAdapterOptions): Type<NgwWebmapLayerAdapter>;

// @public (undocumented)
export interface ExtendNgwWebmapLayerAdapterOptions {
    // (undocumented)
    baseUrl?: string;
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    webMap: WebMap;
}

// @public (undocumented)
export const FEATURE_REQUEST_PARAMS: FeatureRequestParams;

// @public (undocumented)
export interface FeatureIdentifyRequestOptions {
    geom: string;
    // (undocumented)
    layers: number[];
    // (undocumented)
    srs: 3857;
}

// @public (undocumented)
export function featureLayerIdentify(options: FeatureLayerIdentifyOptions): CancelablePromise<FeatureLayersIdentify>;

// @public (undocumented)
export interface FeatureLayerIdentifyOptions extends NgwRequestOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    geom: Feature<Polygon> | Polygon | Position[];
    // (undocumented)
    layers: number[];
}

// @public (undocumented)
export interface FeatureRequestParams {
    // (undocumented)
    extensions?: string;
    // (undocumented)
    fields?: string;
    // (undocumented)
    geom?: 'yes' | 'no';
    // (undocumented)
    geom_format?: string;
    // (undocumented)
    intersects?: string;
    // (undocumented)
    limit?: number;
    // (undocumented)
    order_by?: string;
    // (undocumented)
    srs?: number;
}

// @public (undocumented)
export function fetchIdentifyGeoJson<G extends Geometry = Geometry, P extends JsonMap = JsonMap>(options: GetIdentifyGeoJsonOptions): CancelablePromise<Feature<G, P> | undefined>;

// @public (undocumented)
export function fetchIdentifyItem<G extends Geometry = Geometry, P extends FeatureProperties = FeatureProperties>(options: GetIdentifyGeoJsonOptions<P>): CancelablePromise<NgwFeatureItemResponse<P, G> | undefined>;

// @public (undocumented)
export function fetchNgwExtent(options: FetchNgwLayerExtentOptions): CancelablePromise<LngLatBoundsArray | undefined>;

// @public (undocumented)
export type FetchNgwItemOptions<P extends FeatureProperties = FeatureProperties> = GetNgwItemOptions & NgwFeatureRequestOptions<P>;

// @public (undocumented)
export type FetchNgwItemsOptions<P extends FeatureProperties = FeatureProperties> = GetNgwItemsOptions<P> & NgwFeatureRequestOptions<P> & {
    clientFilterValidate?: boolean;
};

// @public (undocumented)
export function fetchNgwLayerCount({ connector, resourceId, cache, }: FetchNgwLayerCountOptions): CancelablePromise<number>;

// @public (undocumented)
export interface FetchNgwLayerCountOptions {
    // (undocumented)
    cache?: boolean;
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    resourceId: number;
}

// @public (undocumented)
export function fetchNgwLayerExtent({ resourceId, connector, cache, }: FetchNgwLayerExtentOptions): CancelablePromise<LngLatBoundsArray | undefined>;

// @public (undocumented)
export interface FetchNgwLayerExtentOptions extends NgwRequestOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    resourceId: number;
}

// @public (undocumented)
export function fetchNgwLayerFeature<G extends Geometry = Geometry, P extends Record<string, any> = Record<string, any>>(options: FetchNgwItemOptions<P>): CancelablePromise<Feature<G, P>>;

// @public (undocumented)
export function fetchNgwLayerFeatureCollection<G extends Geometry | null = Geometry, P extends FeatureProperties = FeatureProperties>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureCollection<G, P>>;

// @public (undocumented)
export function fetchNgwLayerFeatures<G extends Geometry | null = Geometry, P extends FeatureProperties = FeatureProperties>(options: FetchNgwItemsOptions<P>): CancelablePromise<Feature<G, P>[]>;

// @public (undocumented)
export function fetchNgwLayerItem<G extends Geometry = Geometry, P extends FeatureProperties = FeatureProperties>(options: FetchNgwItemOptions<P>): CancelablePromise<NgwFeatureItemResponse<P, G>>;

// @public (undocumented)
export function fetchNgwLayerItemExtent({ resourceId, featureId, connector, cache, }: FetchNgwLayerItemExtentOptions): CancelablePromise<LngLatBoundsArray | undefined>;

// @public (undocumented)
export interface FetchNgwLayerItemExtentOptions extends FetchNgwLayerExtentOptions {
    // (undocumented)
    featureId: number;
}

// @public (undocumented)
export function fetchNgwLayerItems<G extends Geometry = Geometry, P extends FeatureProperties = FeatureProperties>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]>;

// @public (undocumented)
export function fetchNgwLayerItemsRequest<G extends Geometry = Geometry, P extends {
    [field: string]: any;
} = {
    [field: string]: any;
}>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]>;

// @public (undocumented)
export interface FetchNgwResourceExtent extends NgwRequestOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    resource?: ResourceDefinition | ResourceItem;
}

// @public @deprecated (undocumented)
export function fetchNgwResourceExtent(item: ResourceItem, connector: NgwConnector, options?: FetchNgwLayerExtentOptions): CancelablePromise<LngLatBoundsArray | undefined>;

// @public (undocumented)
export type GetClassAdapter = GetClassAdapterCallback | GetClassAdapterByType;

// @public (undocumented)
export type GetClassAdapterByType = {
    [adapterType: string]: GetClassAdapterCallback;
};

// @public (undocumented)
export type GetClassAdapterCallback = (options: GetClassAdapterOptions) => Promise<Type<LayerAdapter> | undefined> | undefined;

// @public (undocumented)
export interface GetClassAdapterOptions {
    // (undocumented)
    Adapter?: Type<MainLayerAdapter>;
    addLayerOptionsPriority?: false;
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    item: ResourceItem;
    // (undocumented)
    layerOptions: NgwLayerOptions;
    // (undocumented)
    webMap: WebMap;
}

// @public (undocumented)
export function getCompanyLogo(connector: NgwConnector, options?: CompanyLogoOptions): Promise<HTMLElement | undefined>;

// @public @deprecated (undocumented)
export function getIdentifyGeoJson<G extends Geometry = Geometry, P extends JsonMap = JsonMap>(options: GetIdentifyGeoJsonOptions): CancelablePromise<Feature<G, P> | undefined>;

// @public (undocumented)
export interface GetIdentifyGeoJsonOptions<P extends FeatureProperties = FeatureProperties> {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    identify: NgwIdentify;
    // (undocumented)
    multiple?: boolean;
    // (undocumented)
    requestOptions?: NgwFeatureRequestOptions<P>;
}

// @public (undocumented)
export function getIdentifyItems(identify: FeatureLayersIdentify & {
    resources?: number[];
}, multiple?: boolean): NgwIdentifyItem[];

// @public (undocumented)
export function getImageAdapterOptions({ resourceId, baseUrl, nd, headers, }: GetImageAdapterOptionsParams): ImageAdapterOptions;

// @public (undocumented)
export interface GetImageAdapterOptionsParams {
    // (undocumented)
    baseUrl?: string;
    // (undocumented)
    headers: any;
    // (undocumented)
    nd?: TileNoData;
    // (undocumented)
    resourceId: number | number[];
}

// @public (undocumented)
export interface GetLayerAdapterOptions {
    // (undocumented)
    baseUrl?: string;
    // (undocumented)
    options: NgwLayerOptions;
    // (undocumented)
    webMap?: WebMap;
}

// @public @deprecated (undocumented)
export function getLayerAdapterOptions(options: NgwLayerOptions, webMap: WebMap, baseUrl: string): RasterAdapterOptions | ImageAdapterOptions | undefined;

// @public (undocumented)
export function getMapWidthForLanInMeters(lat: number): number;

// @public (undocumented)
export interface GetNgwItemOptions extends FetchNgwLayerExtentOptions {
    // (undocumented)
    featureId: number;
}

// @public (undocumented)
export interface GetNgwItemsOptions<P extends FeatureProperties = FeatureProperties> extends FetchNgwLayerExtentOptions {
    // (undocumented)
    filters?: PropertiesFilter<PropertiesForNgwFilter<P>>;
    // (undocumented)
    paramList?: [string, any][];
}

// @public (undocumented)
export function getNgwWebmapExtent(webmap: WebmapResource): LngLatBoundsArray | undefined;

// @public (undocumented)
export function getZoomFromScale(scale: number): number;

// @public (undocumented)
export interface IdentifyEvent {
    // (undocumented)
    data: FeatureLayersIdentify;
    // (undocumented)
    ev: MapClickEvent;
}

// @public (undocumented)
export class IdentifyItem<F = FeatureProperties, G extends Geometry = Geometry> implements LayerFeature {
    constructor(options: IdentifyItemOptions);
    // (undocumented)
    extensions?: FeatureItemExtensions;
    // (undocumented)
    readonly fields: FeatureProperties;
    // (undocumented)
    geojson(): CancelablePromise<Feature<G, F>>;
    // (undocumented)
    geom?: GeoJsonObject;
    // (undocumented)
    getBounds(): CancelablePromise<LngLatBoundsArray | undefined>;
    // (undocumented)
    readonly id: number;
    // (undocumented)
    identify(options?: Partial<FetchNgwItemOptions<F>>): CancelablePromise<NgwFeatureItemResponse<F, G>>;
    // (undocumented)
    readonly label: string;
    // (undocumented)
    readonly layerId: number;
    // (undocumented)
    readonly parent: string;
    // (undocumented)
    resource(): CancelablePromise<FeatureResource>;
}

// @public (undocumented)
export interface IdentifyItemOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    feature: LayerFeature;
}

// @public (undocumented)
export interface IdentifyRequestOptions extends NgwRequestOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    geom?: Feature<Polygon> | Polygon;
    // (undocumented)
    layers: number[];
    // (undocumented)
    radius?: number;
}

// @public (undocumented)
export function mapFeatureDisplayName({ connector, resource, resourceId, fields, }: MapFeatureDisplayNameOptions): CancelablePromise<string[]>;

// @public (undocumented)
export interface MapFeatureDisplayNameOptions {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    fields: string[];
    // (undocumented)
    resource?: ResourceDefinition;
    // @deprecated (undocumented)
    resourceId?: number;
}

// @public (undocumented)
export interface MapSelectNgwLayerDistinctOptions<P extends FeatureProperties = FeatureProperties> extends FetchNgwItemsOptions<P> {
    // (undocumented)
    fields: (keyof P)[];
}

// @public (undocumented)
export function ngwApiToAdapterOptions({ options, webMap, baseUrl, }: GetLayerAdapterOptions): MvtAdapterOptions | RasterAdapterOptions | ImageAdapterOptions | undefined;

// @public (undocumented)
export interface NgwConfig {
    // (undocumented)
    amdUrl: string;
    // (undocumented)
    applicationUrl: string;
    // (undocumented)
    assetUrl: string;
    // (undocumented)
    id: number;
}

// @public (undocumented)
export interface NgwFeatureItemResponse<F = FeatureProperties, G extends Geometry = Geometry> extends FeatureItem<F, G> {
    toGeojson(): CancelablePromise<Feature<G, F>>;
}

// @public (undocumented)
export interface NgwFeatureRequestOptions<P extends FeatureProperties = FeatureProperties> extends FilterOptions<P> {
    // Warning: (ae-forgotten-export) The symbol "Extensions" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    extensions?: Extensions[] | string[] | null | false;
    // (undocumented)
    geom?: boolean;
    // (undocumented)
    srs?: number;
}

// Warning: (ae-forgotten-export) The symbol "NgwVectorIdentify" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "NgwRasterIdentify" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export type NgwIdentify = FeatureLayersIdentify & (NgwVectorIdentify | NgwRasterIdentify);

// @public (undocumented)
export interface NgwIdentifyItem {
    // (undocumented)
    feature: LayerFeature;
    // (undocumented)
    featureId: number;
    // (undocumented)
    resourceId: number;
}

// @public (undocumented)
export class NgwKit implements StarterKit {
    constructor(options: NgwKitOptions);
    // (undocumented)
    static addClassAdapters(cls: string, adapter: GetClassAdapter): void;
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    getLayerAdapters(): Promise<LayerAdapterCreators[]>;
    // (undocumented)
    onLoadSync(webMap: WebMap): Promise<NgwWebmapLayerAdapter | undefined>;
    // (undocumented)
    options: NgwKitOptions;
    // (undocumented)
    url: string;
    // (undocumented)
    webMap?: WebMap;
}

// @public (undocumented)
export interface NgwKitOptions {
    // (undocumented)
    auth?: {
        login: string;
        password: string;
    };
    // (undocumented)
    baseUrl?: string;
    // (undocumented)
    connector?: NgwConnector;
    pixelRadius?: number;
    // (undocumented)
    resourceId?: ResourceIdDef;
}

// @public (undocumented)
export type NgwLayerAdapterType = 'IMAGE' | 'TILE' | 'GEOJSON' | 'MVT' | 'WMS' | 'TERRAIN' | 'MODEL_3D' | 'NGW:WEBMAP';

// @public (undocumented)
export interface NgwLayerOptions<T extends NgwLayerAdapterType = NgwLayerAdapterType, P = FeatureProperties, A = Record<string, any>> {
    // (undocumented)
    adapter?: T;
    // (undocumented)
    adapterOptions?: Partial<LayerAdaptersOptions[T] & AdapterOptions<A>>;
    // (undocumented)
    fit?: boolean;
    // (undocumented)
    headers?: any;
    // (undocumented)
    id?: string;
    // (undocumented)
    meta?: P;
    // (undocumented)
    resource: ResourceDefinition;
    // (undocumented)
    simplification?: number;
    tileNoData?: TileNoData;
}

// @public (undocumented)
export type NgwRequestOptions = Pick<RequestOptions, 'cache' | 'signal'>;

// @public (undocumented)
export class NgwResource {
    // (undocumented)
    connector: NgwConnector;
    // (undocumented)
    protected _extent?: LngLatBoundsArray;
    // (undocumented)
    getBounds(options?: FetchNgwLayerExtentOptions): Promise<LngLatBoundsArray | undefined>;
    // @deprecated (undocumented)
    getExtent(): Promise<LngLatBoundsArray | undefined>;
    // (undocumented)
    item: ResourceItem;
}

// Warning: (ae-forgotten-export) The symbol "A" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export interface NgwWebmapAdapterOptions<M = any> extends A {
    // (undocumented)
    connector: NgwConnector;
    defaultBasemap?: boolean;
    pixelRadius?: number;
    // (undocumented)
    resourceId: ResourceIdDef;
    // (undocumented)
    selectable?: boolean;
    useBasemap?: boolean;
    useExtentConstrained?: boolean;
    // (undocumented)
    webMap: WebMap<M>;
}

// @public (undocumented)
export class NgwWebmapItem extends Item<ItemOptions> {
    constructor(webMap: WebMap, item: TreeGroup | TreeLayer, options?: ItemOptions, connector?: NgwConnector, parent?: NgwWebmapItem, noInit?: boolean);
    // (undocumented)
    bringToFront(): void;
    // (undocumented)
    connector?: NgwConnector;
    // (undocumented)
    static create(webMap: WebMap, item: TreeGroup | TreeLayer, options?: ItemOptions, connector?: NgwConnector, parent?: NgwWebmapItem): Promise<NgwWebmapItem>;
    // (undocumented)
    readonly emitter: EventEmitter;
    // (undocumented)
    fit(): void;
    // (undocumented)
    static GetAdapterFromLayerType: {
        [layerType: string]: (item: TreeItem, options: any, webMap: WebMap, connector?: NgwConnector) => LayerAdapterDefinition;
    };
    // (undocumented)
    protected getChildren(item: TreeGroup): (TreeGroup | TreeLayer)[];
    // (undocumented)
    protected getItemOptions(item: TreeGroup | TreeLayer): Record<string, any>;
    // (undocumented)
    getLayer(): LayerAdapter<any, any, AdapterOptions<Record<string, any>, Record<string, any>>> | undefined;
    // (undocumented)
    initItem(item: TreeGroup | TreeLayer): Promise<void>;
    // (undocumented)
    item: TreeGroup | TreeLayer;
    // (undocumented)
    layer?: LayerAdapter;
    // (undocumented)
    static options: ItemOptions;
    // (undocumented)
    protected _rootDescendantsCount: number;
    // (undocumented)
    webMap: WebMap;
}

// @public (undocumented)
export class NgwWebmapLayerAdapter<M = any> implements ResourceAdapter<M> {
    constructor(map: M, options: NgwWebmapAdapterOptions);
    // (undocumented)
    addLayer(options: NgwWebmapAdapterOptions): Promise<any>;
    // (undocumented)
    readonly emitter: StrictEventEmitter<EventEmitter, NgwWebmapLayerAdapterEvents>;
    // (undocumented)
    protected _extent?: LngLatBoundsArray;
    // Warning: (ae-forgotten-export) The symbol "BookmarkItem" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    fetchBookmarks(): CancelablePromise<BookmarkItem[]>;
    // (undocumented)
    getBookmarksResourceId(): number | undefined;
    // (undocumented)
    getBounds(): LngLatBoundsArray | undefined;
    // (undocumented)
    getDependLayers(): Array<NgwWebmapItem>;
    // @deprecated (undocumented)
    getExtent(): LngLatBoundsArray | undefined;
    // (undocumented)
    getIdentificationIds(): Promise<number[]>;
    // (undocumented)
    protected _getWebMapLayerItem(): Promise<NgwWebmapItem | undefined>;
    // (undocumented)
    hideLayer(): Promise<void>;
    // (undocumented)
    layer?: NgwWebmapItem;
    // (undocumented)
    map: M;
    // (undocumented)
    NgwWebmapItem: Type<NgwWebmapItem>;
    // (undocumented)
    options: NgwWebmapAdapterOptions;
    pixelRadius: number;
    // (undocumented)
    removeLayer(): void;
    // (undocumented)
    resourceId: number;
    // (undocumented)
    setOpacity(val: number): Promise<void>;
    // (undocumented)
    showLayer(): Promise<void>;
    // (undocumented)
    webmapClassName: string;
}

// @public (undocumented)
export interface NgwWebmapLayerAdapterEvents extends WebMapEvents {
    // (undocumented)
    identify: IdentifyEvent;
}

// @public (undocumented)
export function parseDate(date: string | NgwDateFormat | NgwDateTimeFormat): string | undefined;

// @public (undocumented)
export function parseDateFromNgw(date: NgwDateTimeFormat): string;

// @public (undocumented)
export function pixelsInMeterWidth(): number;

// @public (undocumented)
export function prepareFieldsToNgw<T extends FeatureProperties = FeatureProperties>(item: T, resourceFields: Pick<FeatureProperties, 'keyname' | 'datatype'>[]): Record<keyof T, any>;

// @public (undocumented)
export function prepareNgwFieldsToPropertiesFilter(fields: Record<string, any>): Record<string, any>;

// @public (undocumented)
export type PropertiesForNgwFilter<P extends FeatureProperties = FeatureProperties> = P & {
    id: number;
};

// @public (undocumented)
export interface ResourceAdapter<M = any, L = any, O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions, F extends Feature = Feature> extends VectorLayerAdapter<M, L, O, F> {
    // (undocumented)
    baselayer?: boolean;
    // (undocumented)
    getBounds?(): LngLatBoundsArray | Promise<LngLatBoundsArray | undefined> | undefined;
    // @deprecated (undocumented)
    getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray | undefined> | undefined;
    // (undocumented)
    getIdentificationIds(): Promise<number[] | undefined>;
    // (undocumented)
    item?: ResourceItem;
    // (undocumented)
    resourceId: number;
}

// @public (undocumented)
export type ResourceIdDef = number | [resourceId: number, layerId: string];

// @public (undocumented)
export function resourceIdFromLayerOptions(options: NgwLayerOptions, connector: NgwConnector): Promise<number>;

// @public @deprecated (undocumented)
export type ResourceNgwLayerOptions<T extends NgwLayerAdapterType = NgwLayerAdapterType, P = {
    [name: string]: any;
}> = NgwLayerOptions<T, P>;

// @public (undocumented)
export function selectNgwLayerDistinct<P extends FeatureProperties = FeatureProperties>(options: MapSelectNgwLayerDistinctOptions<P>): CancelablePromise<Record<keyof P, unknown[]>>;

// @public (undocumented)
export function sendIdentifyRequest(ev: MapClickEvent, options: IdentifyRequestOptions): CancelablePromise<FeatureLayersIdentify>;

// @public (undocumented)
export function setScaleRatio(scale: number, lat?: number): number;

// @public (undocumented)
export type TileNoData = 200 | 404 | 204;

// @public (undocumented)
export interface TreeGroup extends TreeItem {
    // (undocumented)
    children: Array<TreeLayer | TreeGroup>;
    // (undocumented)
    group_expanded?: boolean;
    // (undocumented)
    item_type: 'root' | 'group';
}

// @public (undocumented)
export interface TreeItem {
    // (undocumented)
    display_name?: string;
    // (undocumented)
    item_type: 'root' | 'group' | 'layer' | string;
    // (undocumented)
    _layer?: any;
    // (undocumented)
    parentId?: number;
    // (undocumented)
    resourceId?: number | [number, string];
}

// @public (undocumented)
export interface TreeLayer extends TreeItem {
    // (undocumented)
    adapter?: string;
    // (undocumented)
    draw_order_position: number;
    // (undocumented)
    item_type: 'layer';
    // (undocumented)
    layer_adapter: string;
    // (undocumented)
    layer_enabled: boolean;
    // (undocumented)
    layer_max_scale_denom?: number;
    // (undocumented)
    layer_min_scale_denom?: number;
    // (undocumented)
    layer_style_id: number;
    // (undocumented)
    layer_transparency: number;
    // (undocumented)
    layer_url?: string;
    // (undocumented)
    style_parent_id: number;
    // (undocumented)
    updateWmsParams?: (parans: any) => any;
    // (undocumented)
    url?: string;
}

// @public (undocumented)
export function updateImageParams(params: Record<string, any>, resourceId: number | number[]): Record<string, any>;

// @public (undocumented)
export function updateItemRequestParam<P extends FeatureProperties = FeatureProperties>(params: FeatureRequestParams, options: NgwFeatureRequestOptions<P>): void;

// @public (undocumented)
export function uploadFeatureAttachment(options: GetNgwItemOptions & UploadFeatureAttachmentOptions): IdOnly;

// @public (undocumented)
export interface UploadFeatureAttachmentOptions {
    // (undocumented)
    file: File;
}

// @public (undocumented)
export const vectorLayerGeomToPaintTypeAlias: Record<GeometryType, VectorAdapterLayerType>;

// @public (undocumented)
export type VectorResourceAdapter<M = any, L = any, O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions, F extends Feature = Feature> = ResourceAdapter<M, L, O, F> & VectorLayerAdapter<M, L, O, F>;

// @public (undocumented)
export const WEBMAP_BASELAYER_ID_PREFIX = "webmap-baselayer";

```