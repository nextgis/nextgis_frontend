import 'maplibre-gl/dist/maplibre-gl.css';

import { MaplibreGLMapAdapter } from '@nextgis/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { webMapTests } from '../helpers/universalTestCases/webMapTests';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';

import { geoJsonLayerTests } from '../helpers/universalTestCases/geoJsonLayerTests';

webMapTests(MaplibreGLMapAdapter);
mapAdapterTests(MaplibreGLMapAdapter);
geoJsonLayerTests(MaplibreGLMapAdapter);
