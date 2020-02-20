/**
 * @module cesium-map-adapter
 */
import { EventEmitter } from 'events';

import { Viewer as TViewer } from 'cesium';

const Cesium = require('cesium');

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
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';

type Layer = any;
type Control = any;

export class CesiumMapAdapter implements MapAdapter<any, Layer> {
  static layerAdapters = {
    // IMAGE: ImageAdapter,
    // TILE: TileAdapter,
    // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter
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
      const viewer = new Viewer(this.options.target, {
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
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      this.map = viewer;
      if (options.center) {
        this.setCenter(options.center);
      }

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
    const viewer = this.map;
    if (viewer) {
      const z = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        viewer.camera.position
      ).height;
      const destination = Cesium.Cartesian3.fromDegrees(
        lonLat[0],
        lonLat[1],
        z
      );
      viewer.camera.setView({
        destination
      });
    }
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
    if (this.map) {
      const [west, south, east, north] = e;
      const destination = Cesium.Rectangle.fromDegrees(
        west,
        south,
        east,
        north
      );
      this.map.camera.setView({ destination });
    }
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
