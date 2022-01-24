import { MutableRefObject } from 'react';
import { useNgwMapContext } from './context';
import { mapControlCreator } from './mapControlCreator';

import type { ReactNode } from 'react';
import type { ControlOptions, CreateControlOptions } from '@nextgis/webmap';

interface MapControlProps extends CreateControlOptions, ControlOptions {
  children?: ReactNode;
}

export function MapControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { bar, margin, addClass } = props;
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

  return mapControlCreator({ ...props, context, createControl });
}
