import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

webMapTests(FakeMapAdapter);
mapAdapterTests(FakeMapAdapter);
