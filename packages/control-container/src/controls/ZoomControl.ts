import WebMap, { MapControl } from '@nextgis/webmap';
import { dom } from '@nextgis/utils';

export class ZoomControl implements MapControl {

  private webMap?: WebMap;
  private _container?: HTMLElement;
  private _zoomInBtn?: HTMLButtonElement;
  private _zoomOutBtn?: HTMLButtonElement;
  private __onZoomInBtnClick?: () => void;
  private __onZoomOutBtnClick?: () => void;

  onAdd(webMap: WebMap) {
    if (!this.webMap) {
      this.webMap = webMap;
    }
    if (!this._container) {
      const container = dom.create('div', 'webmap-ctrl webmap-ctrl-group');
      this._container = container;
      this._createContent();
    }
    return this._container;
  }

  onRemove() {
    this.webMap = undefined;
    if (this._container) {
      dom.remove(this._container);
    }
  }

  private _createContent() {
    if (this._container) {
      const zoomInBtn = dom.create('button', 'webmap-ctrl-zoom-in', this._container);
      zoomInBtn.innerHTML = '<span class="webmap-ctrl-icon" aria-hidden="true"></span>';
      const zoomOutBtn = dom.create('button', 'webmap-ctrl-zoom-out', this._container);
      zoomOutBtn.innerHTML = '<span class="webmap-ctrl-icon" aria-hidden="true"></span>';

      this._zoomInBtn = zoomInBtn;
      this._zoomOutBtn = zoomOutBtn;
      this.__onZoomInBtnClick = () => this._onZoomInBtnClick();
      this.__onZoomOutBtnClick = () => this._onZoomOutBtnClick();

      this._zoomInBtn.addEventListener('click', this.__onZoomInBtnClick);
      this._zoomOutBtn.addEventListener('click', this.__onZoomOutBtnClick);
    }
  }

  private _onZoomInBtnClick() {
    this.changeZoom();
  }

  private _onZoomOutBtnClick() {
    this.changeZoom(true);
  }

  private changeZoom(decrease?: boolean) {
    const webMap = this.webMap;
    if (webMap) {
      const zoom = webMap.getZoom();
      if (zoom) {
        const toZoom = zoom + (decrease ? -1 : 1);
        webMap.setZoom(toZoom);
      }
    }
  }

}
