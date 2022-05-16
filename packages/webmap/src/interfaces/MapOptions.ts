import type {
  Type,
  TileJson,
  LngLatArray,
  LngLatBoundsArray,
} from '@nextgis/utils';
import type { GeometryPaint } from '@nextgis/paint';
import type { StarterKit } from './StarterKit';
import type { RuntimeParams } from './RuntimeParams';
import type { MapAdapter, FitOptions } from './MapAdapter';
import type { LayerAdapter, AdapterOptions } from './LayerAdapter';
import type { ControlsOptions, MapControls } from './MapControl';

export interface MapOptions<M = any, C = any> extends ViewOptions {
  /**
   * The main initialization property of WebMap.
   * Determines the way of interaction with the selected GIS framework.
   * Available: [Leaflet](leaflet-map-adapter); [Openlayers](ol-map-adapter); [MapboxGL](mapboxgl-map-adapter)
   */
  mapAdapter?: MapAdapter<M>;

  /**
   * A pre-initialized instance of the map
   */
  map?: M;
  /**
   * One way to extend WebMap functionality with the help of kits.
   */
  starterKits?: StarterKit[];
  /**
   * A way to save the state of a map to external services
   *
   * @example
   * ```javascript
   * import RuntimeParams from '@nextgis/url-runtime-params';
   * // this will allow to write in the url params of map center and zoomlevel when moving
   * new WebMap({
   *   mapAdapter: new MapAdapter(),
   *   runtimeParams: [new RuntimeParams]
   * })
   * ```
   */
  runtimeParams?: RuntimeParams[];
  /**
   * Аutomatic creation of a map from the constructor
   * @defaultValue false
   *
   * @example
   * ```javascript
   * const webMap = new WebMap(options);
   * // create: false
   * webMap.create().then(() => doSomething());
   * // create: true
   * webMap.emitter.on('created', () => doSomething());
   * ```
   */
  create?: boolean;

  /**
   * The HTML element in which NgwMap will render the map,
   * or the element's string  id.
   * The specified element must have no children.
   */
  target?: string | HTMLElement;
  // logo?: string;

  /**
   * options to specify the initial position of the map
   */
  fitOptions?: FitOptions;
  // TODO: move to mapAdapterOptions
  view?: '2D' | '3D' | '2.5D';
  /**
   * special settings for the selected map adapter
   */
  mapAdapterOptions?: Record<string, any>;
  paint?: GeometryPaint;
  selectedPaint?: GeometryPaint;
  /**
   * The callback function is calling before adding each layer
   */
  onBeforeAddLayer?: OnBeforeLayerAdd;

  /**
   * List of controls that will be initialized when creating a map instance.
   * It can be defined as a string, then points to the corresponding entry in the
   * [controlAdapters](webmap-api#MapAdapter).
   *
   * @defaultValue ['ZOOM', 'ATTRIBUTION']
   *
   * @example
   * ```javascript
   * {
   *   controls: [
   *     'ZOOM',
   *     new CustomControl()
   *   ]
   * }
   * ```
   */
  controls?: Array<keyof MapControls | C>;
  /**
   * Set options for those controls that are specified by name.
   *
   * @example
   * ```javascript
   * {
   *   controls: ['ZOOM', 'button1', 'button2'],
   *   controlsOptions: {
   *     'ZOOM': { position: 'top-right' },
   *     'button1': { control: 'BUTTON', position: 'top-left' },
   *     'button2': { control: 'BUTTON' },
   *   }
   * }
   * ```
   */
  controlsOptions?: ControlsOptions;
  tileJson?: TileJson;
}

export type OnBeforeLayerAdd = (e: {
  adapter?: Type<LayerAdapter>;
  options: AdapterOptions & Record<string, any>;
}) => { adapter?: Type<LayerAdapter>; options?: AdapterOptions } | undefined;

export interface ToggleLayerOptions {
  silent?: boolean;
}

export interface GetAttributionsOptions {
  onlyVisible?: boolean;
  onlyBaselayer?: boolean;
}

export interface ViewOptions {
  /**
   * The minimum zoom level of the map (0-24).
   */
  minZoom?: number;
  /**
   * The maximum zoom level of the map (0-24).
   */
  maxZoom?: number;
  /**
   * The initial zoom level of the map (0-24).
   */
  zoom?: number;
  /**
   * Initial position of the map, array of two degrees [longitude, latitude].
   * [LngLatArray](webmap-api#LngLatArray)
   */
  center?: LngLatArray;
  /**
   * Initial extent of the map, array of degrees in [_west_, _south_, _east_, _north_] order.
   *
   * @remarks
   * Overrides the `center` and  `zoom` parameters.
   * [LngLatBoundsArray](webmap#LngLatBoundsArray)
   *
   * @example
   * ```javascript
   * // whole world
   * bounds: [0, -90, 180, 90]
   * ```
   */
  bounds?: LngLatBoundsArray;
  maxBounds?: LngLatBoundsArray | null;
}
