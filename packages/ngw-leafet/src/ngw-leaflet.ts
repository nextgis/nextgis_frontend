import { WebMap } from '@nextgis/webmap';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';
import { QmsKit } from '@nextgis/qms-kit';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';

import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';
import { NgwImageAdapter } from './ngw-image-adapter';
import { fixUrlStr } from './utils';

export interface MapOptions {
  target: string;
  qmsId: number;
  baseUrl: string;
  center?: [number, number];
  zoom?: number;
  bound?: [number, number, number, number];
}

export interface NgwLayerOptions {
  id: number;
  adapter: 'IMAGE' | 'TILE';
}

export default class NgwLeaflet {

  options: MapOptions = {
    target: 'map',
    qmsId: 465,
    baseUrl: 'http://dev.nextgis.com/sandbox',
  };

  webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
    starterKits: [new QmsKit()]
  });

  isLoaded: boolean = false;

  constructor(options: MapOptions) {
    this.options = { ...this.options, ...options };
    this._createWebMap().then(() => {
      this._addControls();
      this.isLoaded = true;
    });
  }

  fit() {
    const {center, zoom, bound} = this.options;
    if (center) {
      this.webMap.map.setCenter(center);
      if (zoom) {
        this.webMap.map.setZoom(zoom);
      }
    } else if (bound) {
      this.webMap.map.fit(bound);
    }
  }

  @onMapLoad()
  addNgwLayer(options: NgwLayerOptions) {
    const adapter = options.adapter || 'IMAGE';
    if (adapter === 'IMAGE') {
      const url = fixUrlStr(this.options.baseUrl + '/api/component/render/image');
      this.webMap.map.addLayer(NgwImageAdapter, { url, id: String(options.id) }).then((layer) => {
        this.webMap.map.showLayer(layer.name);
      });
    } else if (adapter === 'TILE') {
      const url = fixUrlStr(
        this.options.baseUrl +
        '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' +
        options.id
      );
      this.webMap.map.addLayer(adapter, { url }).then((layer) => {
        this.webMap.map.showLayer(layer.name);
      });
    } else {
      throw new Error(adapter + ' not supported yet. Only TILE');
    }
  }

  private _createWebMap() {
    return this.webMap.create({
      target: this.options.target
    }).then(() => {
      if (this.options.qmsId) {
        this.webMap.addBaseLayer(String(this.options.qmsId), 'QMS', {
          qmsid: this.options.qmsId
        }).then((layer) => {
          this.webMap.map.showLayer(layer.name);
        });
      }

      this.fit();
      this.webMap.emitter.emit('map:created');
      // @ts-ignore
      window.lmap = this.webMap.map.map;
    });
  }

  private _addControls() {

    this.webMap.map.addControl('ZOOM', 'top-left');

    this.webMap.map.addControl('ATTRIBUTION', 'bottom-right', {
      customAttribution: [
        '<a href="http://nextgis.ru" target="_blank">©NextGIS</a>',
      ]
    });
  }
}
