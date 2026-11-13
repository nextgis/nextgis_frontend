import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

import { geoJsonLayerTests } from '../helpers/universalTestCases/geoJsonLayerTests';

webMapTests(LeafletMapAdapter);
mapAdapterTests(LeafletMapAdapter);
geoJsonLayerTests(LeafletMapAdapter);
