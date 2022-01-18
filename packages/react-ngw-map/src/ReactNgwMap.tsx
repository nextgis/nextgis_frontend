import React,{
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';

import { CONTEXT_VERSION, NgwMapProvider } from './context';
import { useMapElement } from './hooks/useMapElement';

import type { MapContainerProps } from './interfaces';



export function ReactNgwMap<
  Props extends MapContainerProps = MapContainerProps,
>({
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
  const context = useMemo(
    () => (ngwMap ? { __version: CONTEXT_VERSION, ngwMap } : null),
    [ngwMap],
  );

  const contents = context ? (
    <NgwMapProvider value={context}>{children}</NgwMapProvider>
  ) : (
    placeholder ?? null
  );
  const p = { ...props };
  if (!p.id) {
    p.id = 'map';
  }
  return (
    <div {...p} ref={mapRef}>
      {contents}
    </div>
  );
}
