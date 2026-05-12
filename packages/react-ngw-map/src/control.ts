import { useEffect, useMemo } from 'react';

import { useNgwMapContext } from './context';
import { useMapControlContext } from './controlContext';

import type { ControlOptions } from '@nextgis/webmap';

import type { ElementHook } from './element';

export function createControlHook<E, P extends ControlOptions>(
  useElement: ElementHook<E, P>,
) {
  return function useNgwMapControl(props: P): ReturnType<ElementHook<E, P>> {
    const context = useNgwMapContext();
    const elementRef = useElement(props, context);
    const { instance } = elementRef.current;
    const parentControl = useMapControlContext();
    const position = useMemo(
      () =>
        props.position ||
        (parentControl?.id ? { inside: parentControl.id } : 'top-left'),
      [props.position, parentControl?.id],
    );

    useEffect(
      function addControl() {
        let removed = false;
        let addedControl: E | undefined;

        context.ngwMap
          .addControl(instance, position, {
            id: props.id,
            order: props.order,
          })
          .then((control) => {
            if (control) {
              addedControl = control;

              if (removed) {
                context.ngwMap.removeControl(control);
              }
            }
          });

        return function removeControl() {
          removed = true;
          if (addedControl) {
            context.ngwMap.removeControl(addedControl);
          }
        };
      },
      [context.ngwMap, instance, position, props.id, props.order],
    );

    return elementRef;
  };
}
