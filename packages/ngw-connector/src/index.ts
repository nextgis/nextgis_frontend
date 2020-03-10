/**
 * @module ngw-connector
 */

import { NgwConnector } from './NgwConnector';

export * from './interfaces';
export * from './types/ResourceItem';
export * from './types/FeatureLayer';
export * from './types/RequestItemsParamsMap';
export * from './types/ResourceStore';

// for backward compatibility
// TODO: safe remove backward compatibility
import CancelablePromise from '@nextgis/cancelable-promise';
export { CancelablePromise };

export { NgwConnector };
export default NgwConnector;
