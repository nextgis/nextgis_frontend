import { useEffect, useRef, useState } from 'react';

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
  const [container, setContainer] = useState<HTMLElement>()
  const added = useRef<MapControl>();
  useEffect(
    function addControl() {
      if (instance) {
        context.ngwMap.addControl(instance, pos).then((control) => {
          added.current = control;
          if (control.getContainer)
            setContainer(control.getContainer());
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
    container,
  };
}
