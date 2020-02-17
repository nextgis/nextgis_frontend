/**
 * @module cesium-map-adapter
 */
import { EventEmitter } from 'events';

import { Viewer as TViewer } from 'cesium';

// const Cesium = require('cesium/Cesium');
const Cesium = require('cesium');
// import Cesium from 'cesium';

const Viewer = Cesium.Viewer as Type<TViewer>;

import {
  MapAdapter,
  ControlPositions,
  MapOptions,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  LngLatArray,
  LngLatBoundsArray,
  Type
} from '@nextgis/webmap';

type Layer = any;
type Control = any;

export class CesiumMapAdapter implements MapAdapter<any, Layer> {
  static layerAdapters = {
    // IMAGE: ImageAdapter,
    // TILE: TileAdapter,
    // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    // GEOJSON: GeoJsonAdapter
  };

  static controlAdapters = {
    // ZOOM: Zoom,
    // ATTRIBUTION: Attribution
  };

  layerAdapters = CesiumMapAdapter.layerAdapters;
  controlAdapters = CesiumMapAdapter.controlAdapters;

  emitter = new EventEmitter();
  options: MapOptions = {};

  map?: TViewer;

  create(options: MapOptions) {
    this.options = { ...options };
    if (this.options.target) {
      const ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
      this.map = new Viewer(this.options.target, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        scene3DOnly: true,
        selectionIndicator: true,
        geocoder: false,
        homeButton: false,
        infoBox: true,
        timeline: false,
        navigationHelpButton: false,
        useBrowserRecommendedResolution: true,
        sceneMode: Cesium.SceneMode.SCENE3D,
        terrainProvider: ellipsoidProvider,
        // imageryProvider: tms,
        mapProjection: new Cesium.WebMercatorProjection()
        // contextOptions: { requestWebgl2: true }
      });
      this.map.scene.globe.depthTestAgainstTerrain = false;
      this.map.scene.postProcessStages.fxaa.enabled = true;
      this.emitter.emit('create');
    }
  }

  destroy() {
    //
  }

  getContainer(): HTMLElement | undefined {
    return undefined;
  }

  setCenter(lonLat: LngLatArray) {
    //
  }

  getCenter(): LngLatArray | undefined {
    return undefined;
  }

  setZoom(zoom: number) {
    //
  }

  getZoom() {
    return undefined;
  }

  fitBounds(e: LngLatBoundsArray) {
    //
  }

  getBounds(): LngLatBoundsArray | undefined {
    return undefined;
  }

  setRotation(angle: number) {
    //
  }

  removeLayer(layer: Layer) {
    //
  }

  showLayer(layer: Layer) {
    //
  }

  hideLayer(layer: Layer) {
    //
  }

  setLayerOpacity() {
    // ignore
  }

  setLayerOrder(layer: Layer, order: number) {
    //
  }

  createControl(control: MapControl, options: CreateControlOptions) {
    // return
  }

  createButtonControl(options: ButtonControlOptions) {
    // return
  }

  addControl(control: Control, position: ControlPositions) {
    // return
  }

  removeControl(control: Control) {
    //
  }

  onMapClick(evt: any) {
    //
  }
}
