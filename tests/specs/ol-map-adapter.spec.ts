import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

webMapTests(OlMapAdapter);
mapAdapterTests(OlMapAdapter);
