import { MapAdapter, AppOptions, Type } from '../../packages/webmap/src';

import NgwMap from '../../packages/ngw-map/src';

import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';

export function createWebMap(MA: Type<MapAdapter>, options?: AppOptions) {
  return new NgwMap(new MA(), options);
}

webMapTests<NgwMap>(FakeMapAdapter, 'NgwMap', createWebMap);
