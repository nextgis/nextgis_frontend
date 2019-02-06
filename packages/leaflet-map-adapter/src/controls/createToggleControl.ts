import { CreateToggleControlOptions } from '@nextgis/webmap';
import { createControl } from './createControl';
import { DomEvent } from 'leaflet';

export function createToggleControl(options: CreateToggleControlOptions) {
  const link = document.createElement('a');

  let status = options.status;

  const title = options.title || '';
  const html = options.html;

  link.href = '#';
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

  link.setAttribute('role', 'button');

  DomEvent.disableClickPropagation(link);
  DomEvent.on(link, 'click', DomEvent.stop);

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
      _setClass(options.addClassOff, status);
    }
  }

  if (options.addClass) {
    _setClass(options.addClass, true);
  }
  setClass();

  const onClick = (e: Event) => {
    e.stopPropagation();
    status = !status;
    setHtml();
    setTitle();
    setClass();
    options.onClick(status);
  };
  if (options.onClick) {
    link.addEventListener('click', onClick);
  }

  return createControl({
    onAdd() {
      return link;
    },
    onRemove() {
      const parent = link.parentNode;
      if (parent) {
        parent.removeChild(link);
      }
      if (options.onClick) {
        link.removeEventListener('click', onClick);
      }
    }
  }, { bar: true });
}
