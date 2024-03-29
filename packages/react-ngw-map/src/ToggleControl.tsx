import { useCallback, useEffect, useState } from 'react';

import { useNgwMapContext } from './context';
import { useNgwControl } from './hooks/useNgwControl';

import type { ControlOptions, ToggleControlOptions } from '@nextgis/webmap';
import type { ReactNode } from 'react';

interface MapControlProps extends ToggleControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ToggleControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { position } = props;
  const context = useNgwMapContext();

  const createControl = useCallback(() => {
    return context.ngwMap.createToggleControl(props);
  }, []);

  const [instance, setInstance] = useState<Promise<unknown>>();
  useNgwControl({ context, instance, position });

  useEffect(() => {
    setInstance(createControl());
  }, [createControl, position]);

  return null;
}
