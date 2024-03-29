/* eslint-disable import/order */
import MapAdapter from '@nextgis/leaflet-map-adapter';
import { ReactNgwMap } from '@nextgis/react-ngw-map';
import { Icon } from 'leaflet';
import { createElement } from 'react';

import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { Map } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default as any).prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

export function ReactNgwLeaflet<
  Props extends MapContainerProps = MapContainerProps<Map>,
>(props: Props) {
  const p = { ...props, mapAdapter: new MapAdapter() };
  return createElement(ReactNgwMap, p);
}
