import { resolveControlOptions, setControlOptions } from '../controlOptions';

import type {
  ButtonControlOptions,
  CreateControlOptions,
  MapControl,
  ToggleControl,
  ToggleControlOptions,
  ToggleStatusChangeListener,
} from '../interfaces';

import '../ControlContainer.css';

const STOP_PROPAGATION_EVENTS = [
  'wheel',
  'click',
  'mouseup',
  'touchend',
  'dblclick',
  'pointerup',
  'mousedown',
  'touchstart',
  'pointerdown',
];

function addClasses(element: HTMLElement, classes?: string): void {
  if (classes) {
    classes
      .split(' ')
      .filter(Boolean)
      .forEach((x) => element.classList.add(x));
  }
}

function removeElement(element?: HTMLElement): void {
  if (element?.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function stopPropagation(event: Event): void {
  event.stopPropagation();
}

function preventMapEventPropagation(element: HTMLElement): void {
  STOP_PROPAGATION_EVENTS.forEach((eventName) => {
    element.addEventListener(eventName, stopPropagation);
  });
}

function getAlignValue(
  align?: CreateControlOptions['align'],
): string | undefined {
  if (align === 'start') return 'flex-start';
  if (align === 'end') return 'flex-end';
  return align;
}

function isZeroGap(gap?: number | string): boolean {
  if (typeof gap === 'number') {
    return gap === 0;
  }
  if (typeof gap === 'string') {
    return gap
      .trim()
      .split(/\s+/)
      .every((x) => /^0(?:\.0+)?(?:[a-z%]+)?$/i.test(x));
  }
  return false;
}

function createControlContainer(options: CreateControlOptions = {}) {
  const resolvedOptions = resolveControlOptions(options);
  const element = document.createElement('div');
  element.className = 'webmap-ctrl';
  if (resolvedOptions.bar) {
    element.classList.add('webmap-ctrl-group');
  }
  if (resolvedOptions.margin) {
    element.classList.add('webmap-ctrl-margin');
  }
  const orientation = resolvedOptions.orientation || resolvedOptions.direction;
  if (orientation) {
    element.classList.add(`webmap-ctrl-${orientation}`);
  }
  if (resolvedOptions.gap !== undefined) {
    const gap =
      typeof resolvedOptions.gap === 'number'
        ? `${resolvedOptions.gap}px`
        : resolvedOptions.gap;
    element.style.setProperty('--webmap-ctrl-gap', gap);
    if (isZeroGap(resolvedOptions.gap)) {
      element.classList.add('webmap-ctrl-gapless');
    }
  }
  const align = getAlignValue(resolvedOptions.align);
  if (align) {
    element.style.setProperty('--webmap-ctrl-align', align);
  }
  addClasses(element, resolvedOptions.addClass);
  preventMapEventPropagation(element);
  return element;
}

function appendHtml(element: HTMLElement, html?: string | HTMLElement): void {
  if (html instanceof HTMLElement) {
    element.appendChild(html);
  } else if (typeof html === 'string') {
    element.innerHTML = html;
  }
}

export function createControlElement(
  control: MapControl,
  options: CreateControlOptions = {},
  map?: unknown,
): HTMLElement {
  const element = createControlContainer(options);
  setControlOptions(element, options);
  const content = control.onAdd(map);
  if (content) {
    element.appendChild(content);
  }
  return element;
}

export function createControl(
  control: MapControl,
  options: CreateControlOptions = {},
): MapControl {
  let container: HTMLElement | undefined;
  let mapAdapter: unknown;

  const mapControl: MapControl = {
    onAdd(map?: unknown): HTMLElement {
      mapAdapter = map;
      container = createControlElement(control, options, map);
      return container;
    },

    onRemove(map?: unknown): void {
      control.onRemove(map || mapAdapter);
      removeElement(container);
      container = undefined;
      mapAdapter = undefined;
    },

    getContainer(): HTMLElement {
      return container as HTMLElement;
    },
  };

  mapControl.remove = () => {
    mapControl.onRemove(mapAdapter);
  };
  setControlOptions(mapControl, options);

  return mapControl;
}

export function createButtonControlContent(
  options: ButtonControlOptions,
): MapControl {
  let button: HTMLButtonElement | undefined;

  const onClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    options.onClick();
  };

  const buttonControl: MapControl = {
    onAdd(): HTMLElement {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'webmap-ctrl-button';
      addClasses(button, options.addClass);

      if (options.title) {
        button.title = options.title;
        button.setAttribute('aria-label', options.title);
      }
      appendHtml(button, options.html);
      button.addEventListener('click', onClick);
      return button;
    },

    onRemove(): void {
      if (button) {
        button.removeEventListener('click', onClick);
        removeElement(button);
        button = undefined;
      }
    },

    getContainer(): HTMLElement {
      return button as HTMLElement;
    },
  };

  buttonControl.remove = () => {
    buttonControl.onRemove();
  };

  return buttonControl;
}

export function createButtonControl(options: ButtonControlOptions): MapControl {
  return createControl(createButtonControlContent(options), {
    bar: true,
    margin: options.margin,
  });
}

export function createToggleControlContent(
  options: ToggleControlOptions,
): MapControl & ToggleControl {
  const link = document.createElement('div');
  const statusListeners = new Set<ToggleStatusChangeListener>();

  let status = false;
  if (options.getStatus) {
    status = options.getStatus();
  } else if (options.status) {
    status = options.status;
  }

  const title = options.title || '';
  const html = options.html;

  function notifyStatusChange(control: ToggleControl) {
    statusListeners.forEach((listener) => listener(status, control));
  }

  function setTitle() {
    if (title) {
      if (typeof title === 'string') {
        link.title = title;
      } else {
        link.title = status ? title.on : title.off;
      }
      link.setAttribute('aria-label', link.title);
    }
  }

  function setHtml() {
    if (html) {
      link.innerHTML = '';
      if (typeof html === 'string' || html instanceof HTMLElement) {
        appendHtml(link, html);
      } else {
        appendHtml(link, status ? html.on : html.off);
      }
    }
  }

  function setClasses(classes: string, impact: boolean) {
    classes
      .split(' ')
      .filter(Boolean)
      .forEach((x) => {
        if (impact) {
          link.classList.add(x);
        } else {
          link.classList.remove(x);
        }
      });
  }

  function setStatusClasses() {
    if (options.addClassOn) {
      setClasses(options.addClassOn, status);
    }
    if (options.addClassOff) {
      setClasses(options.addClassOff, !status);
    }
  }

  setTitle();
  setHtml();
  if (options.addClass) {
    setClasses(options.addClass, true);
  }
  setStatusClasses();

  const changeStatus = (status_?: boolean) => {
    if (status_ !== undefined) {
      status = status_;
    }
    setHtml();
    setTitle();
    setStatusClasses();
  };

  const getStatus = () => status;

  const onClick = (status_?: boolean) => {
    if (status_ === undefined && status && buttonControl.disableOnSecondClick) {
      return;
    }

    const previousStatus = status;
    status = status_ !== undefined ? status_ : !status;
    if (options.onClick) {
      let afterClick;
      try {
        afterClick = options.onClick(status);
      } catch (er) {
        status = previousStatus;
        changeStatus();
        throw er;
      }
      Promise.resolve(afterClick)
        .then(() => {
          changeStatus();
          if (previousStatus !== status) {
            notifyStatusChange(buttonControl);
          }
        })
        .catch(() => {
          status = previousStatus;
          changeStatus();
        });
    } else {
      changeStatus();
      if (previousStatus !== status) {
        notifyStatusChange(buttonControl);
      }
    }
  };

  const buttonControl = createButtonControlContent({
    html: link,
    onClick,
  }) as MapControl & ToggleControl;
  buttonControl.onClick = onClick;
  buttonControl.changeStatus = changeStatus;
  buttonControl.getStatus = getStatus;
  buttonControl.switch = options.switch;
  if (options.disableOnSecondClick !== undefined) {
    buttonControl.disableOnSecondClick = options.disableOnSecondClick;
  }
  buttonControl.onStatusChange = (listener) => {
    statusListeners.add(listener);
    return () => statusListeners.delete(listener);
  };
  return buttonControl;
}

export function createToggleControl(
  options: ToggleControlOptions,
): MapControl & ToggleControl {
  const toggleContent = createToggleControlContent(options);
  const control = createControl(toggleContent, {
    bar: true,
    margin: options.margin,
  }) as MapControl & ToggleControl;
  control.onClick = toggleContent.onClick;
  control.changeStatus = toggleContent.changeStatus;
  control.getStatus = toggleContent.getStatus;
  control.switch = toggleContent.switch;
  Object.defineProperty(control, 'disableOnSecondClick', {
    configurable: true,
    get: () => toggleContent.disableOnSecondClick,
    set: (value) => {
      toggleContent.disableOnSecondClick = value;
    },
  });
  control.onStatusChange = toggleContent.onStatusChange;
  return control;
}
