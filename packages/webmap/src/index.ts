/**
 * The library that allows to use a single interface for managing various interactive map frameworks.
 *
 * @remarks
 * The following adapters are available:
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/leaflet-map-adapter | @nextgis/leaflet-map-adapter},
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/ol-map-adapter | @nextgis/ol-map-adapter},
 * {@link https://github.com/nextgis/nextgis_frontend/tree/master/packages/maplibre-gl-map-adapter | @nextgis/maplibre-gl-map-adapter}
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
 * // import MapAdapter from '@nextgis/maplibre-gl-map-adapter';
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

export * from './components/controls/createToggleControl';

export * from './utils/geometryTypes';
export * from './utils/getDefaultControls';
export * from './utils/updateGeoJsonAdapterOptions';

export * from './container';

export * from './WebMapLayers';
export * from './WebMapControls';
export * from './WebMapMain';

export * from './interfaces/Events';
export * from './interfaces/BaseTypes';
export * from './interfaces/MapOptions';
export * from './interfaces/MapAdapter';
export * from './interfaces/MapControl';
export * from './interfaces/LegendItem';
export * from './interfaces/StarterKit';
export * from './interfaces/LayerAdapter';
export * from './interfaces/RuntimeParams';

export { WebMap };

export async function createWebMap(options: MapOptions): Promise<WebMap> {
  const webMap = new WebMap(options);
  return webMap.onLoad();
}
