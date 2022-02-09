import { createElement } from 'react';

import MapAdapter from '@nextgis/ol-map-adapter';
import { ReactNgwMap } from '@nextgis/react-ngw-map';

import 'ol/ol.css';

import type Map from 'ol/Map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';

export function ReactNgwOl<
  Props extends MapContainerProps = MapContainerProps<Map>,
>(props: Props) {
  const p = { ...props, mapAdapter: new MapAdapter() };
  return createElement(ReactNgwMap, p);
}
