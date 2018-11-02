import { WebMap } from '@nextgis/webmap';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';
import { QmsKit } from '@nextgis/qms-kit';

import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';

export interface MapOptions {
  target: string;
  qmsId: number;
  baseUrl: string;
  bound: [number, number, number, number];
}

export interface NgwLayerOptions {
  id: number;
}

export default class NgwLeaflet {

  options: MapOptions = {
    target: 'map',
    qmsId: 465,
    baseUrl: 'http://dev.nextgis.com/sandbox',
    bound: [-90, -180, 90, 180]
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
    this.webMap.map.fit(this.options.bound);
  }

  @onMapLoad()
  addNgwLayer(adapter, options: NgwLayerOptions) {
    if (adapter === 'TILE') {
      const url = this.options.baseUrl + '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
      this.webMap.map.addLayer(adapter, {url}).then((layer) => {
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
