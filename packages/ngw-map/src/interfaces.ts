/**
 * @module ngw-map
 */

import {
  MapOptions,
  ControlPositions,
  // CirclePaint,
  // PathPaint,
  // IconOptions,
  MapControls,
  WebMapEvents,
  RuntimeParams
} from '@nextgis/webmap';
import {
  NgwLayerOptions,
  ResourceAdapter,
  NgwIdentify
} from '@nextgis/ngw-kit';
import NgwConnector, { Credentials } from '@nextgis/ngw-connector';
import { NgwMap } from './NgwMap';

export { NgwLayerOptions };

export interface ControlOptions {
  [param: string]: any;
  position?: ControlPositions;
  control?: string;
}

export type NgwResourceDefinition = number | [number, string] | NgwLayerOptions;

interface ControlsOptions {
  [control: string]: ControlOptions;
}

export interface NgwMapOptions<C = any> extends MapOptions {
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
   * Set default paint for vector layers geometry objects.
   */
  // vectorLayersDefaultPaint?: {
  //   circle: CirclePaint,
  //   path: PathPaint,
  //   icon: IconOptions
  // };
  /**
   * List of controls that will be initialized when creating a map instance.
   * It can be defined as a string, then points to the corresponding entry in the
   * [controlAdapters](webmap-api#MapAdapter).
   *
   * @default ['ZOOM', 'ATTRIBUTION']
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
  /**
   * Get information from NGW webmap layers by click.
   *
   * @default false
   */
  identification?: boolean;

  pixelRadius?: number;

  runtimeParams?: RuntimeParams[];
}

export interface NgwMapEvents extends WebMapEvents {
  'controls:create': any;
  'ngw-map:create': NgwMap;
  'ngw:select': NgwIdentify | null;
  'ngw:preselect': void;
}

export interface NgwLayersMem {
  layer: ResourceAdapter;
  resourceId: number;
}

export interface NgwLayers {
  [layerId: string]: NgwLayersMem;
}
