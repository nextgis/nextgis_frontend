import { useRef } from 'react';

import { useNgwMapContext } from './context';
import { mapControlCreator } from './mapControlCreator';

import type { ReactNode } from 'react';
import type { ControlOptions, ToggleControlOptions } from '@nextgis/webmap';

interface MapControlProps extends ToggleControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ToggleControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const context = useNgwMapContext();
  const el = document.createElement('div');
  const portal = useRef(el);

  function createControl() {
    return context.ngwMap.createToggleControl(props);
  }

  return mapControlCreator({ ...props, context, portal, createControl });
}
