import MapAdapter from '@nextgis/maplibre-gl-map-adapter';
import { ReactNgwMap } from '@nextgis/react-ngw-map';
import { createElement } from 'react';

import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { Map } from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

export function ReactNgwMaplibreGL<
  Props extends MapContainerProps = MapContainerProps<Map>,
>(props: Props) {
  const p = { ...props, mapAdapter: new MapAdapter() };
  return createElement(ReactNgwMap, p);
}
