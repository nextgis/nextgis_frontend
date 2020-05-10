/**
 * @module cesium-map-adapter
 */
import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { Viewer as TViewer, Event } from 'cesium';
export type Map = TViewer;

export abstract class BaseAdapter<
  O extends AdapterOptions = AdapterOptions,
  L = any
> implements BaseLayerAdapter<Map, L, O> {
  protected onTerrainChange?: () => void;
  private _terrainProviderChangedListener?: Event.RemoveCallback;

  constructor(public map: Map, public options: O) {
    if (this.onTerrainChange) {
      const t = map.scene.terrainProviderChanged;
      this._terrainProviderChangedListener = t.addEventListener(() => {
        if (this.onTerrainChange) this.onTerrainChange();
      });
    }
  }

  beforeRemove() {
    if (this._terrainProviderChangedListener) {
      this._terrainProviderChangedListener();
    }
  }

  showLayer(layer?: any) {
    this.map.scene.requestRender();
  }

  hideLayer(layer?: any) {
    this.map.scene.requestRender();
  }

  abstract addLayer(_options: O): L | Promise<L> | undefined;
}
