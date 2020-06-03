/**
 * @module cesium-map-adapter
 */
import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { Viewer as TViewer, Event } from 'cesium';
export type Map = TViewer;

type Layer = any;

export abstract class BaseAdapter<
  O extends AdapterOptions = AdapterOptions,
  L = Layer
> implements BaseLayerAdapter<Map, L, O> {
  protected onTerrainChange?: () => void;
  private _terrainProviderChangedListener?: Event.RemoveCallback;

  constructor(public map: Map, public options: O) {
    const t = map.scene.terrainProviderChanged;
    this._terrainProviderChangedListener = t.addEventListener(() => {
      if (this.onTerrainChange) this.onTerrainChange();
    });
  }

  beforeRemove(): void {
    if (this._terrainProviderChangedListener) {
      this._terrainProviderChangedListener();
    }
  }

  showLayer(layer?: Layer): void {
    this.map.scene.requestRender();
  }

  hideLayer(layer?: Layer): void {
    this.map.scene.requestRender();
  }

  abstract addLayer(_options: O): L | Promise<L> | undefined;
}
