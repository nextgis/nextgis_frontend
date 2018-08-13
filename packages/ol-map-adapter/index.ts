import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import Map from 'ol/Map';
import {fromLonLat, transformExtent} from 'ol/proj';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
// import {MapOptions, MapAdapter} from '../../Interfaces/MapAdapter';
// import {queryToObject} from '../../Utils/ioQuery';

interface LayerMem {
  order: number;
  layer: ImageLayer | TileLayer;
}

let ORDER = 0;
const LENGTH = 9999; // TODO: get real layers length count, after all registered

export class OlMap { // implements MapAdapter {

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  private _olMap: Map;
  private _olView: View;

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;

  private _layers: {[name: string]: LayerMem} = {};

  // create(options: MapOptions = {target: 'map'}) {
  create(options = {target: 'map'}) {

    const view = new View({
      center: [-9101767, 2822912],
      zoom: 14,
      projection: this.displayProjection,
    });

    const defOpt = {
      logo: false,
      controls: [],
      view,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    };
    const mapInitOptions = {...defOpt, ...options};

    this._olMap = new Map(mapInitOptions);

    // this._olMap.addLayer(new TileLayer({ source: new OSM()}));

    this._olView = this._olMap.getView();

    // olView.on('change:resolution', (evt) => {
    //   this.set('resolution', olView.getResolution());
    // });

    // olView.on('change:center', (evt) => {
    //   this.set('center', olView.getCenter());
    // });
  }

  setCenter(latLng: [number, number]) {
    this._olView.setCenter(fromLonLat(latLng));
  }

  setZoom(zoom: number) {
    this._olView.setZoom(zoom);
  }

  fit(extent) {
    extent = transformExtent(
      extent,
      this.lonlatProjection,
      this.displayProjection,
    );
    this._olView.fit(extent);
  }

  setRotation(angle: number) {
    this._olView.setRotation(angle);
  }

  addLayer(layerName: string) {
    this._toggleLayer(true, layerName);
  }

  removeLayer(layerName: string) {
    this._toggleLayer(false, layerName);
  }

  registrateWmsLayer(layerName: string, options?: {url: string, styleId: string, order?: number}) {
    if (!layerName) {
      throw new Error('layerName is required parameter');
    }
    let layer = this._layers[layerName];
    if (!layer) {
      layer = this._imageAdapter(options);
      this._layers[layerName] = {layer, order: options.order || ORDER++};
      // LENGTH++;
    }
    return layer;
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  private _toggleLayer(status: boolean, layerName: string) {
    const action = (source: Map, l: LayerMem) => {
      if (status) {
        if (source instanceof Map) {
          source.addLayer(l.layer);
          l.layer.setZIndex(LENGTH - l.order);
        }
      } else {
        source.removeLayer(l.layer);
      }
    };
    const layer = this._layers[layerName];
    if (layer) {
      action(this._olMap, layer);
    }
  }

  private _imageAdapter(item) {

    // const options = {
    //   maxResolution: item.maxResolution ? item.maxResolution : undefined,
    //   minResolution: item.minResolution ? item.minResolution : undefined,
    //   visible: item.visibility,
    //   opacity: item.transparency ? (1 - item.transparency / 100) : 1.0,
    // };

    const source = new ImageWMS({
      url: item.url,
      params: {
        resource: item.styleId,
      },
      ratio: 1,
      imageLoadFunction: (image, src) => {
        // const url = src.split('?')[0];
        // const query = src.split('?')[1];
        // const queryObject = queryToObject(query);

        // image.getImage().src = url
        //   + '?resource=' + queryObject.resource
        //   + '&extent=' + queryObject.BBOX
        //   + '&size=' + queryObject.WIDTH + ',' + queryObject.HEIGHT
        //   + '#' + Date.now(); // in-memory cache busting
      },
    });

    const layer = new ImageLayer({source});

    return layer;
  }

}
