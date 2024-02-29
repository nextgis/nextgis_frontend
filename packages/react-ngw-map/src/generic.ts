import { createWebMapComponent } from './component';
import { createControlHook } from './control';
import { createElementHook } from './element';

import type { NgwMapElement } from './element';
import type { NgwMapContextInterface } from './interfaces';
import type { ControlOptions } from '@nextgis/webmap';

export function createControlComponent<E, P extends ControlOptions>(
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
