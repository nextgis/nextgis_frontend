/**
 * The library that allows to use a single interface for managing various interactive map frameworks.
 *
 * @remarks
 * The following adapters are available:
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/leaflet-map-adapter | @nextgis/leaflet-map-adapter},
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/ol-map-adapter | @nextgis/ol-map-adapter},
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/mapboxgl-map-adapter | @nextgis/mapbox-map-adapter}
 * and experimental {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/cesium-map-adapter | @nextgis/cesium-map-adapter}.
 *
 * @example
 * ```javascript
 * import { WebMap } from "@nextgis/webmap";
 *
 * import "./leaflet-style-override.css";
 * import MapAdapter from "@nextgis/leaflet-map-adapter";
 * // OR
 * // import 'ol/ol.css';
 * // import MapAdapter from '@nextgis/ol-map-adapter';
 * // OR
 * // import 'maplibre-gl/dist/maplibre-gl.css';
 * // import MapAdapter from '@nextgis/mapboxgl-map-adapter';
 *
 * const webMap = new WebMap({
 *   mapAdapter: new MapAdapter(),
 *   target: 'map',
 * });
 *
 * console.log(!!webMap.mapAdapter.map); // false
 * webMap.onLoad().then(() => {
 *   console.log(webMap.mapAdapter.map); // true
 *
 *   webMap.addLayer('GEOJSON').then((layer) => {
 *     webMap.setLayerData(layer, geojson)
 *   });
 * });
 * ```
 *
 * @packageDocumentation
 * @module webmap
 */
import { WebMap } from './WebMap';
import type { MapOptions } from './interfaces/MapOptions';

export { createToggleControl } from './components/controls/createToggleControl';

export {
  detectGeometryType,
  findMostFrequentGeomType,
} from './utils/geometryTypes';
export { getDefaultControls } from './utils/getDefaultControls';
export { updateGeoJsonAdapterOptions } from './utils/updateGeoJsonAdapterOptions';

export { getWebMap } from './container';

export * from './WebMapLayers';
export * from './WebMapControls';
export * from './WebMapMain';

export type * from './interfaces/Events';
export type * from './interfaces/BaseTypes';
export type * from './interfaces/MapOptions';
export type * from './interfaces/MapAdapter';
export type * from './interfaces/MapControl';
export type * from './interfaces/StarterKit';
export type * from './interfaces/LayerAdapter';
export type * from './interfaces/RuntimeParams';

export { WebMap };

export async function createWebMap(options: MapOptions): Promise<WebMap> {
  const webMap = new WebMap(options);
  return webMap.onLoad();
}
