import { mapAdapterTests } from '../../../tests/mapAdapterTests';
import { webMapTests } from '../../../tests/webMapTests';
import { OlMapAdapter as MapAdapter } from '../src/OlMapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
