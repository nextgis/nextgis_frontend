import 'mapbox-gl/dist/mapbox-gl.css';

import { MapboxglMapAdapter } from '../../packages/mapboxgl-map-adapter/src/MapboxglMapAdapter';
import { webMapTests } from '../helpers/universal/webMapTests';
import { mapAdapterTests } from '../helpers/universal/mapAdapterTests';

webMapTests(MapboxglMapAdapter);
mapAdapterTests(MapboxglMapAdapter);
