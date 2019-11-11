import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { webMapTests } from '../helpers/universal/webMapTests';
import { mapAdapterTests } from '../helpers/universal/mapAdapterTests';

webMapTests(OlMapAdapter);
mapAdapterTests(OlMapAdapter);
