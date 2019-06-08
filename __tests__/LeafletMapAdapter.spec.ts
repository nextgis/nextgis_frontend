import { WebMap } from '../packages/webmap/src/WebMap';
import { LeafletMapAdapter as MapAdapter} from '../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { AppOptions } from '../packages/webmap/src/interfaces/WebMapApp';

const adapterName = 'LeafletMapAdapter';
const createWebMap = (options?: AppOptions) => {
  return new WebMap({mapAdapter: new MapAdapter(), ...options});
};

it(`Initialize WebMap with ${adapterName}`, () => {
  const mapAdapter = new MapAdapter();
  const webMap = new WebMap({mapAdapter});
  expect(webMap.mapAdapter).toBe(mapAdapter);
});
