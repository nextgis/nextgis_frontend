import { EventEmitter } from 'events';

import ControlContainer from '@nextgis/control-container';
import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  Color,
  Ellipsoid,
  Entity,
  GeoJsonDataSource,
  GridImageryProvider,
  Rectangle,
  SceneMode,
  ScreenSpaceEventType,
  Viewer,
  WebMercatorProjection,
  viewerCesium3DTilesInspectorMixin,
  viewerCesiumInspectorMixin,
} from 'cesium';

import { MeasureControl } from './controls/MeasureControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { Model3DAdapter } from './layer-adapters/Model3DAdapter';
import { TerrainAdapter } from './layer-adapters/TerrainAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { Tileset3DAdapter } from './layer-adapters/Tileset3DAdapter';
import { cartesian3ToLngLat } from './utils/cartesian3ToLngLat';
import { getCameraFocus } from './utils/getCameraFocus';
import { getDefaultTerrain } from './utils/getDefaultTerrain';
import { whenSampleTerrainMostDetailed } from './utils/whenSampleTerrainMostDetailed';

import type { CesiumAdapterMapClickEvent } from './interfaces';
import type { PathPaint } from '@nextgis/paint';
import type { LngLatArray, LngLatBoundsArray, Type } from '@nextgis/utils';
import type {
  ButtonControlOptions,
  ControlPosition,
  CreateControlOptions,
  FitOptions,
  MapAdapter,
  MapClickEvent,
  MapControl,
  MapOptions,
  WebMapEvents,
} from '@nextgis/webmap';
import type {
  Cartesian2,
  Event,
  ScreenSpaceEventHandler,
  TerrainProvider,
} from 'cesium';

type Layer = any;
type Control = any;
// type MapClickEvent = any;

export interface MapAdapterOptions {
  baseColor: string;
  fxaaEnabled: boolean;
  highlightLayer?: PathPaint;
  requestRenderMode: boolean;
  depthTestAgainstTerrain: boolean;
  viewerCesiumInspectorMixin: boolean;
  viewerCesium3DTilesInspectorMixin: boolean;
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
    MEASURE: MeasureControl,
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
  private _ZOOM_SET_ID = 0;

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
        baseLayer: false,
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
        String(ma.baseColor),
      );
      viewer.scene.globe.depthTestAgainstTerrain = !!ma.depthTestAgainstTerrain;
      viewer.scene.postProcessStages.fxaa.enabled = !!ma.fxaaEnabled;
      viewer.scene.requestRenderMode = !!ma.requestRenderMode;
      const t = viewer.scene.terrainProviderChanged;
      this._terrainProviderChangedListener = t.addEventListener(
        (e: TerrainProvider) => {
          this._onTerrainChange(e);
        },
      );

      // While the inertia spin and zoom are enabled by default and look kinda cool,
      // they can be disabled very easily.
      // This will make it so the moveEnd event is fired as expected.
      // Here is how you can disable the inertia.
      viewer.scene.screenSpaceCameraController.inertiaSpin = 0;
      viewer.scene.screenSpaceCameraController.inertiaTranslate = 0;
      viewer.scene.screenSpaceCameraController.inertiaZoom = 0;

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
      // viewer._onMapClick: (() => void)[] = []
      this.map = viewer;
      this._removeLogo();
      this._controlContainer = new ControlContainer({
        addClass: 'cesium-control',
        map: this,
      });

      if (ma.viewerCesium3DTilesInspectorMixin) {
        viewer.extend(viewerCesium3DTilesInspectorMixin, {});
        // const inspectorViewModel = viewer.cesium3DTilesInspector;
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
          viewerContainer.firstChild,
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
      const z = Ellipsoid.WGS84.cartesianToCartographic(
        viewer.camera.position,
      ).height;
      const destination = Cartesian3.fromDegrees(lonLat[0], lonLat[1], z);
      viewer.camera.setView({
        destination,
      });
    }
  }

  getCenter(): LngLatArray | undefined {
    const viewer = this.map;
    if (viewer) {
      return cartesian3ToLngLat(viewer.camera.position);
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
      const cameraHeight = viewer.camera.positionCartographic.height;
      const maxZoom = 22;
      const minZoom = 0;

      const maxHeight = 20000000; // Corresponds to zoom level 0 (approximately)
      const minHeight = 100; // Corresponds to zoom level 22 (approximately)

      const zoom =
        maxZoom -
        ((Math.log(cameraHeight) - Math.log(minHeight)) /
          (Math.log(maxHeight) - Math.log(minHeight))) *
          (maxZoom - minZoom);

      return Math.max(minZoom, Math.min(maxZoom, zoom));
    }
    return undefined;
  }

  fetchZoom(): Promise<number | undefined> {
    return new Promise((resolve) => {
      const map = this.map;
      if (map) {
        const cartographic = Cartographic.fromCartesian(map.camera.position);
        whenSampleTerrainMostDetailed(
          map.terrainProvider,
          [cartographic],
          () => {
            resolve(cartographic.height);
          },
        );
      }
    });
  }

  zoomOut(): void {
    this._setZoomScalar(-2.0);
  }

  zoomIn(): void {
    this._setZoomScalar(2.0 / 3.0);
  }

  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this.map) {
      const [west, south, east, north] = e;
      let destination: Cartesian3 | undefined;

      if (this.map.scene.mode === SceneMode.SCENE3D) {
        const rectangle = Rectangle.fromDegrees(west, south, east, north);
        const cartesian =
          this.map.camera.getRectangleCameraCoordinates(rectangle);

        const cartographic = Cartographic.fromCartesian(cartesian);
        cartographic.height += 500;
        destination = Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height,
        );
      } else {
        const pts = [west, south, west, north, east, north, east, south];
        // @ts-ignore
        destination = Rectangle.fromCartesianArray(
          Cartesian3.fromDegreesArray(pts),
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
        this._scratchRectangle,
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

  addControl(control: Control, position: ControlPosition): any {
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

  private _setZoomScalar(scalar: number) {
    const cartesian3Scratch = new Cartesian3();
    const map = this.map;
    if (map) {
      const scene = map.scene;
      const camera = scene.camera;
      const focus = getCameraFocus(scene);
      const direction = Cartesian3.subtract(
        focus,
        camera.position,
        cartesian3Scratch,
      );
      const movementVector = Cartesian3.multiplyByScalar(
        direction,
        scalar,
        cartesian3Scratch,
      );
      let destination = Cartesian3.add(
        camera.position,
        movementVector,
        cartesian3Scratch,
      );
      const z = Ellipsoid.WGS84.cartesianToCartographic(destination).height;
      const cartographic = Cartographic.fromCartesian(destination);
      const zoomId = ++this._ZOOM_SET_ID;
      whenSampleTerrainMostDetailed(map.terrainProvider, [cartographic], () => {
        if (zoomId === this._ZOOM_SET_ID) {
          const newZ = Ellipsoid.WGS84.cartesianToCartographic(
            camera.position,
          ).height;
          const isUnderGround = cartographic.height + 100 - newZ > 0;
          if (isUnderGround) {
            cartographic.height = cartographic.height + 100;
            const onGround = Cartographic.toCartesian(cartographic);
            scene.camera.flyTo({ destination: onGround });
          }
        }
      });
      if (z < 100) {
        cartographic.height = 100;
        destination = Cartographic.toCartesian(cartographic);
      }
      scene.camera.flyTo({ destination, duration: 0 });
    }
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

  private _removeLogo(): void {
    const viewer = this.map;
    if (viewer) {
      try {
        // @ts-ignore
        const widget = viewer._cesiumWidget;
        const creditContainer = widget._creditContainer as HTMLElement;

        const logoContainer = creditContainer.getElementsByClassName(
          'cesium-credit-logoContainer',
        )[0];
        if (logoContainer && logoContainer.parentNode) {
          logoContainer.parentNode.removeChild(logoContainer);
        }
      } catch (er) {
        console.warn(er);
      }
      // const credit = new Credit('<div></div>');
      // @ts-ignore
      // viewer.scene.frameState.creditDisplay.addDefaultCredit(credit);
    }
  }

  private _addEventsListener(): void {
    const viewer = this.map;
    if (viewer) {
      this._addClickEvent();

      const events: [keyof WebMapEvents, Event | undefined][] = [
        ['zoomstart', undefined],
        ['zoom', undefined],
        ['zoomend', undefined],
        ['movestart', viewer.camera.moveStart],
        ['move', undefined],
        ['moveend', viewer.camera.moveEnd],
      ];
      for (const [name, event] of events) {
        if (event) {
          event.addEventListener(() => {
            this.emitter.emit(name);
          });
        }
      }
    }
  }

  private _addClickEvent() {
    const viewer = this.map;
    if (viewer) {
      const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        ScreenSpaceEventType.LEFT_CLICK,
      ) as ScreenSpaceEventHandler.PositionedEventCallback;

      // Remove default event click handler
      viewer.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_CLICK,
      );

      viewer.screenSpaceEventHandler.setInputAction(
        (e: ScreenSpaceEventHandler.PositionedEvent) => {
          this.emitter.emit('preclick');
          const ct2 = e.position as Cartesian2;
          const scene = viewer.scene;
          const globe = viewer.scene.globe;

          let cartesian: Cartesian3 | undefined;

          const ray = viewer.camera.getPickRay(ct2);
          if (ray) {
            // Use globe.pick to get the cartesian position on the terrain
            cartesian = globe.pick(ray, scene);
          } else {
            cartesian = scene.pickPositionSupported
              ? viewer.scene.pickPosition(ct2)
              : viewer.camera.pickEllipsoid(
                  new Cartesian3(ct2.x, ct2.y),
                  viewer.scene.globe.ellipsoid,
                );
          }

          const top = scene.canvas.clientHeight - ct2.y;
          const clickData: CesiumAdapterMapClickEvent = {
            pixel: { left: ct2.x, top, bottom: ct2.y },
            lngLat: cartesian
              ? cartesian3ToLngLat(cartesian)
              : [Infinity, Infinity],
            source: {
              ...e,
            },
          };

          const picked = viewer.scene.pick(ct2);
          const isEntityPicked = picked && picked.id instanceof Entity;
          // Stop propagation for click event on any entry picked
          if (!isEntityPicked) {
            this.emitter.emit('click', clickData);
          }
          clickHandler(e);
        },
        ScreenSpaceEventType.LEFT_CLICK,
      );
    }
  }
}
