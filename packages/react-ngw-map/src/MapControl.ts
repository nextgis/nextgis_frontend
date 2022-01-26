import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNgwMapContext } from './context';
import { useNgwControl } from './hooks/useNgwControl';

import type { ReactNode, MutableRefObject } from 'react';
import type { ControlOptions, CreateControlOptions } from '@nextgis/webmap';

interface MapControlProps extends CreateControlOptions, ControlOptions {
  children?: ReactNode;
}

export function MapControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { bar, margin, addClass, children } = props;
  const context = useNgwMapContext();

  function createControl(portal: MutableRefObject<HTMLDivElement>) {
    return context.ngwMap.createControl(
      {
        onAdd() {
          const el = document.createElement('div');
          el.appendChild(portal.current);
          return el;
        },

        onRemove() {
          // ignore
        },
      },
      { bar, margin, addClass },
    );
  }

  const el = document.createElement('div');
  const portal = useRef(el);

  const instance = useRef(createControl(portal));
  useNgwControl(context, instance, props.position);

  return createPortal(children, portal.current);
}
