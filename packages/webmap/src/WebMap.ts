/**
 * @privateRemarks
 * Since it was not possible to split the code through mixins, inheritance was used.
 * The `ts-mixin` plugin worked fine, but led to errors in IE.
 *
 * Now inheritance is as follow:
 * BaseWebMap > WebMapLayers > WebMap
 *
 * Will need to be done this way:
 * class WebMap extend mixin(WebMapLayers, WebMapControls) {}
 *
 * This approach can also be considered
 *
 * class WebMap {
 *   layers: WebMapLayers;
 *   controls  WebMapControls
 * }
 *
 * and then
 *
 * const webMap = new WebMap(...);
 * webMap.layers.addLayer(...)
 *
 * looks good, but will add difficulty in inheriting from WebMap
 *
 * old:
 *
 * class NgwMap extends WebMap {
 *   addLayer(...) {
 *      super.addLayer(...)
 *   }
 * }
 *
 * new:
 *
 * class NgwLayers extends WebMapLayers {
 *   addLayer(...) {
 *     super.addLayer(...)
 *   }
 * }
 *
 * class NgwMap extends WebMap {
 *   layersClass = NgwLayers
 * }
 *
 * ...and there will be compatibility issues
 */

import { WebMapEvents } from './interfaces/Events';

import { WebMapLayers } from './WebMapLayers';
import { WebMapMain, WEB_MAP_CONTAINER } from './WebMapMain';
import { WebMapControls } from './WebMapControls';

/**
 * The core component for managing map adapters.
 * It contains methods for adding and manipulation with
 * {@link WebMapMain | map}, {@link WebMapLayers | layers} and {@link WebMapControls | controls}.
 *
 * @example
 * ```javascript
 * import { WebMap } from '@nextgis/webmap';
 * import MapAdapter from '@nextgis/ol-map-adapter';
 *
 * const webMap = new WebMap({
 *   mapAdapter: new MapAdapter(),
 *   mapOptions: { target: 'map' },
 * });
 * ```
 *
 * @typeParam M - Interactive Map used in the adapter
 * @typeParam L - Layer
 * @typeParam C - Control
 * @typeParam E - Events
 *
 * @public
 */
export class WebMap<
  M = any,
  L = any,
  C = any,
  E extends WebMapEvents = WebMapEvents
> extends WebMapControls<M, L, C, E>
  implements WebMapControls, WebMapLayers, WebMapMain {
  static get<T extends WebMap = WebMap>(id: number): T {
    return WEB_MAP_CONTAINER[id];
  }
  /**
   * @internal
   */
  protected async _addLayerProviders(): Promise<void> {
    try {
      for await (const kit of this._starterKits) {
        if (kit.getLayerAdapters) {
          const adapters = await kit.getLayerAdapters.call(kit);
          if (adapters) {
            for await (const adapter of adapters) {
              const newAdapter = await adapter.createAdapter(this);
              if (newAdapter) {
                this.mapAdapter.layerAdapters[adapter.name] = newAdapter;
              }
            }
          }
        }
      }
    } catch (er) {
      throw new Error(er);
    }
  }

  /**
   * @internal
   */
  protected async _onLoadSync(): Promise<void> {
    for await (const kit of this._starterKits) {
      if (kit.onLoadSync) {
        try {
          await kit.onLoadSync.call(kit, this);
        } catch (er) {
          console.error(er);
        }
      }
    }
  }
}
