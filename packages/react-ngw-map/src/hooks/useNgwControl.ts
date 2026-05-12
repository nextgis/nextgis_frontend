import { useEffect, useRef, useState } from 'react';

import type { ControlTargetPosition, MapControl } from '@nextgis/webmap';

import type { NgwMapContextInterface } from '../interfaces';

function getControlContainer(control: MapControl): HTMLElement | undefined {
  if (control.getContainer) {
    return control.getContainer();
  }

  const knownControl = control as {
    element?: HTMLElement;
    _container?: HTMLElement;
  };

  return knownControl.element || knownControl._container;
}

export function useNgwControl({
  context,
  instance,
  order,
  position,
  id,
}: {
  context: NgwMapContextInterface;
  instance?: Promise<unknown>;
  order?: number;
  position?: ControlTargetPosition;
  id?: string;
}) {
  const pos = position || 'top-left';
  const [container, setContainer] = useState<HTMLElement>();
  const added = useRef<MapControl | undefined>(undefined);

  useEffect(
    function addControl() {
      let removed = false;
      let addedControl: MapControl | undefined;

      if (instance) {
        context.ngwMap
          .addControl(instance, pos, { id, order })
          .then((control) => {
            if (control) {
              addedControl = control;

              if (removed) {
                context.ngwMap.removeControl(control);
                return;
              }

              added.current = control;
              setContainer(getControlContainer(control));
            }
          });
      }

      return function removeControl() {
        removed = true;
        if (addedControl) {
          context.ngwMap.removeControl(addedControl);
          if (added.current === addedControl) {
            added.current = undefined;
          }
        }
        setContainer(undefined);
      };
    },
    [context.ngwMap, instance, pos, id, order],
  );

  return {
    container,
  };
}
