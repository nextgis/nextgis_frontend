import { useEffect } from 'react';
import { useNgwMapContext } from './context';

import type { ControlOptions } from '@nextgis/webmap';
import type { ElementHook } from './element';

export function createControlHook<E extends any, P extends ControlOptions>(
  useElement: ElementHook<E, P>,
) {
  return function useNgwMapControl(props: P): ReturnType<ElementHook<E, P>> {
    const context = useNgwMapContext();
    const elementRef = useElement(props, context);
    const { instance } = elementRef.current;
    // const positionRef = useRef(props.position);
    const position = props.position || 'top-left';

    useEffect(
      function addControl() {
        context.ngwMap.addControl(instance, position);

        return function removeControl() {
          context.ngwMap.removeControl(instance);
        };
      },
      [context.ngwMap, instance],
    );

    // useEffect(
    //   function updateControl() {
    //     if (position !== null && position !== positionRef.current) {
    //       instance.setPosition(position);
    //       positionRef.current = position;
    //     }
    //   },
    //   [instance, position],
    // );

    return elementRef;
  };
}
