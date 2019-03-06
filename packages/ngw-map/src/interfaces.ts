/**
 * @module ngw-map
 */

import {
  MapOptions,
  ControlPositions,
  CirclePaint,
  PathPaint,
  IconOptions,
  LngLatBoundsArray,
  MapControl,
  MapControls,

} from '@nextgis/webmap';
import { NgwLayerOptions } from '@nextgis/ngw-kit';
import { Credentials } from '@nextgis/ngw-connector';

export interface ControlOptions {
  position?: ControlPositions;
}

export interface NgwMapOptions<C = any> extends MapOptions {
  /**
   * Url of NGW server like this https://demo.nextgis.com
   */
  baseUrl?: string;
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
  webmapId?: number | [number, string];
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
  qmsId?: number | [number, string];
  /**
   * Set default paint for vector layers geometry objects.
   */
  vectorLayersDefaultPaint?: {
    circle: CirclePaint,
    path: PathPaint,
    icon: IconOptions
  };
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
   *   controls: ['ZOOM'],
   *   controlsOptions: {
   *     'ZOOM': { position: 'top-right' }
   *   }
   * }
   * ```
   */
  controlsOptions?: { [controlName: string]: any };
}

export { NgwLayerOptions };
