/**
 * @privateRemarks
 * Since it was not possible to split the code through mixins, inheritance was used.
 * The `ts-mixin` plugin worked fine, but led to errors in IE.
 *
 * Now inheritance is as follow:
 * BaseWebMap \> WebMapLayers \> WebMap
 *
 * Will need to be done this way:
 * ```javascript
 * class WebMap extend mixin(WebMapLayers, WebMapControls) {}
 * ```
 *
 * This approach can also be considered
 * ```javascript
 * class WebMap {
 *   layers: WebMapLayers;
 *   controls  WebMapControls
 * }
 * ```
 * and then
 *
 * const webMap = new WebMap(...);
 * webMap.layers.addLayer(...)
 *
 * looks good, but will add difficulty in inheriting from WebMap
 *
 * old:
 * ```javascript
 * class NgwMap extends WebMap {
 *   addLayer(...) {
 *      super.addLayer(...)
 *   }
 * }
 * ```
 * new:
 * ```javascript
 * class NgwLayers extends WebMapLayers {
 *   addLayer(...) {
 *     super.addLayer(...)
 *   }
 * }
 *
 * class NgwMap extends WebMap {
 *   layersClass = NgwLayers
 * }
 * ```
 * ...and there will be compatibility issues
 */

import { getWebMap, setWebMap } from './container';
import { WebMapControls } from './WebMapControls';

import type { WebMapEvents } from './interfaces/Events';
import type { ControlOptions } from './interfaces/MapControl';
import type { MapOptions } from './interfaces/MapOptions';
import type { WebMapLayers } from './WebMapLayers';
import type { WebMapMain } from './WebMapMain';

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
 *   target: 'map',
 * });
 * ```
 *
 * @typeParam M - Interactive Map used in the adapter
 * @typeParam L - Layer
 * @typeParam C - Control
 * @typeParam E - Events
 *
 */
export class WebMap<
    M = any,
    L = any,
    C extends object = any,
    E extends WebMapEvents = WebMapEvents,
    O extends MapOptions = MapOptions,
  >
  extends WebMapControls<M, L, C, E, O>
  implements WebMapControls, WebMapLayers, WebMapMain
{
  constructor(mapOptions: O) {
    super(mapOptions);
    this._addControls();
    setWebMap(this.id, this);
  }

  static get<T extends WebMap = WebMap>(id: number): T {
    return getWebMap<T>(id);
  }

  /**
   * @internal
   */
  protected async _addLayerProviders(): Promise<void> {
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

  private _addControls(): void {
    if (this.options.controls) {
      this.options.controls.forEach((x) => {
        let controlAdapterName = x;
        let controlOptions: ControlOptions = {};
        if (typeof x === 'string' && this.options.controlsOptions) {
          if (this.options.controlsOptions[x]) {
            controlOptions = this.options.controlsOptions[x];
            if (controlOptions.control !== undefined) {
              controlAdapterName = controlOptions.control;
            }
          }
        }
        const { position, ...options } = controlOptions;
        this.addControl(controlAdapterName, position || 'top-left', options);
      });
    }
    this._emitStatusEvent('controls:create');
  }
}
