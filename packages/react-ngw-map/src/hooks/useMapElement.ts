import { NgwMap } from '@nextgis/ngw-map';
import { useEffect, useRef, useState } from 'react';

import type { RefObject } from 'react';

import type { MapContainerProps } from '../interfaces';

export function useMapElement(
  mapRef: RefObject<HTMLElement | null>,
  props: MapContainerProps,
): NgwMap | null {
  const { center, zoom, bounds, maxBounds, maxZoom } = props;
  const isReady = useRef(false);
  const isStarting = useRef(false);
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (isStarting.current || !mapRef.current || ngwMap) return;
    isStarting.current = true;
    let cancelled = false;
    let newNgwMap: NgwMap | undefined;

    Promise.resolve().then(() => {
      if (cancelled || !mapRef.current) return;
      newNgwMap = new NgwMap({
        ...props,
        target: mapRef.current,
      });
      newNgwMap.onLoad().then(() => {
        if (cancelled) return;
        isReady.current = true;
        isStarting.current = false;
        setNgwMap(newNgwMap!);
      });
    });

    return () => {
      cancelled = true;
      isReady.current = false;
      isStarting.current = false;
      newNgwMap?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!ngwMap) return;

    if (isReady.current) {
      if (bounds) {
        ngwMap.setView({ bounds });
      } else if (center && zoom !== undefined) {
        ngwMap.setView({ center, zoom });
      }
    }
    if (maxBounds) {
      ngwMap.setView({ maxBounds });
    }
    if (maxZoom !== undefined) {
      ngwMap.setView({ maxZoom });
    }
  }, [ngwMap, center, zoom, bounds, maxBounds, maxZoom]);

  return ngwMap;
}
