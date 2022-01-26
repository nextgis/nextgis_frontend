import { useRef } from 'react';

import { useNgwMapContext } from './context';

import type { ReactNode } from 'react';
import type { ControlOptions, ButtonControlOptions } from '@nextgis/webmap';
import { useNgwControl } from './hooks/useNgwControl';

interface MapControlProps extends ButtonControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ButtonControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { position } = props;
  const context = useNgwMapContext();

  function createControl() {
    return context.ngwMap.createButtonControl(props);
  }

  const ref = useRef(createControl());
  useNgwControl(context, ref, position);

  return null;
}
