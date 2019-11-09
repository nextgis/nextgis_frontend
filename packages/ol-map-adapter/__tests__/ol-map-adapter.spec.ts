import { mapAdapterTests } from '../../../test/mapAdapterTests';
import { webMapTests } from '../../../test/webMapTests';
import { OlMapAdapter as MapAdapter } from '../src/OlMapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
