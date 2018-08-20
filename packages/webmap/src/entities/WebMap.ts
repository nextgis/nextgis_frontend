import { AppOptions, MapOptions } from '../interfaces/WebMapApp';
import { RuntimeParams } from '../interfaces/RuntimeParams';
import { deepmerge } from '../utils/lang';
// import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './keys/Keys';
import { MapAdapter } from '../interfaces/MapAdapter';
import { Type } from '../Utils/Type';
import { LayerAdapter, LayerAdapters } from '../interfaces/LayerAdapter';
import { StarterKit, AppSettings } from '../interfaces/AppSettings';

export class WebMap<M = any> {

  options: MapOptions;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  settings: AppSettings;

  layers: WebLayerEntry;

  emitter /** : StrictEventEmitter<EventEmitter, WebMapAppEvents> */ = new EventEmitter();

  keys: Keys = new Keys(); // TODO: make injectable cashed

  map: MapAdapter<M>;

  runtimeParams: RuntimeParams[];
  private _starterKits: StarterKit[];

  private settingsIsLoading = false;

  private _baseLayers: string[] = [];

  constructor(appOptions: AppOptions) {
    this.map = appOptions.mapAdapter;
    this._starterKits = appOptions.starterKits || [];
  }

  async create(options: MapOptions): Promise<this> {

    this.options = deepmerge(this.options, options);

    if (!this.settings && this._starterKits.length) {
      await this.getSettings();
    }

    this._setupMap();

    return this;
  }

  async getSettings(): Promise<AppSettings> {
    if (this.settings) {
      return Promise.resolve(this.settings);
    }
    if (this.settingsIsLoading) {

      return new Promise<AppSettings>((resolve) => {
        const onLoad = (x) => {
          resolve(x);
          this.emitter.removeListener('load-settings', onLoad);
        };
        this.emitter.on('load-settings', onLoad);
      });

    } else {
      this.settingsIsLoading = true;
      let settings: AppSettings | boolean;
      try {
        settings = {};
        for (const getSetting of this._starterKits.map((x) => x.getSettings)) {
          const setting = await getSetting();
          if (setting) {
            Object.assign(settings, setting);
          }
        }
      } catch (er) {
        this.settingsIsLoading = false;
        throw new Error(er);
      }
      if (settings) {
        this.settings = settings;
        this.settingsIsLoading = false;
        this.emitter.emit('load-settings', settings);
        return settings;
      }
    }
  }

  addBaseLayer(layerName: string, provider: keyof LayerAdapters | Type<LayerAdapter>, options?: any): any {
    this.map.addLayer(provider, Object.assign({}, options, {id: layerName})).then((layer) => {
      if (layer) {
        this._baseLayers.push(layer.name);
      }
    });
  }

  isBaseLayer(layerName: string): boolean {
    return this._baseLayers.indexOf(layerName) !== -1;
  }

  // region MAP
  private _setupMap() {

    // const { extent_bottom, extent_left, extent_top, extent_right } = this.settings.webmap;
    // if (extent_bottom && extent_left && extent_top && extent_right) {
    //   this.options.displayConfig.extent = [extent_bottom, extent_left, extent_top, extent_right];
    // }

    // const extent = this.options.displayConfig.extent;
    // if (extent[3] > 82) {
    //   extent[3] = 82;
    // }
    // if (extent[1] < -82) {
    //   extent[1] = -82;
    // }
    // this.map.displayProjection = this.displayProjection;
    // this.map.lonlatProjection = this.lonlatProjection;
    this.map.create({ target: this.options.target });

    // this._addTreeLayers();

    // this._zoomToInitialExtent();

    this.emitter.emit('build-map', this.map);
  }

  private async _addTreeLayers() {
    const settings = await this.getSettings();
    if (settings) {
      const rootLayer = settings.root_item;
      if (rootLayer) {
        this.layers = new WebLayerEntry(this.map, rootLayer);
        this.emitter.emit('add-layers', this.layers);
      }
    }
  }

  // private _zoomToInitialExtent() {
  //   const { lat, lon, zoom, angle } = this.runtimeParams.getParams();
  //   if (zoom && lon && lat) {
  //     this.map.setCenter([
  //       parseFloat(lon),
  //       parseFloat(lat),
  //     ],
  //     );
  //     this.map.setZoom(
  //       parseInt(zoom, 10),
  //     );

  //     if (angle) {
  //       this.map.setRotation(
  //         parseFloat(angle),
  //       );
  //     }
  //   } else {
  //     this.map.fit(this.options.displayConfig.extent);
  //   }
  // }
  // endregion

}
