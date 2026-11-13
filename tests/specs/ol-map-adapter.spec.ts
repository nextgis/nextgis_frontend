import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

import { geoJsonLayerTests } from '../helpers/universalTestCases/geoJsonLayerTests';

webMapTests(OlMapAdapter);
mapAdapterTests(OlMapAdapter);
geoJsonLayerTests(OlMapAdapter);
