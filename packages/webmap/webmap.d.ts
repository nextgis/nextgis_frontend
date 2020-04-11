/// <reference types="node" />
import { checkIfPropertyFilter } from '@nextgis/properties-filter';
import { EventEmitter } from 'events';
import { Feature } from 'geojson';
import { GeoJsonGeometryTypes } from 'geojson';
import { GeoJsonObject } from 'geojson';
import { GeometryPaint } from '@nextgis/paint';
import { GetPaintFunction } from '@nextgis/paint';
import { Operations } from '@nextgis/properties-filter';
import { Paint } from '@nextgis/paint';
import { Polygon } from 'geojson';
import { PropertiesFilter } from '@nextgis/properties-filter';
import { propertiesFilter } from '@nextgis/properties-filter';
import { PropertyFilter } from '@nextgis/properties-filter';
import StrictEventEmitter from 'strict-event-emitter-types';
import { Type } from '@nextgis/utils';

export declare type AdapterConstructor = () => Promise<Type<LayerAdapter> | undefined>;

export declare interface AdapterOptions {
    id?: string;
    visibility?: boolean;
    baseLayer?: boolean;
    order?: number;
    attribution?: string;
    maxZoom?: number;
    minZoom?: number;
    minScale?: number;
    maxScale?: number;
    opacity?: number;
    fit?: boolean;
    name?: string;
    adapter?: string;
}

export declare interface AppOptions {
    mapAdapter: MapAdapter;
    starterKits?: StarterKit[];
    mapOptions?: MapOptions;
    runtimeParams?: RuntimeParams[];
    create?: boolean;
}

export declare interface AttributionControlOptions {
    compact?: boolean;
    customAttribution?: string | string[];
}

export declare interface BaseLayerAdapter<M = any, L = any, O extends AdapterOptions = AdapterOptions> {
    options: O;
    id?: string;
    order?: number;
    name?: string;
    layer?: L;
    map?: M;
    addLayer(options: O): L | Promise<L> | undefined;
    updateLayer?(): void;
    removeLayer?(): void;
    beforeRemove?(): void;
    showLayer?(layer: L): void;
    hideLayer?(layer: L): void;
    getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;
    getDependLayers?(): L[];
}

export declare interface BaseMapEvents {
    click: MapClickEvent;
    zoomstart: MapAdapter;
    zoom: MapAdapter;
    zoomend: MapAdapter;
    movestart: MapAdapter;
    move: MapAdapter;
    moveend: MapAdapter;
}

declare class BaseWebMap<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents> {
    static keys: Keys;
    static utils: {
        detectGeometryType: typeof detectGeometryType;
        findMostFrequentGeomType: typeof findMostFrequentGeomType;
        updateGeoJsonAdapterOptions: typeof updateGeoJsonAdapterOptions;
        propertiesFilter: typeof propertiesFilter;
        createToggleControl: typeof createToggleControl;
        getBoundsPolygon: typeof getBoundsPolygon;
    };
    static getPaintFunctions: {
        [name: string]: GetPaintFunction;
    };
    static decorators: {
        onLoad: typeof onLoad;
    };
    options: MapOptions;
    readonly emitter: StrictEventEmitter<EventEmitter, WebMapEvents>;
    readonly keys: Keys;
    readonly mapAdapter: MapAdapter<M>;
    readonly runtimeParams: RuntimeParams[];
    getPaintFunctions: {
        [name: string]: GetPaintFunction;
    };
    mapState: Type<StateItem>[];
    protected _initMapState: Record<string, any>;
    protected readonly _starterKits: StarterKit[];
    private _mapState;
    private _extent?;
    private readonly _eventsStatus;
    private readonly _mapEvents;
    constructor(appOptions: AppOptions);
    create(options?: MapOptions): Promise<this>;
    setRuntimeParams(params: RuntimeParams): void;
    destroy(): void;
    getState(): Record<string, any>;
    getRuntimeParams(): Record<string, any>;
    getContainer(): HTMLElement | undefined;
    setCursor(cursor: Cursor): void;
    setCenter(lngLat: LngLatArray): this;
    getCenter(): LngLatArray | undefined;
    getBounds(): LngLatBoundsArray | undefined;
    getBoundsPolygon(): Feature<Polygon> | undefined;
    setZoom(zoom: number): this;
    getZoom(): number | undefined;
    setView(lngLat?: LngLatArray, zoom?: number): void;
    fitBounds(bounds: LngLatBoundsArray, options?: FitOptions): this;
    getEventStatus(event: keyof E): boolean;
    onLoad(event?: keyof WebMapEvents): Promise<this>;
    onMapLoad(cb?: (mapAdapter: MapAdapter) => void): Promise<MapAdapter>;
    getLayerAdapters(): {
        [name: string]: Type<LayerAdapter>;
    };
    getLayerAdapter(name: string): Type<LayerAdapter>;
    locate(opt: LocateOptions, events?: LocationEvents): Locate;
    protected _emitStatusEvent(eventName: keyof E, data?: any): void;
    protected _addLayerProviders(): Promise<void>;
    protected _onLoadSync(): Promise<void>;
    private _setupMap;
    private _zoomToInitialExtent;
    private _setInitMapState;
    private _addEventsListeners;
    private _removeEventsListeners;
}

export declare interface ButtonControlOptions {
    html?: string | HTMLElement;
    addClass?: string;
    onClick: OnClick;
    title?: string;
}

export declare type CallbackFilter<F extends Feature = Feature, L = any> = (opt: LayerDefinition<F, L>) => boolean;
export { checkIfPropertyFilter }

export declare type ControlPositions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export declare interface CreateControlOptions {
    bar?: boolean;
    margin?: boolean;
    addClass?: string;
}

declare function createToggleControl<C = any>(createButtonControl: (options: ButtonControlOptions) => C, options: ToggleControlOptions): C & ToggleControl;

export declare type Cursor = 'auto' | 'crosshair' | 'default' | 'e-resize' | 'help' | 'move' | 'n-resize' | 'ne-resize' | 'nw-resize' | 'pointer' | 'progress' | 's-resize' | 'se-resize' | 'sw-resize' | 'text' | 'w-resize' | 'wait' | 'inherit';

export declare type DataLayerFilter<F extends Feature = Feature, L = any> = CallbackFilter<F, L>;

export declare interface DataLoadError {
    target: string;
}

declare function detectGeometryType(geojson: GeoJsonObject): GeoJsonGeometryTypes;

export declare interface DialogAdapter {
    options: DialogAdapterOptions;
    show(): void;
    close(): void;
    updateContent(content?: string | Node): void;
}

export declare interface DialogAdapterOptions {
    template?: string | Node;
    openers?: HTMLElement[];
    parent?: Node;
    closeBtn?: boolean;
    closeBtnTemplate?: string | Node;
}

export declare interface FilterOptions {
    limit?: number;
    fields?: string[];
    intersects?: string;
    strategy?: 'BBOX';
    orderBy?: string[];
}

declare function findMostFrequentGeomType(arr: GeoJsonGeometryTypes[]): GeoJsonGeometryTypes;

export declare interface FitOptions {
    maxZoom?: number;
    offset?: [number, number];
    padding?: number;
}

export declare interface GeoJsonAdapterOptions<F extends Feature = Feature, L = any> extends VectorAdapterOptions<F, L> {
    data?: GeoJsonObject;
}

export declare interface GetAttributionsOptions {
    onlyVisible?: boolean;
    onlyBasemap?: boolean;
}

declare function getBoundsPolygon(b: LngLatBoundsArray): Feature<Polygon>;

export declare type HtmlDef = string | HTMLElement;

export declare interface HtmlToggle {
    on: HtmlDef;
    off: HtmlDef;
}

export declare interface ImageAdapterOptions extends WmsAdapterOptions {
    resourceId?: string | number;
}

declare class KeyCodes {
    'backspace': number;
    'tab': number;
    'enter': number;
    'shift': number;
    'ctrl': number;
    'alt': number;
    'pause/break': number;
    'caps_lock': number;
    'escape': number;
    'page_up': number;
    'page_down': number;
    'end': number;
    'home': number;
    'left_arrow': number;
    'up_arrow': number;
    'right_arrow': number;
    'down_arrow': number;
    'insert': number;
    'delete': number;
    'left_window_key': number;
    'right_window_key': number;
    'select_key': number;
    'numpad_0': number;
    'numpad_1': number;
    'numpad_2': number;
    'numpad_3': number;
    'numpad_4': number;
    'numpad_5': number;
    'numpad_6': number;
    'numpad_7': number;
    'numpad_8': number;
    'numpad_9': number;
    'multiply': number;
    'add': number;
    'subtract': number;
    'decimal_point': number;
    'divide': number;
    'f1': number;
    'f2': number;
    'f3': number;
    'f4': number;
    'f5': number;
    'f6': number;
    'f7': number;
    'f8': number;
    'f9': number;
    'f10': number;
    'f11': number;
    'f12': number;
    'num_lock': number;
    'scroll_lock': number;
    'semi-colon': number;
    'equal_sign': number;
    ',': number;
    '-': number;
    '.': number;
    '/': number;
    '`': number;
    '[': number;
    '\\': number;
    ']': number;
    "'": number;
}

declare class Keys {
    keyCodeAlias: KeyCodes;
    keys: {
        [keyCode: number]: boolean;
    };
    private _windowOnFocus;
    private _keysPressed;
    private _keysReleased;
    constructor();
    pressed(keyName: keyof KeyCodes): boolean;
    addKeyboardEventsListener(): void;
    removeKeyboardEventsListener(): void;
    private keysPressed;
    private keysReleased;
    private windowOnFocus;
}

export declare interface LatLng {
    lat: number;
    lng: number;
}

export declare type LayerAdapter<M = any, L = any, O extends AdapterOptions = AdapterOptions> = BaseLayerAdapter<M, L, O> | VectorLayerAdapter<M, L, O>;

export declare interface LayerAdapterCreators {
    name: string;
    createAdapter: (webmap: WebMap) => Promise<Type<LayerAdapter>>;
}

export declare interface LayerAdapters {
    [name: string]: BaseLayerAdapter;
    MVT: VectorLayerAdapter;
    IMAGE: BaseLayerAdapter<any, any, ImageAdapterOptions>;
    WMS: BaseLayerAdapter<any, any, WmsAdapterOptions>;
    OSM: BaseLayerAdapter;
    TILE: BaseLayerAdapter<any, any, TileAdapterOptions>;
    GEOJSON: VectorLayerAdapter<any, any, GeoJsonAdapterOptions>;
}

export declare interface LayerAdaptersOptions {
    [name: string]: AdapterOptions;
    MVT: MvtAdapterOptions;
    IMAGE: ImageAdapterOptions;
    WMS: WmsAdapterOptions;
    OSM: RasterAdapterOptions;
    TILE: TileAdapterOptions;
    GEOJSON: GeoJsonAdapterOptions;
}

export declare type LayerDef = string | LayerAdapter;

export declare interface LayerDefinition<F extends Feature = Feature, L = any> {
    layer?: L;
    feature?: F;
    visible?: boolean;
}

export declare type LngLatArray = [number, number];

export declare type LngLatBoundsArray = [number, number, number, number] | number[];

export declare interface Locate {
    stop: () => void;
}

export declare interface LocateOptions {
    setView?: boolean;
    maxZoom?: ZoomLevel;
}

export declare interface LocationEvent {
    lngLat: LngLatArray;
    bounds?: LngLatBoundsArray;
}

export declare interface LocationEvents {
    locationfound: (e: LocationEvent) => void;
    locationerror?: () => void;
}

export declare interface MapAdapter<M = any, L = any, C = any> {
    isLoaded?: boolean;
    map?: M;
    readonly emitter: StrictEventEmitter<EventEmitter, MapAdapterEvents>;
    layerAdapters: {
        [name: string]: Type<LayerAdapter<M, L, any>>;
    };
    controlAdapters: {
        [name: string]: Type<C>;
    };
    create(options?: MapOptions): void;
    destroy(): void;
    removeLayer(layer: L): any;
    beforeRemove?(): void;
    setLayerOpacity(layer: L, opacity: number): void;
    showLayer(layer: L): void;
    hideLayer(layer: L): void;
    setLayerOrder(layer: L, order: number, layers?: {
        [name: string]: LayerAdapter;
    }): void;
    fit?(extent: LngLatBoundsArray, options?: FitOptions): void;
    fitBounds(extent: LngLatBoundsArray, options?: FitOptions): void;
    setView?(lngLat: LngLatArray, zoom?: number): void;
    getBounds?(): LngLatBoundsArray | undefined;
    getZoom(): number | undefined;
    setZoom(zoom: number): void;
    getCenter(): LngLatArray | undefined;
    setCenter(latLng: LngLatArray): void;
    getContainer(): HTMLElement | undefined;
    setCursor?(cursor: string): void;
    createControl?(control: MapControl, options?: CreateControlOptions): C;
    createButtonControl?(options: ButtonControlOptions): C;
    createToggleControl?(options: ToggleControlOptions): C;
    addControl<K extends keyof MapControls>(controlName: K | any, position: ControlPositions, options?: MapControls[K]): any;
    removeControl(control: any): void;
    onMapClick(evt: any): void;
    locate?(opt: LocateOptions, events?: LocationEvents): Locate;
}

export declare interface MapAdapterEvents extends BaseMapEvents {
    'data-loaded': DataLoadError;
    'data-error': DataLoadError;
    create: MapAdapter;
}

export declare interface MapClickEvent {
    latLng: LatLng;
    pixel: Pixel;
    source?: any;
}

export declare interface MapControl<M extends any = any> {
    onAdd(map?: M): HTMLElement | undefined;
    onRemove(map?: M): unknown;
}

export declare interface MapControls {
    [name: string]: {};
    ZOOM: ZoomControlOptions;
    ATTRIBUTION: AttributionControlOptions;
}

export declare interface MapOptions {
    target?: string | HTMLElement;
    minZoom?: number;
    maxZoom?: number;
    zoom?: number;
    center?: LngLatArray;
    bounds?: LngLatBoundsArray;
    fitOptions?: FitOptions;
    paint?: GeometryPaint;
    selectedPaint?: GeometryPaint;
    onBeforeAddLayer?: OnBeforeLayerAdd;
}

declare interface MapStateItem<V extends any = any> {
    event: keyof WebMapEvents;
    name: string;
    getValue: () => V;
    toString: (data: V) => string;
    parse: (str: string) => V;
}

export declare interface Model3DOptions extends RasterAdapterOptions {
    lon?: number;
    lat?: number;
    height?: number;
}

export declare interface MvtAdapterOptions<F extends Feature = Feature> extends VectorAdapterOptions<F> {
    url: string;
    sourceLayer?: string;
}

export declare type OnBeforeLayerAdd = (e: {
    adapter?: Type<LayerAdapter>;
    options: AdapterOptions & Record<string, any>;
}) => {
    adapter?: Type<LayerAdapter>;
    options?: AdapterOptions;
} | undefined;

export declare type OnClick = OnClickSync | onClickAsync;

declare type onClickAsync = (status?: boolean) => Promise<void>;

declare type OnClickSync = (status?: boolean) => void;

export declare interface OnLayerClickOptions {
    layer: LayerAdapter;
    selected?: boolean;
    feature?: Feature;
    event?: MapClickEvent;
    source?: any;
}

declare function onLoad<E extends WebMapEvents = WebMapEvents>(event: keyof E): (_target: WebMap<any, any, any, WebMapEvents>, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export { Operations }

export declare interface Pixel {
    top: number;
    left: number;
    right?: number;
    bottom?: number;
}

export declare interface PopupOptions {
    minWidth?: number;
    autoPan?: boolean;
    popupContent?: string | HTMLElement;
    fromProperties?: boolean;
    createPopupContent?: (layerDef: LayerDefinition) => HTMLElement | string | undefined;
}
export { PropertiesFilter }
export { PropertyFilter }

export declare interface RasterAdapterOptions extends AdapterOptions {
    url: string;
    subdomains?: string;
    headers?: Record<string, any>;
}

export declare interface RuntimeParams {
    params(): {
        [paramName: string]: any;
    };
    get(name: string): any;
    set(name: string, value: any): void;
    remove(name: string): void;
}

export declare interface StarterKit {
    onLoadSync?(webMap: WebMap): Promise<any>;
    getSettings?(webMap?: WebMap): Promise<MapOptions>;
    getLayerAdapters?(): Promise<LayerAdapterCreators[]>;
    onMapClick?(evt: MapClickEvent, webMap?: WebMap): void;
}

declare abstract class StateItem<V extends any | undefined = any | undefined> implements MapStateItem<V | undefined> {
    protected webMap: WebMap;
    name: keyof MapOptions;
    event: keyof WebMapEvents;
    protected value?: V;
    constructor(webMap: WebMap, opt?: {
        name?: keyof MapOptions;
        event?: keyof WebMapEvents;
        value?: V;
    });
    getValue(): V | undefined;
    setValue(val: V): void;
    abstract toString(data: any): string;
    abstract parse(str: string): V;
}

export declare interface TileAdapterOptions extends RasterAdapterOptions {
    tileSize?: number;
}

export declare interface TitleToggle {
    on: string;
    off: string;
}

export declare interface ToggleControl {
    onClick: OnClick;
    changeStatus: OnClickSync;
}

export declare interface ToggleControlOptions {
    status?: boolean;
    html?: HtmlDef | HtmlToggle;
    addClass?: string;
    addClassOn?: string;
    addClassOff?: string;
    title?: string | TitleToggle;
    onClick?: OnClick;
    getStatus?: () => boolean;
}

export declare interface ToggleLayerOptions {
    silent?: boolean;
}
export { Type }

declare function updateGeoJsonAdapterOptions(opt: GeoJsonAdapterOptions): GeoJsonAdapterOptions;

export declare type VectorAdapterLayerType = 'fill' | 'circle' | 'line' | 'icon';

export declare interface VectorAdapterOptions<F extends Feature = Feature, L = any> extends _VectorAdapterOptionsToExtend {
    type?: VectorAdapterLayerType;
    paint?: Paint;
    selectedPaint?: Paint;
    nativePaint?: boolean | Record<string, any>;
    nativeFilter?: unknown;
    layout?: any;
    selectedLayout?: any;
    selectable?: boolean;
    interactive?: boolean;
    multiselect?: boolean;
    unselectOnSecondClick?: boolean;
    selectOnHover?: boolean;
    popup?: boolean;
    popupOnSelect?: boolean;
    popupOptions?: PopupOptions;
    filter?: DataLayerFilter;
    propertiesFilter?: PropertiesFilter;
    featureIdName?: string;
    cluster?: boolean;
    clusterMaxZoom?: number;
    clusterRadius?: number;
    source?: unknown;
    labelField?: string;
    label?: (e: LayerDefinition<F, L>) => void | string;
    onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
}

declare type _VectorAdapterOptionsToExtend = AdapterOptions & FilterOptions;

export declare interface VectorLayerAdapter<M = any, L = any, O extends VectorAdapterOptions = VectorAdapterOptions, F extends Feature = Feature> extends BaseLayerAdapter<M, L, O> {
    selected?: boolean;
    source?: unknown;
    getLayers?(): Array<LayerDefinition<F, L>>;
    select?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
    unselect?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
    getSelected?(): Array<LayerDefinition<Feature, L>>;
    getFiltered?(): Array<LayerDefinition<Feature, L>>;
    filter?(cb: DataLayerFilter<F, L>): Array<LayerDefinition<Feature, L>>;
    propertiesFilter?(filters: PropertiesFilter, options?: FilterOptions): void;
    removeFilter?(): void;
    addData?(data: GeoJsonObject): void;
    clearLayer?(cb?: (feature: Feature) => boolean): void;
    setData?(data: GeoJsonObject): void;
    onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
    openPopup?(findFeatureCb?: DataLayerFilter<F, L>, options?: PopupOptions): void;
    closePopup?(findFeatureCb?: DataLayerFilter<F, L>): void;
    updateTooltip?(layerDef?: LayerDefinition<F, L>): void;
}

declare class WebMap<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents> extends WebMapLayers<M, L, C, E> {
    static controls: {
        [name: string]: (webMap: WebMap, options?: any) => any;
    };
    addControl<K extends keyof MapControls>(controlDef: K | C, position: ControlPositions, options?: MapControls[K]): Promise<any>;
    createControl(control: MapControl, options?: CreateControlOptions): Promise<C | undefined>;
    createButtonControl(options: ButtonControlOptions): Promise<C | undefined>;
    createToggleControl(options: ToggleControlOptions): Promise<(C & ToggleControl) | undefined>;
    removeControl(control: any): void;
    getControl<K extends keyof MapControls>(control: K, options?: MapControls[K]): C | undefined;
    protected _addLayerProviders(): Promise<void>;
    protected _onLoadSync(): Promise<void>;
}
export { WebMap }
export default WebMap;

export declare interface WebMapEvents extends BaseMapEvents {
    create: WebMap;
    'build-map': MapAdapter;
    'layer:preadd': LayerAdapter;
    'layer:add': LayerAdapter;
    'layer:preremove': LayerAdapter;
    'layer:remove': LayerAdapter;
    'layer:updated': LayerAdapter;
    'layer:preshow': LayerAdapter;
    'layer:show': LayerAdapter;
    'layer:prehide': LayerAdapter;
    'layer:hide': LayerAdapter;
    'layer:click': OnLayerClickOptions;
}

export declare class WebMapLayers<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents> extends BaseWebMap<M, L, C, E> {
    private _layersIdCounter;
    private _layersOrderCounter;
    private readonly _baseLayers;
    private readonly _layers;
    private readonly _selectedLayers;
    fitLayer(layerDef: LayerDef): Promise<void>;
    isBaseLayer(layerDef: LayerDef): boolean | undefined;
    getBaseLayers(): string[];
    getLayer<LA extends LayerAdapter = LayerAdapter>(layerDef: LayerDef): LA | undefined;
    getLayerId(layerDef: LayerDef): string | undefined;
    getLayers(): string[];
    allLayers(): {
        [id: string]: LayerAdapter<any, any, AdapterOptions>;
    };
    findLayer<T extends LayerAdapter = LayerAdapter>(filter: (adapter: T) => boolean): T | undefined;
    isLayerVisible(layerDef: LayerDef): boolean;
    addBaseLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(adapter: K | Type<LayerAdapters[K]>, options: O | LayerAdaptersOptions[K]): Promise<LayerAdapter>;
    addLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(adapter: K | Type<LayerAdapters[K]> | Promise<Type<LayerAdapters[K]> | undefined>, options: O | LayerAdaptersOptions[K], order?: number): Promise<LayerAdapter>;
    addLayerFromAsyncAdapter<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(adapter: AdapterConstructor, options: O | LayerAdaptersOptions[K], order?: number): Promise<LayerAdapter>;
    removeLayers(allowCb?: (layer: string, adapter: LayerAdapter) => boolean): void;
    reserveOrder(): number;
    removeOverlays(): void;
    removeLayer(layerDef: LayerDef): void;
    addGeoJsonLayer<K extends keyof LayerAdaptersOptions>(opt: GeoJsonAdapterOptions, adapter?: K | Type<LayerAdapter>): Promise<LayerAdapter<any, any, AdapterOptions>>;
    showLayer(layerDef: LayerDef, options?: ToggleLayerOptions): void;
    hideLayer(layerDef: LayerDef, options?: ToggleLayerOptions): void;
    toggleLayer(layerDef: LayerDef, status?: boolean, options?: ToggleLayerOptions): void;
    updateLayer(layerDef: LayerDef): void;
    setLayerOpacity(layerDef: LayerDef, value: number): void;
    selectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter): void;
    unSelectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter): void;
    filterLayer(layerDef: LayerDef, filter: DataLayerFilter<Feature, L>): LayerDefinition<Feature, L>[];
    propertiesFilter(layerDef: LayerDef, filters: PropertiesFilter, options?: FilterOptions): void;
    removeLayerFilter(layerDef: LayerDef): void;
    setLayerData(layerDef: LayerDef, data: GeoJsonObject): void;
    addLayerData(layerDef: LayerDef, data: GeoJsonObject): void;
    clearLayerData(layerDef: LayerDef, cb?: (feature: Feature) => boolean): void;
    getAttributions(options: GetAttributionsOptions): string[];
    getActiveBaseLayer(): import("./interfaces/LayerAdapter").BaseLayerAdapter<any, any, AdapterOptions> | undefined;
    private _onLayerClick;
    private _updateGeoJsonOptions;
}

export declare interface WmsAdapterOptions extends RasterAdapterOptions {
    layers?: string;
    format?: 'image/png' | 'image/jpeg' | string;
    version?: string;
    tileSize?: number;
    updateWmsParams?: (obj: {
        [paramName: string]: any;
    }) => object;
    transparent?: boolean;
}

export declare interface ZoomControlOptions {
    zoomInText?: string;
    zoomInTitle?: string;
    zoomOutText?: string;
    zoomOutTitle?: string;
}

export declare type ZoomLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | number;

export { }
