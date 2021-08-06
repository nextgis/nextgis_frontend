/**
 * A lightweight HTTP client optimized for use with {@link http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html | NextGIS Web} API
 *
 * @remarks
 * Make sure CORS is registered in the {@link https://docs.nextgis.com/docs_ngcom/source/CORS.html | NextGIS Web settings } to be able to send requests.
 *
 * @packageDocumentation
 * @module ngw-connector
 */
import { NgwConnector } from './NgwConnector';

export * from './interfaces';
export * from './types/ResourceItem';
export * from './types/FeatureLayer';
export * from './types/RequestItemsParamsMap';
export * from './types/ResourceStore';

// export { NgwConnector };
export default NgwConnector;
