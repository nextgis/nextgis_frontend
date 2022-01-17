// import NgwMap from '@nextgis/ngw-leaflet';
// import NgwMap from '@nextgis/ngw-ol';
import { NgwMap } from '@nextgis/ngw-map';
import { useEffect, useState } from 'react';

import type { MutableRefObject } from 'react';
import type { MapContainerProps } from '../interfaces';

export function useMapElement(
  mapRef: MutableRefObject<HTMLElement | null>,
  props: MapContainerProps,
): NgwMap | null {
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (mapRef.current !== null && ngwMap === null) {
      const ngwMap = new NgwMap({
        target: mapRef.current,
        ...props,
      });
      if (props.center !== null && props.zoom !== null) {
        ngwMap.setView(props);
      }
      setNgwMap(ngwMap);
    }
  }, [mapRef, ngwMap, props]);

  return ngwMap;
}
