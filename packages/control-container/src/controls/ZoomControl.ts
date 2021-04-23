import { MapControl, MapAdapter } from '@nextgis/webmap';
import * as dom from '@nextgis/dom';

export class ZoomControl implements MapControl {
  private map?: MapAdapter;
  private _container?: HTMLElement;
  private __onZoomInBtnClick?: () => void;
  private __onZoomOutBtnClick?: () => void;

  onAdd(map: MapAdapter): HTMLElement {
    if (!this.map) {
      this.map = map;
    }
    if (!this._container) {
      const container = dom.create('div', 'webmap-ctrl webmap-ctrl-group');
      this._container = container;
      this._createContent();
    }
    return this._container;
  }

  onRemove(): void {
    this.map = undefined;
    if (this._container) {
      dom.remove(this._container);
    }
  }

  zoomIn(): void {
    if (this.map) {
      if (this.map.zoomIn) {
        this.map.zoomIn();
      } else {
        const zoom = this.map.getZoom();
        if (zoom) {
          const toZoom = zoom + 1;
          this.map.setZoom(toZoom);
        }
      }
    }
  }

  zoomOut(): void {
    if (this.map) {
      if (this.map.zoomOut) {
        this.map.zoomOut();
      } else {
        const zoom = this.map.getZoom();
        if (zoom) {
          const toZoom = zoom - 1;
          this.map.setZoom(toZoom);
        }
      }
    }
  }

  private _createContent() {
    if (this._container) {
      const zoomInBtn = dom.create(
        'button',
        'webmap-ctrl-zoom-in',
        this._container,
      );
      zoomInBtn.innerHTML =
        '<span class="webmap-ctrl-icon" aria-hidden="true"></span>';
      const zoomOutBtn = dom.create(
        'button',
        'webmap-ctrl-zoom-out',
        this._container,
      );
      zoomOutBtn.innerHTML =
        '<span class="webmap-ctrl-icon" aria-hidden="true"></span>';

      this.__onZoomInBtnClick = () => this._onZoomInBtnClick();
      zoomInBtn.addEventListener('click', this.__onZoomInBtnClick);

      this.__onZoomOutBtnClick = () => this._onZoomOutBtnClick();
      zoomOutBtn.addEventListener('click', this.__onZoomOutBtnClick);
    }
  }

  private _onZoomInBtnClick() {
    this.zoomIn();
  }

  private _onZoomOutBtnClick() {
    this.zoomOut();
  }
}
