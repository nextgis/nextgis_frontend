import type { MapClickEvent } from '@nextgis/webmap';
import type { MapEventType, MapMouseEvent } from 'maplibre-gl';

export function convertMapClickEvent(
  evt: MapEventType['click'] & MapMouseEvent,
): MapClickEvent {
  const latLng = evt.lngLat;
  const { lng, lat } = latLng;
  const { x, y } = evt.point;
  return {
    latLng,
    lngLat: [lng, lat],
    pixel: { top: y, left: x },
  };
}
