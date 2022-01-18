import { createWebMapComponent } from './component';
import { createControlHook } from './control';
import { createElementHook } from './element';

import type { ControlOptions } from '@nextgis/webmap';
import type { NgwMapElement } from './element';
import type { NgwMapContextInterface } from './context';

export function createControlComponent<E extends any, P extends ControlOptions>(
  createInstance: (props: P, context: NgwMapContextInterface) => E,
) {
  function createElement(
    props: P,
    context: NgwMapContextInterface,
  ): NgwMapElement<E> {
    return { instance: createInstance(props, context), context };
  }
  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createWebMapComponent(useControl);
}
