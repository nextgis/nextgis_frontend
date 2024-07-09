import type { NgwMap } from './NgwMap';
import type NgwConnector from '@nextgis/ngw-connector';
import type { Credentials } from '@nextgis/ngw-connector';
import type {
  CompanyLogoOptions,
  IdentifyItem,
  NgwIdentify,
  NgwLayerOptions,
  ResourceAdapter,
} from '@nextgis/ngw-kit';
import type { FeatureProperties } from '@nextgis/utils';
import type { MapOptions, RuntimeParams, WebMapEvents } from '@nextgis/webmap';
import type { Geometry } from 'geojson';

export type NgwResourceDefinition = number | [number, string] | NgwLayerOptions;

export interface NgwMapOptions<M = any, C = any> extends MapOptions<M, C> {
  /**
   * Url of NGW server like this https://demo.nextgis.com
   */
  baseUrl?: string;
  connector?: NgwConnector;
  /**
   * User credentials for authorization in NGW.
   * Provides the ability to display protected resources
   */
  auth?: Credentials;
  /**
   * Indicates whether to include cookies in cross-site Access-Control requests.
   * Note that setting this property has no effect on same-origin requests.
   */
  withCredentials?: boolean;
  /**
   * Id number of webmap resource from NextGIS Web.
   * If specified through an array,
   * the first element will be the webmapId from NGW,
   * and the second will be the name for identification in the application.
   *
   * @example
   * ```javascript
   *   const ngwMap = new NgwMap({webmapId: [3985, 'my-webmap']});
   *   ngwMap.hideLayer('my-webmap');
   * ```
   */
  webmapId?: NgwResourceDefinition;
  /**
   * Id number of resource from [QMS](https://qms.nextgis.com/).
   * If specified through an array,
   * the first element will be the resource identifier,
   * and the second will be the name for identification in the application.
   *
   * @example
   * ```javascript
   *   const ngwMap = new NgwMap({qmsId: [465, 'qms-basemap']});
   *   ngwMap.hideLayer('qms-basemap');
   * ```
   */
  qmsId?: number | [number, string];
  /**
   * List of NGW resources to be displayed on the map.
   *
   * The resources list may include:
   *
   * - number - resource id; // also for resource
   * - string - resource keyname; // also for resource
   * - object - configuration of the layer to be added
   * with the one required parameter `resource` (the comment "also for resource" above refers to it)
   *
   * @example
   * ```javascript
   * NgwMap.create({
   *   baseUrl: "https://demo.nextgis.com",
   *   target: "map",
   *   resources: [
   *     // Basemap resource
   *     1665,
   *     // Digital Elevation Model (DEM)-style
   *     4117,
   *     // Hillshade-style
   *     { resource: 4115, adapter: "TILE", opacity: 0.3 },
   *     // Elevation contours-style
   *     'contours-style',
   *     // Vector from Order boundary-style
   *     {
   *       resource: 4111,
   *       fit: true,
   *       adapter: "GEOJSON",
   *       adapterOptions: { paint: { color: "red", fill: false, weight: 4 } },
   *     },
   *   ],
   * });
   * ```
   */
  resources?: NgwResourceDefinition[];
  /**
   * Shortcut to add OSM baselayer.
   */
  osm?: boolean;
  /**
   * Set default paint for vector layers geometry objects.
   */
  // vectorLayersDefaultPaint?: {
  //   circle: CirclePaint,
  //   path: PathPaint,
  //   icon: IconOptions
  // };

  /**
   * Get information from NGW webmap layers by click.
   * TODO: find usage
   * @defaultValue false
   * @internal
   */
  identification?: boolean;
  whitlabel?: boolean;
  companyLogoOptions?: CompanyLogoOptions;

  pixelRadius?: number;

  runtimeParams?: RuntimeParams[];

  setViewDelay?: number;

  highlightIdentification?: boolean | number;
}

export interface NgwMapEvents extends WebMapEvents {
  'ngw-map:create': NgwMap;
  'ngw:select': NgwIdentifyEvent | null;
  'ngw:preselect': void;
}

export interface NgwLayersMem {
  layer: ResourceAdapter;
  resourceId: number;
}

export interface NgwLayers {
  [layerId: string]: NgwLayersMem;
}

export type NgwIdentifyEvent<
  F extends FeatureProperties = FeatureProperties,
  G extends Geometry = Geometry,
> = NgwIdentify & {
  getIdentifyItems: () => IdentifyItem<F, G>[];
};
