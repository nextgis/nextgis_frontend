import { mapAdapterTests } from '../../../tests/mapAdapterTests';
import { webMapTests } from '../../../tests/webMapTests';
import { MapboxglMapAdapter as MapAdapter } from '../src/MapboxglMapAdapter';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));
// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: jest.fn(() => ({
//     addControl: jest.fn(),
//     on: jest.fn(),
//     remove: jest.fn()
//   })),
//   NavigationControl: jest.fn()
// }));

mapAdapterTests(MapAdapter);
webMapTests(MapAdapter);
