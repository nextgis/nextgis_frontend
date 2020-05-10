/**
 * @module cesium-map-adapter
 */
import { EventEmitter } from 'events';

import {
  Viewer,
  Ellipsoid,
  Event,
  Rectangle,
  SceneMode,
  Cartesian3,
  Math as CesiumMath,
  EllipsoidTerrainProvider,
  Cartographic,
  GeoJsonDataSource,
  WebMercatorProjection,
} from 'cesium';

import {
  MapControl,
  MapOptions,
  MapAdapter,
  LngLatArray,
  WebMapEvents,
  ControlPositions,
  LngLatBoundsArray,
  CreateControlOptions,
  ButtonControlOptions,
  FitOptions,
} from '@nextgis/webmap';
import ControlContainer from '@nextgis/control-container';

import { TileAdapter } from './layer-adapters/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { TerrainAdapter } from './layer-adapters/TerrainAdapter';
import { Model3DAdapter } from './layer-adapters/Model3DAdapter';
import { Tileset3DAdapter } from './layer-adapters/Tileset3DAdapter';

type Layer = any;
type Control = any;

export class CesiumMapAdapter implements MapAdapter<any, Layer> {
  static layerAdapters = {
    // IMAGE: ImageAdapter,
    TILE: TileAdapter,
    // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
    TERRAIN: TerrainAdapter,
    MODEL_3D: Model3DAdapter,
    TILESET_3D: Tileset3DAdapter,
  };

  static controlAdapters = {
    ZOOM: ControlContainer.controls.ZOOM,
    // ATTRIBUTION: Attribution
  };

  layerAdapters = CesiumMapAdapter.layerAdapters;
  controlAdapters = CesiumMapAdapter.controlAdapters;

  emitter = new EventEmitter();
  options: MapOptions = {};

  map?: Viewer;

  // Scractch memory allocation, happens only once.
  private _scratchRectangle = new Rectangle();
  private _controlContainer = new ControlContainer({
    addClass: 'cesium-control',
  });
  private _terrainProviderChangedListener?: Event.RemoveCallback;

  create(options: MapOptions) {
    this.options = { ...options };
    if (this.options.target) {
      // default terrain provider
      const ellipsoidProvider = new EllipsoidTerrainProvider();

      // if (options.bounds) {
      //   console.log(options.bounds);
      //   const extent = Rectangle.fromDegrees(...options.bounds);

      //   Camera.DEFAULT_VIEW_RECTANGLE = extent;
      //   Camera.DEFAULT_VIEW_FACTOR = 0;
      // }

      const viewer = new Viewer(this.options.target, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        scene3DOnly: false,
        sceneModePicker: true,
        selectionIndicator: true,
        geocoder: false,
        homeButton: false,
        infoBox: true,
        timeline: false,
        navigationHelpButton: false,
        mapProjection: new WebMercatorProjection(),
        skyBox: false,
        // skyAtmosphere: false,
        // useBrowserRecommendedResolution: true,
        sceneMode: SceneMode.SCENE3D,
        // terrainProvider: createWorldTerrain()
        terrainProvider: ellipsoidProvider,
        imageryProvider: false,
        // mapProjection: new Cesium.WebMercatorProjection()
        // contextOptions: { requestWebgl2: true }
      });
      GeoJsonDataSource.clampToGround = true;
      viewer.imageryLayers.removeAll();
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      viewer.scene.requestRenderMode = true;
      const t = viewer.scene.terrainProviderChanged;
      this._terrainProviderChangedListener = t.addEventListener(() => {
        this._onTerrainChange();
      });

      if (options.view) {
        switch (options.view) {
          case '2D':
            viewer.scene.mode = SceneMode.SCENE2D;
            break;
          case '2.5D':
            viewer.scene.mode = SceneMode.COLUMBUS_VIEW;
            break;
          default:
            viewer.scene.mode = SceneMode.SCENE3D;
        }
      }

      this.map = viewer;
      const bounds = options.bounds;
      if (bounds) {
        // don't know why, but this should be asynchronous
        setTimeout(() => this.fitBounds(bounds));
      } else if (options.center) {
        this.setCenter(options.center);
      }
      const controlContainer = this._controlContainer.getContainer();
      const viewerContainer = viewer.container.firstChild;
      if (viewerContainer) {
        viewerContainer.insertBefore(
          controlContainer,
          viewerContainer.firstChild
        );
      }

      this.emitter.emit('create');
      this._addEventsListener();
    }
  }

  destroy() {
    if (this._terrainProviderChangedListener) {
      this._terrainProviderChangedListener();
    }
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
        destination,
      });
    }
  }

  getCenter(): LngLatArray | undefined {
    return undefined;
  }

  setZoom(zoom: number) {
    const viewer = this.map;
    if (viewer) {
      //
    }
  }

  getZoom() {
    const viewer = this.map;
    if (viewer) {
      let iniPos = new Cartesian3();
      iniPos = viewer.camera.position;
      const cartographic = new Cartographic();
      // cartographic.height = zoom * 1000;
      cartographic.longitude = iniPos.x;
      cartographic.latitude = iniPos.y;
      const newPos = new Cartesian3();
      Ellipsoid.WGS84.cartographicToCartesian(cartographic, newPos);
      viewer.camera.setView({
        destination: newPos,
      });
    }
    return undefined;
  }

  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}) {
    if (this.map) {
      const [west, south, east, north] = e;
      const rectangle = Rectangle.fromDegrees(west, south, east, north);
      const destination = this.map.camera.getRectangleCameraCoordinates(
        rectangle
      );
      this.map.camera.flyTo({ destination, duration: options.duration || 0 });
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
          rect.north,
        ].map((x) => CesiumMath.toDegrees(x));
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
    this._controlContainer.addControl(control, position);
  }

  removeControl(control: Control) {
    //
  }

  onMapClick(evt: any) {
    //
  }

  private _onTerrainChange() {
    const bound = this.getBounds();
    if (bound) {
      this.fitBounds(bound);
    }
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
        ['moveend', viewer.camera.moveEnd],
      ];
      events.forEach(([name, event]) => {
        if (event) {
          event.addEventListener(() => {
            this.emitter.emit(name);
          });
        }
      });
    }
  }
}
