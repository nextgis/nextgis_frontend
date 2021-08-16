import type { MapClickEvent } from '@nextgis/webmap';
import type { EventData, MapEventType } from 'maplibre-gl';

export function convertMapClickEvent(
  evt: MapEventType['click'] & EventData,
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
