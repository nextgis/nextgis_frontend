/**
 * WebMap plugin and utilities that allow you to interact with NextGIS Web.
 *
 * @remarks
 * Make sure CORS is registered in the {@link https://docs.nextgis.com/docs_ngcom/source/CORS.html | NextGIS Web settings } to be able to send requests.
 *
 * @example
 * As WebMap starter kit example
 * ```javascript
 * import { NgwKit } from '@nextgis/ngw-kit';
 * import { createWebMap } from '@nextgis/webmap';
 * import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
 *
 * import 'leaflet/dist/leaflet.css';
 *
 * createWebMap({
 *   mapAdapter: new LeafletMapAdapter(),
 *   starterKits: [
 *     new NgwKit({
 *       baseUrl: 'YOU NEXTGIS WEB URL',
 *       resource: 'WEBMAP RESOURCE ID',
 *     }),
 *   ],
 * });
 * ```
 * @example
 * Get NGW vector layer items
 * ```javascript
 * import { getNgwLayerItem, getNgwLayerItems } from '@nextgis/ngw-kit';
 * import NgwConnector from '@nextgis/ngw-connector';
 *
 * const connector = new NgwConnector({ baseUrl: 'YOU NEXTGIS WEB URL'});
 *
 * getNgwLayerItem({
 *   resourceId: 2011,
 *   featureId: 1,
 *   connector: connector
 * }).then((item) => { ... });
 *
 * getNgwLayerItems({
 *   resourceId: 2011,
 *   offset: 10,
 *   limit: 300,
 *   fields: ['name', 'year', 'Ni', 'Cu', 'Pt', 'Pd', 'Au']
 *   orderBy: ['year']
 * }).then((items) => { ... });
 * ```
 *
 * @packageDocumentation
 * @module ngw-kit
 */
import { NgwKit } from './NgwKit';

export * from './NgwResource';
export * from './NgwWebmapLayerAdapter';
export * from './NgwWebmapItem';
export * from './IdentifyItem';

export * from './utils/utils';
export * from './utils/identifyUtils';
export * from './utils/fetchNgwExtent';
export * from './utils/getCompanyLogo';
export * from './utils/parseDateFromNgw';
export * from './utils/featureLayerUtils';
export * from './utils/fetchNgwLayerItem';
export * from './utils/createPopupContent';
export * from './utils/fetchNgwLayerItems';
export * from './utils/fetchNgwLayerFeature';
export * from './utils/uploadFeatureAttachment';
export * from './utils/mapFeatureDisplayName';
export * from './utils/fetchNgwLayerFeatures';
export * from './utils/resourceIdFromLayerOptions';
export * from './utils/fetchNgwLayerFeatureCollection';

export * from './adapters/createOnFirstShowNgwAdapter';
export * from './adapters/createOnFirstShowAdapter';
export * from './adapters/createGeoJsonAdapter';
export * from './adapters/createRasterAdapter';

export { NgwKit };

export * from './interfaces';
