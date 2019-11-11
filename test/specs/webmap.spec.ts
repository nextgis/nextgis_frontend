import { FakeMapAdapter } from '../../packages/webmap/src/test/FakeMapAdapter';
import { webMapTests } from '../helpers/universal/webMapTests';
import { mapAdapterTests } from '../helpers/universal/mapAdapterTests';

webMapTests(FakeMapAdapter);
mapAdapterTests(FakeMapAdapter);
