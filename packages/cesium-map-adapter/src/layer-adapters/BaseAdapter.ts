/**
 * @module cesium-map-adapter
 */
import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { Viewer as TViewer } from 'cesium';
export type Map = TViewer;

export abstract class BaseAdapter<
  O extends AdapterOptions = AdapterOptions,
  L = any
> implements BaseLayerAdapter<Map, L, O> {
  constructor(public map: Map, public options: O) {
    //
  }

  showLayer(layer?: any) {
    this.map.scene.requestRender();
  }

  hideLayer(layer?: any) {
    this.map.scene.requestRender();
  }

  abstract addLayer(_options: O): L | Promise<L> | undefined;
}
