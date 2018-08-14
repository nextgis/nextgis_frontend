import { MvtAdapter } from './layer-adapters/MvtAdapter';
import mapboxgl from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';

export class MapboxglAdapter { // implements MapAdapter {

  static layerAdapter = {
    tile: TileAdapter,
    mvt: MvtAdapter,
    osm: OsmAdapter
  };

  options: any = {};

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  map: mapboxgl.Map;

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;
  private _layers = {};
  private isLoaded = false;

  constructor(options) {
    this.options = Object.assign({}, this.options, options);
    // already registered layers, if true - it means on the map
  }

  // create(options: MapOptions = {target: 'map'}) {
  create() {
    this.map = new mapboxgl.Map({
      container: this.options.target,
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
    // ignore
  }

  hideLayer(layername: string) {
    // ignore
  }

  addBaseLayer(providerName: string, options?) {
    // ignore
  }

  addLayer(layerName: string, adapter) {
    // this._toggleLayer(true, layerName);
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

  private onMapLoad(cb, context) {
    if (this.isLoaded) { // map.loaded()
      cb.call(context);
    } else {
      this.map.once('load', () => {
        cb.call(context);
      });
    }
  }

  private addMvtLayer(layerId, layerUrl) {

    // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6

    const idString = String(layerId);
    this.map.addLayer({
      'id': idString,
      'type': 'fill',
      'source-layer': idString,
      'source': {
        type: 'vector',
        tiles: [layerUrl]
      },
      'layout': {
        visibility: 'none'
      },
      'paint': {
        'fill-color': 'red',
        'fill-opacity': 0.8,
        'fill-opacity-transition': {
          duration: 0
        },
        'fill-outline-color': '#8b0000' // darkred
      }
    });
    this._layers[layerId] = false;
    return this._layers[layerId];
  }

  private addTileLayer(layerName, url, params) {

    let tiles;
    if (params && params.subdomains) {
      tiles = params.subdomains.split('').map((x) => {
        const subUrl = url.replace('{s}', x);
        return subUrl;
      });
    } else {
      tiles = [url];
    }

    this.map.addLayer({
      id: layerName,
      type: 'raster',
      source: {
        type: 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        tiles,
        tileSize: params && params.tileSize || 256
      }
    });
  }

  private toggleLayer(layerId, status) {
    let exist = this._layers[layerId];
    if (exist === undefined) {
      const layerUrl = this.options.baseUrl + '/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';
      exist = this.addMvtLayer(layerId, layerUrl);
    }
    if (exist !== status) {
      this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
      this._layers[layerId] = status;
    }
  }
}
