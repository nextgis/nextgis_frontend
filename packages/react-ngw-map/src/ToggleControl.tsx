import { useCallback, useState, useEffect } from 'react';

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

  const createControl = useCallback(() => {
    return context.ngwMap.createToggleControl(props);
  }, []);

  const [instance, setInstance] = useState(createControl);
  useNgwControl({ context, instance, position });

  useEffect(() => {
    setInstance(createControl());
  }, [createControl, position]);


  return null;
}
