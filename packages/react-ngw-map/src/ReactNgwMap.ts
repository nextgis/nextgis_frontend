import { createElement, useEffect, useState, useRef, useMemo } from 'react';

import { NgwMapProvider } from './context';
import { useMapElement } from './hooks/useMapElement';

import type { ReactNgwMapProps } from './interfaces';

export function ReactNgwMap<Props extends ReactNgwMapProps = ReactNgwMapProps>({
  whenCreated,
  placeholder,
  className,
  children,
  style,
  id,
  ...options
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const ngwMap = useMapElement(mapRef, options);

  const createdRef = useRef<boolean>(false);
  useEffect(() => {
    if (whenCreated && ngwMap !== null && createdRef.current === false) {
      createdRef.current = true;
      ngwMap.onLoad().then(() => {
        whenCreated(ngwMap);
      });
    }
  }, [ngwMap, [whenCreated]]);

  // on unmount
  useEffect(() => {
    return () => {
      if (ngwMap) {
        ngwMap.destroy();
      }
    };
  }, []);

  const [props] = useState({ className, id, style });
  const context = useMemo(() => (ngwMap ? { ngwMap } : null), [ngwMap]);

  const contents = context
    ? createElement(NgwMapProvider, { value: context }, children)
    : placeholder ?? null;
  const p = { ...props };
  if (!p.id) {
    p.id = 'map';
  }
  return createElement('div', { ...p, ref: mapRef }, contents);
}
