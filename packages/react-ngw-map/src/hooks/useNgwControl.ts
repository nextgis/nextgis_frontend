import { useEffect } from 'react';

import type { MutableRefObject } from 'react';
import type { ControlPosition } from '@nextgis/webmap';
import type { NgwMapContextInterface } from '../interfaces';

export function useNgwControl(
  context: NgwMapContextInterface,
  instance: MutableRefObject<Promise<unknown>>,
  position?: ControlPosition,
): MutableRefObject<Promise<unknown>> {
  const pos = position || 'top-left';
  useEffect(
    function addControl() {
      context.ngwMap.addControl(instance.current, pos);

      return function removeControl() {
        context.ngwMap.removeControl(instance.current);
      };
    },
    [context.ngwMap, instance],
  );

  return instance;
}
