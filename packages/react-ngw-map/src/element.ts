import { MutableRefObject, useEffect, useRef } from 'react';

import { NgwMapContextInterface } from './interfaces';

export interface NgwMapElement<T, C = any> {
  instance: T;
  context: NgwMapContextInterface;
  container?: C | null;
}

export type ElementHook<E, P> = (
  props: P,
  context: NgwMapContextInterface,
) => MutableRefObject<NgwMapElement<E>>;

export function createElementHook<E, P, C = any>(
  createElement: (
    props: P,
    context: NgwMapContextInterface,
  ) => NgwMapElement<E>,
  updateElement?: (instance: E, props: P, prevProps: P) => void,
) {
  if (updateElement === null) {
    return function useImmutableNgwMapElement(
      props: P,
      context: NgwMapContextInterface,
    ): ReturnType<ElementHook<E, P>> {
      return useRef<NgwMapElement<E, C>>(createElement(props, context));
    };
  }

  return function useMutableNgwMapElement(
    props: P,
    context: NgwMapContextInterface,
  ): ReturnType<ElementHook<E, P>> {
    const elementRef = useRef<NgwMapElement<E, C>>(
      createElement(props, context),
    );
    const propsRef = useRef<P>(props);
    const { instance } = elementRef.current;

    useEffect(
      function updateElementProps() {
        if (propsRef.current !== props) {
          if (updateElement) {
            updateElement(instance, props, propsRef.current);
          }
          propsRef.current = props;
        }
      },
      [instance, props, context],
    );

    return elementRef;
  };
}
