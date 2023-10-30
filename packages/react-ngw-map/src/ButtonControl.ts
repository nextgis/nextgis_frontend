import { useState, useEffect ,useCallback } from 'react';

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

  const createControl = useCallback(() => {
    return context.ngwMap.createButtonControl(props);
  }, []);

  const [instance, setInstance] = useState(createControl);
  useNgwControl({context, instance, position});

  useEffect(() => {
    setInstance(createControl());
  }, [createControl, position]);

  return null;
}
