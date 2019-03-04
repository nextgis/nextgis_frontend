import { WebMap } from '../../WebMap';
import { ToggleControlOptions } from '../../interfaces/MapControl';
import { createButtonControl } from './ButtonControl';

export function createToggleControl(webMap: WebMap, options: ToggleControlOptions) {

  const link = document.createElement('div');

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

  const onClick = () => {
    status = !status;
    setHtml();
    setTitle();
    setClass();
    options.onClick(status);
  };

  return createButtonControl(webMap, {
    html: link,
    onClick
  });

}
