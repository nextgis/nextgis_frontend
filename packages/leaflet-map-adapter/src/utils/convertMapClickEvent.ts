import type { MapClickEvent } from '@nextgis/webmap';
import type { LeafletMouseEvent } from 'leaflet';

export function convertMapClickEvent(evt: LeafletMouseEvent): MapClickEvent {
  const coord = evt.containerPoint;
  const latLng = evt.latlng;
  const { lat, lng } = latLng;
  return {
    latLng,
    lngLat: [lng, lat],
    pixel: { left: coord.x, top: coord.y },
    source: evt,
  };
}
