import type {
  ButtonControlOptions,
  ToggleControl,
  ToggleControlOptions,
  ToggleStatusChangeListener,
} from '../../interfaces/MapControl';

/**
 * The toggle is a button with status.
 * @internal
 */
export function createToggleControl<C = any>(
  createButtonControl: (options: ButtonControlOptions) => C,
  options: ToggleControlOptions,
): C & ToggleControl {
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
  setTitle();

  // DomEvent.disableClickPropagation(link);
  // DomEvent.on(link, 'click', DomEvent.stop);

  function _setHtml(htmlDef: string | HTMLElement) {
    if (htmlDef instanceof HTMLElement) {
      link.innerHTML = '';
      link.appendChild(htmlDef);
    } else if (typeof htmlDef === 'string') {
      link.innerHTML = htmlDef;
    }
  }
  function setHtml() {
    if (html) {
      if (typeof html === 'string' || html instanceof HTMLElement) {
        _setHtml(html);
      } else {
        _setHtml(status ? html.on : html.off);
      }
      link.setAttribute('aria-label', link.title);
    }
  }
  setHtml();

  function _setClass(addClass: string, impact: boolean) {
    addClass.split(' ').forEach((x) => {
      if (impact) {
        link.classList.add(x);
      } else {
        link.classList.remove(x);
      }
    });
  }

  function setClass() {
    if (options.addClassOn) {
      _setClass(options.addClassOn, status);
    }
    if (options.addClassOff) {
      _setClass(options.addClassOff, !status);
    }
  }

  if (options.addClass) {
    _setClass(options.addClass, true);
  }
  setClass();

  function notifyStatusChange(control: ToggleControl) {
    statusListeners.forEach((listener) => listener(status, control));
  }

  const changeStatus = (status_?: boolean) => {
    if (status_ !== undefined) {
      status = status_;
    }
    setHtml();
    setTitle();
    setClass();
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

  const buttonControl = createButtonControl({
    html: link,
    onClick,
  }) as C & ToggleControl;
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
