import { useEffect, useState, useRef } from 'react';
import { NgwMap } from '@nextgis/ngw-map';

import type { MutableRefObject } from 'react';
import type { MapContainerProps } from '../interfaces';

export function useMapElement(
  mapRef: MutableRefObject<HTMLElement | null>,
  props: MapContainerProps,
): NgwMap | null {
  const { center, zoom } = props;
  const isReady = useRef(false);
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (!mapRef.current || ngwMap) return;

    const newNgwMap = new NgwMap({
      target: mapRef.current,
      ...props,
    });
    newNgwMap.onLoad().then(() => {
      isReady.current = true;
    });
    setNgwMap(newNgwMap);
  }, [mapRef]);

  useEffect(() => {
    if (ngwMap && isReady.current && center && zoom) {
      ngwMap.setView({ center, zoom });
    }
  }, [ngwMap, center, zoom]);

  useEffect(() => {
    return () => {
      if (ngwMap) {
        ngwMap.destroy();
      }
    };
  }, []);

  return ngwMap;
}
