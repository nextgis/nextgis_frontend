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

} from '@nextgis/webmap';
import { NgwLayerOptions } from '@nextgis/ngw-kit';

export interface ControlOptions {
  position?: ControlPositions;
}

export interface NgwMapOptions extends MapOptions {
  /**
   * Url of NGW server like this https://demo.nextgis.com
   */
  baseUrl?: string;
  /**
   * Id number of webmap resource from NGW cloud.
   * If specified through an array,
   * the first element will be the webmapId from NGW,
   * and the second will be the name for identification in the application.
   *
   * @example
   * ```javascript
   *   var ngwMap = new NgwMap({webmapId: [3985, 'my-webmap']});
   *   ngwMap.webMap.hideLayer('my-webmap');
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
   *   ngwMap.webMap.hideLayer('qms-basemap');
   * ```
   */
  qmsId?: number | [number, string];
  /**
   * Set default paint for vector layers geometry objects.
   */
  VectorLayersDefaultPaint?: {
    circle: CirclePaint,
    path: PathPaint,
    icon: IconOptions
  };
  /**
   * List of controls that will be initialized when creating a map instance.
   * It can be defined as a string, then points to the corresponding entry in the
   * [MapAdapter.controlAdapters](webmap#MapAdapter).
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
  controls?: Array<string | MapControl>;
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
