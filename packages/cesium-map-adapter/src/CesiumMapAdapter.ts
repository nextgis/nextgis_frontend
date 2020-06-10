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
  Cartographic,
  GeoJsonDataSource,
  WebMercatorProjection,
  TerrainProvider,
  Color,
  viewerCesiumInspectorMixin,
  // @ts-ignore
  viewerCesium3DTilesInspectorMixin,
  Credit,
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
import { Type } from '@nextgis/utils';
import ControlContainer from '@nextgis/control-container';

import { TileAdapter } from './layer-adapters/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { TerrainAdapter } from './layer-adapters/TerrainAdapter';
import { Model3DAdapter } from './layer-adapters/Model3DAdapter';
import { Tileset3DAdapter } from './layer-adapters/Tileset3DAdapter';
import { getDefaultTerrain } from './utils/getDefaultTerrain';

type Layer = any;
type Control = any;
type MapClickEvent = any;

export interface MapAdapterOptions {
  baseColor: string;
  depthTestAgainstTerrain: boolean;
  fxaaEnabled: boolean;
  requestRenderMode: boolean;
  viewerCesium3DTilesInspectorMixin: boolean;
  viewerCesiumInspectorMixin: boolean;
}

export class CesiumMapAdapter implements MapAdapter<Viewer, Layer> {
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

  static controlAdapters: Record<string, Type<MapControl>> = {
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
  private _controlContainer?: ControlContainer;
  private _terrainProviderChangedListener?: Event.RemoveCallback;

  create(options: MapOptions): void {
    this.options = { ...options };
    if (this.options.target) {
      // default terrain provider
      const ellipsoidProvider = getDefaultTerrain();

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
        skyBox: undefined,
        // skyAtmosphere: false,
        // useBrowserRecommendedResolution: true,
        sceneMode: SceneMode.SCENE3D,
        // terrainProvider: createWorldTerrain()
        terrainProvider: ellipsoidProvider,
        imageryProvider: undefined,
        // mapProjection: new Cesium.WebMercatorProjection()
        // contextOptions: { requestWebgl2: true }
      });
      GeoJsonDataSource.clampToGround = true;
      viewer.imageryLayers.removeAll();

      const ma: MapAdapterOptions = {
        baseColor: 'white',
        depthTestAgainstTerrain: false,
        fxaaEnabled: true,
        requestRenderMode: true,
        viewerCesium3DTilesInspectorMixin: false,
        viewerCesiumInspectorMixin: false,
      };
      if (this.options.mapAdapterOptions) {
        Object.assign(ma, this.options.mapAdapterOptions);
      }

      viewer.scene.globe.baseColor = Color.fromCssColorString(
        String(ma.baseColor)
      );
      viewer.scene.globe.depthTestAgainstTerrain = !!ma.depthTestAgainstTerrain;
      viewer.scene.postProcessStages.fxaa.enabled = !!ma.fxaaEnabled;
      viewer.scene.requestRenderMode = !!ma.requestRenderMode;
      const t = viewer.scene.terrainProviderChanged;
      this._terrainProviderChangedListener = t.addEventListener(
        (e: TerrainProvider) => {
          this._onTerrainChange(e);
        }
      );

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
      // this._setCustomLogo();
      this._controlContainer = new ControlContainer({
        addClass: 'cesium-control',
        map: this,
      });

      if (ma.viewerCesium3DTilesInspectorMixin) {
        viewer.extend(viewerCesium3DTilesInspectorMixin, {});
        // const inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
      }
      if (ma.viewerCesiumInspectorMixin) {
        viewer.extend(viewerCesiumInspectorMixin, {});
      }

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

  destroy(): void {
    if (this._terrainProviderChangedListener) {
      this._terrainProviderChangedListener();
    }
  }

  getContainer(): HTMLElement | undefined {
    if (this.map) {
      return this.map.container as HTMLElement;
    }
  }

  setCenter(lonLat: LngLatArray): void {
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
    const viewer = this.map;
    if (viewer) {
      const position = viewer.camera.position;
      const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
      return [
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude),
      ];
    }
  }

  setZoom(zoom: number): void {
    const viewer = this.map;
    if (viewer) {
      //
    }
  }

  getZoom(): number | undefined {
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

  zoomOut(): void {
    const viewer = this.map;
    if (viewer) {
      viewer.camera.zoomOut();
    }
  }

  zoomIn(): void {
    const viewer = this.map;
    if (viewer) {
      viewer.camera.zoomIn();
    }
  }

  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this.map) {
      const [west, south, east, north] = e;
      let destination: Cartesian3 | undefined;

      if (this.map.scene.mode === SceneMode.SCENE3D) {
        const rectangle = Rectangle.fromDegrees(west, south, east, north);
        const cartesian = this.map.camera.getRectangleCameraCoordinates(
          rectangle
        );

        const cartographic = Cartographic.fromCartesian(cartesian);
        cartographic.height += 500;
        destination = Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
        );
      } else {
        const pts = [west, south, west, north, east, north, east, south];
        // @ts-ignore
        destination = Rectangle.fromCartesianArray(
          Cartesian3.fromDegreesArray(pts)
        );
      }

      if (destination) {
        this.map.scene.camera.flyTo({
          destination,
          duration: options.duration || 0,
        });
      }
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

  setRotation(angle: number): void {
    //
  }

  removeLayer(layer: Layer): void {
    //
  }

  showLayer(layer: Layer): void {
    //
  }

  hideLayer(layer: Layer): void {
    //
  }

  setLayerOpacity(): void {
    // ignore
  }

  setLayerOrder(layer: Layer, order: number): void {
    //
  }

  createControl(control: MapControl, options: CreateControlOptions): any {
    // return
  }

  createButtonControl(options: ButtonControlOptions): any {
    // return
  }

  addControl(control: Control, position: ControlPositions): any {
    if (this._controlContainer) {
      this._controlContainer.addControl(control, position);
    }
  }

  removeControl(control: Control): void {
    //
  }

  onMapClick(evt: MapClickEvent): void {
    //
  }

  private _onTerrainChange(e: TerrainProvider) {
    // const viewer = this.map;
    // if (viewer) {
    //   const iniPos = viewer.camera.position;
    //   const cartographic = Cartographic.fromCartesian(iniPos);
    //   const positions = [cartographic];
    //   whenSampleTerrainMostDetailed(e, positions, () => {
    //     viewer.camera.moveUp(positions[0].height);
    //     // console.log(positions[0].height, viewer.camera.position);
    //   });
    // }
  }

  // private _setCustomLogo(): void {
  //   const viewer = this.map;
  //   if (viewer) {
  //     const credit = new Credit('<div></div>');
  //     // @ts-ignore
  //     viewer.scene.frameState.creditDisplay.addDefaultCredit(credit);
  //   }
  // }

  private _addEventsListener(): void {
    const viewer = this.map;
    if (viewer) {
      const events: [keyof WebMapEvents, Event | undefined][] = [
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
