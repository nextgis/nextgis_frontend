import { transform } from 'ol/proj';

import type MapBrowserPointerEvent from 'ol/MapBrowserEvent';
import { MapClickEvent } from '@nextgis/webmap';

export function convertMapClickEvent(
  evt: MapBrowserPointerEvent,
  displayProjection = 'EPSG:3857',
  lonlatProjection = 'EPSG:4326',
): MapClickEvent {
  const [lng, lat] = transform(
    evt.coordinate,
    displayProjection,
    lonlatProjection,
  );
  const latLng = {
    lat,
    lng,
  };

  return {
    latLng,
    lngLat: [lng, lat],
    pixel: { left: evt.pixel[0], top: evt.pixel[1] },
    source: evt,
  };
}
