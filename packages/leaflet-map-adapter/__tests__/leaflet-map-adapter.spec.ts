import { mapAdapterTests } from '../../../test/mapAdapterTests';
import { webMapTests } from '../../../test/webMapTests';
import { LeafletMapAdapter as MapAdapter } from '../src/LeafletMapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
