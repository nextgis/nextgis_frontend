import { createElement, useEffect, useMemo, useRef } from 'react';

import { useMapElement } from './hooks/useMapElement';
import { NgwMapProvider } from './context';

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
  }, [ngwMap, whenCreated]);

  const context = useMemo(() => (ngwMap ? { ngwMap } : null), [ngwMap]);

  const contents = context
    ? createElement(NgwMapProvider, { value: context }, children)
    : (placeholder ?? null);
  const p = { className, id, style };
  return createElement('div', { ...p, ref: mapRef }, contents);
}
