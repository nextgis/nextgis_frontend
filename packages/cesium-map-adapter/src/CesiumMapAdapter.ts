/**
 * @module cesium-map-adapter
 */
import { EventEmitter } from 'events';

import {
  Math as CesiumMath,
  Viewer,
  // createWorldTerrain,
  EllipsoidTerrainProvider,
  SceneMode,
  Ellipsoid,
  Cartesian3,
  Rectangle,
  Cartographic
} from 'cesium';

import {
  MapAdapter,
  ControlPositions,
  MapOptions,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  LngLatArray,
  LngLatBoundsArray,
  WebMapEvents
} from '@nextgis/webmap';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { TerrainAdapter } from './layer-adapters/TerrainAdapter';

type Layer = any;
type Control = any;

export class CesiumMapAdapter implements MapAdapter<any, Layer> {
  static layerAdapters = {
    // IMAGE: ImageAdapter,
    TILE: TileAdapter,
    // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
    TERRAIN: TerrainAdapter
  };

  static controlAdapters = {
    // ZOOM: Zoom,
    // ATTRIBUTION: Attribution
  };

  layerAdapters = CesiumMapAdapter.layerAdapters;
  controlAdapters = CesiumMapAdapter.controlAdapters;

  emitter = new EventEmitter();
  options: MapOptions = {};

  map?: Viewer;

  // Scractch memory allocation, happens only once.
  private _scratchRectangle = new Rectangle();

  create(options: MapOptions) {
    this.options = { ...options };
    if (this.options.target) {
      const ellipsoidProvider = new EllipsoidTerrainProvider();

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
        // useBrowserRecommendedResolution: true,
        sceneMode: SceneMode.SCENE3D,
        // terrainProvider: createWorldTerrain()
        terrainProvider: ellipsoidProvider
        // imageryProvider: tms,
        // mapProjection: new Cesium.WebMercatorProjection()
        // contextOptions: { requestWebgl2: true }
      });

      viewer.imageryLayers.removeAll();

      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.scene.postProcessStages.fxaa.enabled = true;

      viewer.camera.percentageChanged = 0.1;
      this.map = viewer;
      if (options.bounds) {
        this.fitBounds(options.bounds);
      } else if (options.center) {
        this.setCenter(options.center);
      }

      this.emitter.emit('create');
      this._addEventsListener()
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
      const z = Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position)
        .height;
      const destination = Cartesian3.fromDegrees(lonLat[0], lonLat[1], z);
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
      const destination = Rectangle.fromDegrees(west, south, east, north);
      this.map.camera.setView({ destination });
    }
  }

  getBounds(): LngLatBoundsArray | undefined {
    const viewer = this.map;
    if (viewer) {
      const rect = viewer.camera.computeViewRectangle(
        viewer.scene.globe.ellipsoid,
        this._scratchRectangle
      );
      if (rect) {
        const [x1, y1, x2, y2] = [
          rect.west,
          rect.south,
          rect.east,
          rect.north
        ].map(x => CesiumMath.toDegrees(x));

        return [x1, y1, x2, y2];
      }
    }
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

  private _addEventsListener() {
    const viewer = this.map;
    if (viewer) {

      const events: [keyof WebMapEvents, Cesium.Event | undefined][] = [
        ['zoomstart', undefined],
        ['zoom', undefined],
        ['zoomend', undefined],
        ['movestart', viewer.camera.moveStart],
        ['move', undefined],
        ['moveend', viewer.camera.moveEnd]
      ];
      events.forEach(([name, event]) => {
        if (event) {
          event.addEventListener(() => {
            this.emitter.emit(name);
          })
        }
      })
    }
  }
}
