import { useCallback, useEffect, useState } from 'react';

import { useNgwMapContext } from './context';
import { useNgwControl } from './hooks/useNgwControl';

import type { ButtonControlOptions, ControlOptions } from '@nextgis/webmap';
import type { ReactNode } from 'react';

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

  const [instance, setInstance] = useState<Promise<unknown>>();
  useNgwControl({ context, instance, position });

  useEffect(() => {
    setInstance(createControl());
  }, [createControl, position]);

  return null;
}
