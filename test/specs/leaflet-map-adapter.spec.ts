import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { webMapTests } from '../helpers/universal/webMapTests';
import { mapAdapterTests } from '../helpers/universal/mapAdapterTests';

webMapTests(LeafletMapAdapter);
mapAdapterTests(LeafletMapAdapter);
