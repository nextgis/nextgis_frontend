import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useNgwControl } from './hooks/useNgwControl';
import { useNgwMapContext } from './context';

import type { ControlOptions, CreateControlOptions } from '@nextgis/webmap';
import type { MutableRefObject, ReactNode } from 'react';

import type { ReactElementAttributes } from './interfaces';

interface MapControlProps
  extends ReactElementAttributes,
    CreateControlOptions,
    ControlOptions {
  children?: ReactNode;
}

export function MapControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { bar, margin, addClass, id, className, style, children, position } =
    props;
  const context = useNgwMapContext();

  const portal = useRef(document.createElement('div'));

  const createControl = useCallback(
    (portal: MutableRefObject<HTMLDivElement>) => {
      return context.ngwMap.createControl(
        {
          onAdd() {
            return portal.current;
          },

          onRemove() {
            //
          },
        },
        { bar, margin, addClass },
      );
    },
    [bar, margin, addClass],
  );

  const [instance, setInstance] = useState<Promise<unknown>>();

  const { container } = useNgwControl({ context, instance, position });

  useEffect(() => {
    const el = container;
    if (el) {
      if (id) el.id = id;
      if (className) el.className = className;
      if (style) {
        for (const key in style) {
          el.style[key] = (style as CSSStyleDeclaration)[key];
        }
      }
    }
  }, [id, className, style, container]);

  useEffect(() => {
    setInstance(createControl(portal));
  }, [createControl]);

  return createPortal(children, portal.current);
}
