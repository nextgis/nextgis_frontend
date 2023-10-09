import { useEffect, useState, useRef } from 'react';
import { NgwMap } from '@nextgis/ngw-map';

import { shallowEqual } from '../utils/shallowEqual';

import type { MutableRefObject } from 'react';
import type { MapContainerProps } from '../interfaces';

export function useMapElement(
  mapRef: MutableRefObject<HTMLElement | null>,
  { center, zoom, ...restProps }: MapContainerProps,
): NgwMap | null {
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  const prevPropsRef = useRef<MapContainerProps | null>(null);

  useEffect(() => {
    const propsChanged = prevPropsRef.current
      ? !shallowEqual(prevPropsRef.current, restProps)
      : true;

    if (!mapRef.current || ngwMap || !propsChanged) return;

    const newNgwMap = new NgwMap({
      target: mapRef.current,
      ...restProps,
    });

    setNgwMap(newNgwMap);

    if (propsChanged) {
      prevPropsRef.current = restProps;
    }

    return () => {
      newNgwMap.destroy();
    };
  }, [mapRef, restProps]);

  useEffect(() => {
    if (ngwMap && center && zoom) {
      ngwMap.setView({ center, zoom });
    }
  }, [ngwMap, center, zoom]);

  return ngwMap;
}
