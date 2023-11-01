import { useEffect, useRef } from 'react';

import type { ControlPosition, MapControl } from '@nextgis/webmap';
import type { NgwMapContextInterface } from '../interfaces';

export function useNgwControl({
  context,
  instance,
  position,
}: {
  context: NgwMapContextInterface;
  instance?: Promise<unknown>;
  position?: ControlPosition;
}) {
  const pos = position || 'top-left';
  const added = useRef<MapControl>();
  useEffect(
    function addControl() {
      if (instance) {
        context.ngwMap.addControl(instance, pos).then((control) => {
          added.current = control;
        });
      }

      return function removeControl() {
        if (added.current) {
          context.ngwMap.removeControl(added.current);
        }
      };
    },
    [context.ngwMap, instance],
  );

  return {
    container:
      added.current &&
      added.current.getContainer &&
      added.current.getContainer(),
  };
}
