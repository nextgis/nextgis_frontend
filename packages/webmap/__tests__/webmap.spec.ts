import { mapAdapterTests } from '../../../test/mapAdapterTests';
import { webMapTests } from '../../../test/webMapTests';
import { MapAdapter } from './classes/MapAdapter';

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
