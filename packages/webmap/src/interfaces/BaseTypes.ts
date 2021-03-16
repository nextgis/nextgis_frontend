import type {
  Type,
  ZoomLevel,
  LatLng,
  LngLatBoundsArray,
  LngLatArray,
} from '@nextgis/utils';
import type { LayerAdapter } from './LayerAdapter';

/**
 * @deprecated - import from {@link @nextgis/utils} instead
 */
export type { Type, ZoomLevel, LatLng, LngLatBoundsArray, LngLatArray };

/**
 * Screen coordinates in pixels.
 * @public
 */
export interface Pixel {
  top: number;
  left: number;
  right?: number;
  bottom?: number;
}

/**
 * Available argument types for methods with map layers identification.
 *
 * @example
 * ```javascript
 * webMap.addLayer('GEOJSON', { id: 'my_layer' }).then((layer) =>{
 *   webMap.addLayerData(layer, geojson);
 *   webMap.addLayerData('my_layer', geojson);
 * });
 * ```
 * @public
 */
export type LayerDef = string | LayerAdapter;

/**
 * Available cursor names from
 * {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor}
 * @ignore
 */
export type Cursor =
  | 'auto'
  | 'crosshair'
  | 'default'
  | 'e-resize'
  | 'grab'
  | 'help'
  | 'move'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'pointer'
  | 'progress'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'text'
  | 'w-resize'
  | 'wait'
  | 'inherit';
