import { ControlPositions } from '@nextgis/webmap';
import './PanelContainerElement.css';

export class PanelContainerElement {
  private _container: HTMLElement;
  private _positionsContainers: {
    [key in ControlPositions]: HTMLElement | null;
  } = {
    'bottom-left': null,
    'bottom-right': null,
    'top-left': null,
    'top-right': null
  };

  constructor() {
    this._container = this.createContainerElement();
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

  append(position: ControlPositions, element: HTMLElement) {
    const positionContainer = this._positionsContainers[position];
    if (positionContainer) {
      positionContainer.appendChild(element);
    }
  }

  private createContainerElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'openlayers-control-container';

    const positions: ControlPositions[] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left'
    ];
    positions.forEach(x => {
      const positionContainer = this._createPositionContainer(x);
      this._positionsContainers[x] = positionContainer;
      element.appendChild(positionContainer);
    });

    return element;
  }

  private _createPositionContainer(position: ControlPositions): HTMLElement {
    const positionContainer = document.createElement('div');
    positionContainer.className = 'openlayers-ctrl-' + position;
    return positionContainer;
  }
}
