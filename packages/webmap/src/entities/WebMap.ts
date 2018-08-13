import { AppOptions, WebMapAppEvents } from '../interfaces/WebMapApp';
import { AppSettings, Settings } from '../interfaces/AppSettings';
import { RuntimeParams } from '../interfaces/RuntimeParams';
import { deepmerge } from '../utils/lang';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
import { EventEmitter } from 'events';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './keys/Keys';
import { MapAdapter } from '../Interfaces/MapAdapter';


export class WebMap {

  options: AppOptions = {
    target: 'map',
    displayConfig: {
      extent: [-180, -90, 180, 90],
    },
  };

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  settings: Settings;

  layers: WebLayerEntry;

  emitter: StrictEventEmitter<EventEmitter, WebMapAppEvents> = new EventEmitter();

  keys: Keys = new Keys(); // TODO: make injectable cashed

  map: MapAdapter;
  private _settings: AppSettings;
  private runtimeParams: RuntimeParams;

  private settingsIsLoading = false;

  async create(options: AppOptions): Promise<this> {

    this.options = deepmerge(this.options, options);

    if (!this.settings) {
      await this.getSettings();
    }

    this._setupMap();

    return this;
  }

  async getSettings(): Promise<Settings> {
    if (this.settings) {
      return Promise.resolve(this.settings);
    }
    if (this.settingsIsLoading) {

      return new Promise<Settings>((resolve) => {
        const onLoad = (x) => {
          resolve(x);
          this.emitter.removeListener('load-settings', onLoad);
        };
        this.emitter.on('load-settings', onLoad);
      });

    } else {
      this.settingsIsLoading = true;
      let settings: Settings | boolean;
      try {
        settings = await this._settings.getSettings(this.options);
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

  // region MAP
  private _setupMap() {

    const { extent_bottom, extent_left, extent_top, extent_right } = this.settings.webmap;
    if (extent_bottom && extent_left && extent_top && extent_right) {
      this.options.displayConfig.extent = [extent_bottom, extent_left, extent_top, extent_right];
    }

    const extent = this.options.displayConfig.extent;
    if (extent[3] > 82) {
      extent[3] = 82;
    }
    if (extent[1] < -82) {
      extent[1] = -82;
    }
    this.map.displayProjection = this.displayProjection;
    this.map.lonlatProjection = this.lonlatProjection;
    this.map.create({ target: this.options.target });

    this._addTreeLayers();

    this._zoomToInitialExtent();

    this.emitter.emit('build-map', this.map);
  }

  private async _addTreeLayers() {
    const settings = await this.getSettings();
    if (settings) {
      const rootLayer = settings.webmap.root_item;
      if (rootLayer) {
        this.layers = new WebLayerEntry(this.map, rootLayer, this.options);
        this.emitter.emit('add-layers', this.layers);
      }
    }
  }

  private _zoomToInitialExtent() {
    const { lat, lon, zoom, angle } = this.runtimeParams.getParams();
    if (zoom && lon && lat) {
      this.map.setCenter([
        parseFloat(lon),
        parseFloat(lat),
      ],
      );
      this.map.setZoom(
        parseInt(zoom, 10),
      );

      if (angle) {
        this.map.setRotation(
          parseFloat(angle),
        );
      }
    } else {
      this.map.fit(this.options.displayConfig.extent);
    }
  }
  // endregion
}
