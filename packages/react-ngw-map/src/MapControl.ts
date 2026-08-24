import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useNgwControl } from './hooks/useNgwControl';
import { useNgwMapContext } from './context';
import { MapControlContext, useMapControlContext } from './controlContext';

import type { ControlOptions, CreateControlOptions } from '@nextgis/webmap';
import type { MutableRefObject, ReactNode } from 'react';

import type { ReactElementAttributes } from './interfaces';

interface MapControlProps
  extends ReactElementAttributes, CreateControlOptions, ControlOptions {
  children?: ReactNode;
}

interface AppliedElementAttributes {
  baseClassName: string;
  baseId: string;
  style: Map<string, string>;
}

function getStyleValue(element: HTMLElement, key: string): string {
  if (key.startsWith('--')) {
    return element.style.getPropertyValue(key);
  }
  return (element.style as unknown as Record<string, string>)[key] || '';
}

function setStyleValue(element: HTMLElement, key: string, value: unknown) {
  if (key.startsWith('--')) {
    if (value === undefined || value === null || value === '') {
      element.style.removeProperty(key);
    } else {
      element.style.setProperty(key, String(value));
    }
  } else {
    (element.style as unknown as Record<string, string>)[key] =
      value === undefined || value === null ? '' : String(value);
  }
}

function applyElementAttributes(
  element: HTMLElement,
  attrs: ReactElementAttributes,
  applied: AppliedElementAttributes,
) {
  const { id, className, style } = attrs;
  const nextId = id || applied.baseId;

  if (nextId) {
    element.id = nextId;
  } else {
    element.removeAttribute('id');
  }

  element.className = [applied.baseClassName, className]
    .filter(Boolean)
    .join(' ');

  const nextStyleKeys = new Set(Object.keys(style || {}));

  applied.style.forEach((value, key) => {
    if (!nextStyleKeys.has(key)) {
      setStyleValue(element, key, value);
      applied.style.delete(key);
    }
  });

  if (style) {
    for (const key in style) {
      if (!applied.style.has(key)) {
        applied.style.set(key, getStyleValue(element, key));
      }
      setStyleValue(element, key, style[key]);
    }
  }
}

export function MapControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const {
    id,
    bar,
    gap,
    align,
    order,
    style,
    margin,
    addClass,
    children,
    position,
    direction,
    className,
    orientation,
    disableOnSecondClick,
  } = props;
  const context = useNgwMapContext();
  const parentControl = useMapControlContext();
  const controlPosition = useMemo(
    () =>
      position ||
      (parentControl?.id ? { inside: parentControl.id } : undefined),
    [position, parentControl?.id],
  );
  const controlContext = useMemo(() => ({ id }), [id]);

  const portal = useRef(document.createElement('div'));
  const applied = useRef<
    | {
        element: HTMLElement;
        attrs: AppliedElementAttributes;
      }
    | undefined
  >(undefined);

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
        {
          gap,
          bar,
          align,
          margin,
          addClass,
          direction,
          orientation,
          disableOnSecondClick,
        },
      );
    },
    [
      bar,
      gap,
      align,
      margin,
      addClass,
      context.ngwMap,
      direction,
      orientation,
      disableOnSecondClick,
    ],
  );

  const [instance, setInstance] = useState<Promise<unknown>>();

  const { container } = useNgwControl({
    context,
    instance,
    position: controlPosition,
    order,
    id,
  });

  useEffect(() => {
    const el = container;
    if (el) {
      if (applied.current?.element !== el) {
        applied.current = {
          element: el,
          attrs: {
            baseClassName: el.className,
            baseId: el.id,
            style: new Map(),
          },
        };
      }

      applyElementAttributes(
        el,
        { id, className, style },
        applied.current.attrs,
      );
    }
  }, [id, className, style, container]);

  useEffect(() => {
    setInstance(createControl(portal));
  }, [createControl]);

  return createPortal(
    createElement(
      MapControlContext.Provider,
      { value: controlContext },
      children,
    ),
    portal.current,
  );
}
