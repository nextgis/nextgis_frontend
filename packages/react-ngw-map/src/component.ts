import { forwardRef, useImperativeHandle } from 'react';

import { useNgwMapContext } from './context';

import type { ElementHook } from './element';
import type { Ref } from 'react';

export function createWebMapComponent<E, P>(useElement: ElementHook<E, P>) {
  function WebMapComponent(props: P, ref: Ref<E>) {
    const context = useNgwMapContext();
    const { instance } = useElement(props, context).current;
    useImperativeHandle(ref, () => instance);

    return null;
  }

  return forwardRef(WebMapComponent);
}
