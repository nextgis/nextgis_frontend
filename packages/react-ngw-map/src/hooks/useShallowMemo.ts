import { useRef } from 'react';

import { shallowEqual } from '../utils/shallowEqual';

export function useShallowMemo<T extends Record<string, any>>(value: T): T {
  const valueRef = useRef(value);

  if (!shallowEqual(valueRef.current, value)) {
    valueRef.current = value;
  }

  return valueRef.current;
}
