/**
 * @module vue-ngw-map
 */
import { VueNgwMap } from './components/VueNgwMap';
import { ResourceStore, createResourceStore } from './store/ResourceStore/ResourceStore';

export * from './components/VueNgwResource';

export { VueNgwMap, createResourceStore, ResourceStore };
export default VueNgwMap;
