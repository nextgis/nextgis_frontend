import { useEffect } from 'react';


import type { ControlPosition } from '@nextgis/webmap';
import type { NgwMapContextInterface } from '../interfaces';

export function useNgwControl({context, instance, position}: {
  context: NgwMapContextInterface,
  instance: Promise<unknown>,
  position?: ControlPosition,
}): Promise<unknown> {
  const pos = position || 'top-left';
  useEffect(
    function addControl() {
      context.ngwMap.addControl(instance, pos);

      return function removeControl() {
        context.ngwMap.removeControl(instance);
      };
    },
    [context.ngwMap, instance],
  );

  return instance;
}
