import { useEffect, useRef } from 'react';

import type { NgwIdentifyEvent, NgwMap } from '@nextgis/ngw-map';

import type { IdentifyHandlers } from '../interfaces';

export function useIdentifyEvents(
  map: NgwMap | null,
  handlers: IdentifyHandlers,
): void {
  const { onIdentify, onIdentifyStart, onIdentifyError } = handlers;
  const callbacks = useRef(handlers);
  useEffect(() => {
    callbacks.current = { onIdentify, onIdentifyStart, onIdentifyError };
  }, [onIdentify, onIdentifyStart, onIdentifyError]);

  const enabled = Boolean(onIdentify || onIdentifyStart || onIdentifyError);
  useEffect(() => {
    if (!map || !enabled) return;
    const onStart = () => callbacks.current.onIdentifyStart?.();
    const onResult = (event: NgwIdentifyEvent | null) => {
      callbacks.current.onIdentify?.(event?.getIdentifyItems() ?? [], event);
    };
    const onError = (error: unknown) =>
      callbacks.current.onIdentifyError?.(error);

    map.emitter.on('ngw:preselect', onStart);
    map.emitter.on('ngw:select', onResult);
    map.emitter.on('ngw:selecterror', onError);
    return () => {
      map.emitter.removeListener('ngw:preselect', onStart);
      map.emitter.removeListener('ngw:select', onResult);
      map.emitter.removeListener('ngw:selecterror', onError);
      if (!map.emitter.listenerCount('ngw:select')) {
        map.cancelPromises('select');
      }
    };
  }, [map, enabled]);
}
