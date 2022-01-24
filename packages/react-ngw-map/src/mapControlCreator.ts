import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import type { ReactNode, MutableRefObject } from 'react';
import type { ControlOptions } from '@nextgis/webmap';
import type { NgwMapContextInterface } from './interfaces';

interface MapControlProps extends ControlOptions {
  children?: ReactNode;
  context: NgwMapContextInterface;
  createControl: (portal: MutableRefObject<HTMLDivElement>) => Promise<unknown>;
}

export function mapControlCreator<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { context, createControl, children, position } = props;

  const el = document.createElement('div');
  const portal = useRef(el);

  const instance = useRef(createControl(portal));
  const pos = position || 'top-left';

  useEffect(
    function addControl() {
      context.ngwMap.addControl(instance.current, pos);

      return function removeControl() {
        context.ngwMap.removeControl(instance.current);
      };
    },
    [context.ngwMap, instance],
  );

  return createPortal(children, portal.current);
}
