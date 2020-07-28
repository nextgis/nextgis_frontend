import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

webMapTests(LeafletMapAdapter);
mapAdapterTests(LeafletMapAdapter);
