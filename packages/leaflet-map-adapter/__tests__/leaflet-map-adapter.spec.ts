import { mapAdapterTests } from '../../../tests/mapAdapterTests';
import { webMapTests } from '../../../tests/webMapTests';
import { LeafletMapAdapter as MapAdapter } from '../src/LeafletMapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
