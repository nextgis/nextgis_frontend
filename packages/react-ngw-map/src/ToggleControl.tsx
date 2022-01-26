import { useRef } from 'react';

import { useNgwMapContext } from './context';

import type { ReactNode } from 'react';
import type { ControlOptions, ToggleControlOptions } from '@nextgis/webmap';
import { useNgwControl } from './hooks/useNgwControl';

interface MapControlProps extends ToggleControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ToggleControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { position } = props;
  const context = useNgwMapContext();

  function createControl() {
    return context.ngwMap.createToggleControl(props);
  }

  const ref = useRef(createControl());
  useNgwControl(context, ref, position);

  return null;
}
