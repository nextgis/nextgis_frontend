import { MvtAdapter } from './layer-adapters/MvtAdapter';
import mapboxgl from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';

export class MapboxglAdapter { // implements MapAdapter {

  static layerAdapter = {
    TILE: TileAdapter,
    MVT: MvtAdapter,
    OSM: OsmAdapter
  };

  options: any;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  map: mapboxgl.Map;

  _layers = {};
  _baseLayers = [];
  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;
  private isLoaded = false;

  // create(options: MapOptions = {target: 'map'}) {
  create(options) {
    this.options = options;
    this.map = new mapboxgl.Map({
      container: options.target,
      center: [96, 63], // initial map center in [lon, lat]
      zoom: 2,
      style: {
        version: 8,
        name: 'Empty style',
        sources: {},
        layers: [],
      }
    });
  }

  setCenter(latLng: [number, number]) {
    // ignore
  }

  setZoom(zoom: number) {
    // ignore
  }

  fit(extent) {
    // ignore
  }

  setRotation(angle: number) {
    // ignore
  }

  showLayer(layerName: string) {
    this.onMapLoad(() => this.toggleLayer(layerName, true));
  }

  hideLayer(layerName: string) {
    this.onMapLoad(() => this.toggleLayer(layerName, false));
  }

  addBaseLayer(name, providerDef, options?) {
    this.onMapLoad(() => {
      const layerId = this.addLayer(name, providerDef, options);
      if (layerId) {
        this._baseLayers.push(layerId);
      }
    });
  }

  addLayer(layerName: string, adapterDef, options?) {
    let adapterEngine;
    if (typeof adapterDef === 'string') {
      adapterEngine = MapboxglAdapter.layerAdapter[adapterDef];
    }
    if (adapterEngine) {
      const adapter = new adapterEngine(options);
      const layerId = adapter.addLayer(this.map, layerName, options);
      this._layers[layerId] = false;
      return layerId;
    }
    return false;
  }

  removeLayer(layerName: string) {
    // this._toggleLayer(false, layerName);
  }


  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  onMapLoad(cb, context?) {
    if (this.isLoaded) { // map.loaded()
      cb.call(context);
    } else {
      this.map.once('load', () => {
        cb.call(context);
      });
    }
  }

  toggleLayer(layerId, status) {
    const exist = this._layers[layerId];

    if (exist !== undefined && exist !== status) {
      this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
      this._layers[layerId] = status;
    }
  }
}
