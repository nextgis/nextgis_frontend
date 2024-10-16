import { NgwMap } from '@nextgis/ngw-map';
import { useEffect, useRef, useState } from 'react';

import type { MutableRefObject } from 'react';

import type { MapContainerProps } from '../interfaces';

export function useMapElement(
  mapRef: MutableRefObject<HTMLElement | null>,
  props: MapContainerProps,
): NgwMap | null {
  const { center, zoom, bounds, maxBounds, maxZoom } = props;
  const isReady = useRef(false);
  const isStarting = useRef(false);
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (isStarting.current || !mapRef.current || ngwMap) return;
    isStarting.current = true;
    const newNgwMap = new NgwMap({
      target: mapRef.current,
      ...props,
    });
    newNgwMap.onLoad().then(() => {
      isReady.current = true;
      isStarting.current = false;
    });
    setNgwMap(newNgwMap);
  }, []);

  useEffect(() => {
    if (!ngwMap) return;

    if (isReady.current) {
      if (bounds) {
        ngwMap.setView({ bounds });
      } else if (center && zoom) {
        ngwMap.setView({ center, zoom });
      }
    }
    if (maxBounds) {
      ngwMap.setView({ maxBounds });
    }
    if (maxZoom) {
      ngwMap.setView({ maxZoom });
    }
  }, [ngwMap, isReady.current, center, zoom, bounds, maxBounds, maxZoom]);

  useEffect(() => {
    return () => {
      if (ngwMap) {
        ngwMap.destroy();
      }
    };
  }, []);

  return ngwMap;
}
