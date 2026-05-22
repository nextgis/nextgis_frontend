import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useNgwControl } from './hooks/useNgwControl';
import { useShallowMemo } from './hooks/useShallowMemo';
import { useNgwMapContext } from './context';
import { useMapControlContext } from './controlContext';

import type { ButtonControlOptions, ControlOptions } from '@nextgis/webmap';
import type { ReactNode } from 'react';

interface MapControlProps extends ButtonControlOptions, ControlOptions {
  children?: ReactNode;
}

export function ButtonControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { id, order, position } = props;
  const context = useNgwMapContext();
  const parentControl = useMapControlContext();
  const portal = useRef(document.createElement('span'));
  const controlPosition = useMemo(
    () =>
      position ||
      (parentControl?.id ? { inside: parentControl.id } : undefined),
    [position, parentControl?.id],
  );
  const controlOptions = { ...props };
  const useChildrenAsHtml =
    props.children !== undefined && controlOptions.html === undefined;
  if (useChildrenAsHtml) {
    controlOptions.html = portal.current;
  }
  delete controlOptions.id;
  delete controlOptions.order;
  delete controlOptions.control;
  delete controlOptions.position;
  delete controlOptions.children;

  const stableControlOptions = useShallowMemo(controlOptions);

  const [instance, setInstance] = useState<Promise<unknown>>();
  useNgwControl({
    instance,
    position: controlPosition,
    context,
    order,
    id,
  });

  useEffect(() => {
    setInstance(context.ngwMap.createButtonControl(stableControlOptions));
  }, [context.ngwMap, stableControlOptions]);

  return useChildrenAsHtml ? createPortal(props.children, portal.current) : null;
}
