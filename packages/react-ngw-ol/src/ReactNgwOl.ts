import MapAdapter from '@nextgis/ol-map-adapter';
import { ReactNgwMap } from '@nextgis/react-ngw-map';
import { createElement } from 'react';

import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type Map from 'ol/Map';

import 'ol/ol.css';

export function ReactNgwOl<
  Props extends MapContainerProps = MapContainerProps<Map>,
>(props: Props) {
  const p = { ...props, mapAdapter: new MapAdapter() };
  return createElement(ReactNgwMap, p);
}
