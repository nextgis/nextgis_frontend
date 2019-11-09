import { mapAdapterTests } from '../../../test/mapAdapterTests';
import { webMapTests } from '../../../test/webMapTests';
import { MapboxglMapAdapter as MapAdapter } from '../src/MapboxglMapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
