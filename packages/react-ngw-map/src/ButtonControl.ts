import { useRef } from 'react';

import { useNgwMapContext } from './context';
import { mapControlCreator } from './mapControlCreator';

import type { ReactNode } from 'react';
import type { ControlOptions, ButtonControlOptions } from '@nextgis/webmap';

interface MapControlProps extends ButtonControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ButtonControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const context = useNgwMapContext();
  const el = document.createElement('div');
  const portal = useRef(el);

  function createControl() {
    return context.ngwMap.createButtonControl(props);
  }

  return mapControlCreator({ ...props, context, portal, createControl });
}
