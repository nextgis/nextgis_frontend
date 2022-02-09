import { createElement } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import MapAdapter from '@nextgis/mapboxgl-map-adapter';
import { ReactNgwMap } from '@nextgis/react-ngw-map';

import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { Map } from 'maplibre-gl';

export function ReactNgwMapbox<
  Props extends MapContainerProps = MapContainerProps<Map>,
>(props: Props) {
  const p = { ...props, mapAdapter: new MapAdapter() };
  return createElement(ReactNgwMap, p);
}
