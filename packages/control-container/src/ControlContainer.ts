/**
 * @module control-container
 */
import './ControlContainer.css';

import * as dom from '@nextgis/dom';
import WebMap, { ControlPositions, MapControl } from '@nextgis/webmap';

import { ZoomControl } from './controls/ZoomControl';
import { ControlContainerOptions } from './interfaces';

export class ControlContainer {
  static controls = {
    ZOOM: ZoomControl,
  };

  private readonly classPrefix: string = 'webmap';
  private readonly addClass?: string;
  private readonly webMap?: WebMap;
  private _container: HTMLElement;
  private _positionsContainers: {
    [key in ControlPositions]: HTMLElement | null;
  } = {
    'bottom-left': null,
    'bottom-right': null,
    'top-left': null,
    'top-right': null,
  };

  constructor(opt: ControlContainerOptions = {}) {
    this.classPrefix = opt.classPrefix || this.classPrefix;
    this.addClass = opt.addClass;
    this.webMap = opt.webMap;
    this._container = this.createContainerElement();
  }

  addTo(el: HTMLElement | string): this {
    const el_ = dom.getElement(el);
    if (el_) {
      el_.appendChild(this._container);
    }
    return this;
  }

  detach() {
    const parent = this._container.parentElement;
    if (parent) {
      parent.removeChild(this._container);
    }
  }

  getContainer() {
    return this._container;
  }

  getPositionContainer(position: ControlPositions): HTMLElement | undefined {
    const positionContainer = this._positionsContainers[position];
    if (positionContainer) {
      return positionContainer;
    }
  }

  newPositionContainer(position: ControlPositions): HTMLElement | undefined {
    const positionContainer = this.getPositionContainer(position);
    if (positionContainer) {
      const newContainer = document.createElement('div');
      newContainer.className = 'openlayers-ctrl';
      // reserve place for async loaded containers
      if (
        position.indexOf('bottom') !== -1 &&
        positionContainer.childElementCount
      ) {
        positionContainer.insertBefore(
          newContainer,
          positionContainer.firstChild
        );
      } else {
        positionContainer.appendChild(newContainer);
      }
      return newContainer;
    }
  }

  addControl(control: MapControl, position: ControlPositions) {
    const controlContainer = control.onAdd(this.webMap);
    if (controlContainer instanceof HTMLElement) {
      this.append(controlContainer, position);
    }
  }

  append(element: HTMLElement | string, position: ControlPositions) {
    const positionContainer = this._positionsContainers[position];
    if (positionContainer) {
      if (typeof element === 'string') {
        const el = document.createElement('div');
        el.outerHTML = element;
        element = el;
      }
      positionContainer.appendChild(element);
    }
  }

  private createContainerElement(): HTMLElement {
    const element = document.createElement('div');
    element.className =
      `${this.classPrefix}-control-container` +
      (this.addClass ? ' ' + this.addClass : '');

    const positions: ControlPositions[] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ];
    positions.forEach((x) => {
      const positionContainer = this._createPositionContainer(x);
      this._positionsContainers[x] = positionContainer;
      element.appendChild(positionContainer);
    });

    return element;
  }

  private _createPositionContainer(position: ControlPositions): HTMLElement {
    const positionContainer = document.createElement('div');
    positionContainer.className = `${this.classPrefix}-ctrl-${position}`;
    return positionContainer;
  }
}
