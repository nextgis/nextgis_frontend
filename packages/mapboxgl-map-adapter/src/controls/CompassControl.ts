import { NavigationControl } from 'maplibre-gl';

export function CompassControl(options: Record<string, unknown>) {
  return new NavigationControl({ ...options, showZoom: false });
}
