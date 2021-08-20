import type { Geometry } from 'geojson';
import type {
  MapOptions,
  // CirclePaint,
  // PathPaint,
  // IconOptions,
  WebMapEvents,
  RuntimeParams,
} from '@nextgis/webmap';
import type NgwConnector from '@nextgis/ngw-connector';
import type { Credentials } from '@nextgis/ngw-connector';
import type { NgwMap } from './NgwMap';

import type {
  CompanyLogoOptions,
  NgwLayerOptions,
  ResourceAdapter,
  NgwIdentify,
  IdentifyItem,
} from '@nextgis/ngw-kit';
import type { FeatureProperties } from '@nextgis/utils';

export type NgwResourceDefinition = number | [number, string] | NgwLayerOptions;

export interface NgwMapOptions<C = any> extends MapOptions<C> {
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
   * Id number of webmap resource from NGW cloud.
   * If specified through an array,
   * the first element will be the webmapId from NGW,
   * and the second will be the name for identification in the application.
   *
   * @example
   * ```javascript
   *   var ngwMap = new NgwMap({webmapId: [3985, 'my-webmap']});
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
   *   var ngwMap = new NgwMap({qmsId: [465, 'qms-basemap']});
   *   ngwMap.hideLayer('qms-basemap');
   * ```
   */
  resources?: NgwResourceDefinition[];

  qmsId?: number | [number, string];
  /**
   * Shortcut to add OSM baselayer
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
   *
   * @defaultValue false
   */
  identification?: boolean;
  whitlabel?: boolean;
  companyLogoOptions?: CompanyLogoOptions;

  pixelRadius?: number;

  runtimeParams?: RuntimeParams[];

  /** {@inheritDoc AdapterOptions.setViewDelay} */
  setViewDelay?: number;
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
  F = FeatureProperties,
  G extends Geometry = Geometry,
> = NgwIdentify & {
  getIdentifyItems: () => IdentifyItem<F, G>[];
};
