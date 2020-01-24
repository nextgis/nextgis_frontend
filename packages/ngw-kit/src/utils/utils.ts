import WebMap, {
  Type,
  LngLatBoundsArray,
  MapClickEvent
} from '@nextgis/webmap';
import NgwConnector, {
  WebmapResource,
  ResourceItem,
  FeatureLayersIdentify
} from '@nextgis/ngw-connector';
import { createAsyncAdapter } from '../createAsyncAdapter';
import {
  NgwLayerOptions,
  WebMapAdapterOptions,
  IdentifyRequestOptions,
  ResourceAdapter,
  ResourceIdNgwLayerOptions
} from '../interfaces';
import { WebMapLayerAdapter } from '../WebMapLayerAdapter';

export function updateWmsParams(params: any, resourceId: number) {
  const { bbox, width, height } = params;
  return {
    resource: resourceId,
    extent: bbox,
    size: width + ',' + height,
    timestamp: Date.now()
  };
}

export function getLayerAdapterOptions(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string
) {
  let adapter = options.adapter || 'IMAGE';
  let url: string;
  const layerAdapters = webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;

  // const keyname = (options as KeynamedNgwLayerOptions).keyname;
  const resourceId = (options as ResourceIdNgwLayerOptions).resourceId;
  // if (!resourceId && keyname) {
  //   const resourceItem = await connector.getResourceByKeyname(keyname);
  //   resourceId = resourceItem.resource.id;
  // }
  if (resourceId) {
    if (adapter === 'IMAGE') {
      if (isImageAllowed) {
        url = baseUrl + '/api/component/render/image';
        return {
          url,
          resourceId,
          headers: options.headers,
          updateWmsParams: (params: any) => updateWmsParams(params, resourceId)
        };
      } else {
        adapter = 'TILE';
      }
    }
    if (adapter === 'MVT') {
      url =
        baseUrl +
        '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
        'resource=' +
        resourceId +
        '&simplification=' +
        (options.simplification || 0);
      // url = baseUrl + '/api/resource/' + options.resourceId + '/{z}/{x}/{y}.mvt';
      return {
        url
      };
    }
    if (adapter === 'TILE') {
      url =
        baseUrl +
        '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' +
        resourceId;
      return { url, adapter };
    }
  } else {
    console.log('Options `resourceId` not set');
  }
}

export function addNgwLayer(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector
): Promise<Type<ResourceAdapter> | undefined> {
  const headers = connector.getAuthorizationHeaders();
  if (headers) {
    options.headers = headers;
  }

  return createAsyncAdapter(options, webMap, baseUrl, connector);
}

export function getWebMapExtent(
  webmap: WebmapResource
): LngLatBoundsArray | undefined {
  const bottom = webmap['extent_bottom'];
  const left = webmap['extent_left'];
  const top = webmap['extent_top'];
  const right = webmap['extent_right'];
  if (bottom && left && top && right) {
    const extent: LngLatBoundsArray = [left, bottom, right, top];
    if (extent[3] > 82) {
      extent[3] = 82;
    }
    if (extent[1] < -82) {
      extent[1] = -82;
    }
    return extent;
  }
}

export function getNgwLayerExtent(
  id: number,
  connector: NgwConnector
): Promise<LngLatBoundsArray | undefined> {
  return connector.get('layer.extent', name, { id }).then(resp => {
    if (resp) {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      const extenrArray: LngLatBoundsArray = [minLon, minLat, maxLon, maxLat];
      return extenrArray;
    }
  });
}

export async function getNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector
): Promise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return getWebMapExtent(item.webmap);
  } else {
    const resource = item.resource;
    if (resource.cls.indexOf('style') !== -1) {
      return connector
        .get('resource.item', null, {
          id: resource.parent.id
        })
        .then(res => {
          return getNgwLayerExtent(res.resource.id, connector);
        });
    } else {
      return getNgwLayerExtent(resource.id, connector);
    }
  }
}

interface FeatureIdentifyRequestOptions {
  /**
   * WKT Polygon geometry
   */
  geom: string;
  srs: 3857;
  layers: number[];
}

const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees
const earthsradius = 3963; // 3963 is the radius of the earth in miles

export function getCirclePoly(
  lng: number,
  lat: number,
  radius = 10,
  points = 6
) {
  // find the radius in lat/lon
  const rlat = (radius / earthsradius) * r2d;
  const rlng = rlat / Math.cos(lat * d2r);

  const extp = [];
  for (let i = 0; i < points + 1; i++) {
    // one extra here makes sure we connect the

    const theta = Math.PI * (i / (points / 2));
    const ex = lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
    const ey = lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
    extp.push([ex, ey]);
  }

  // add the circle to the map
  return extp;
}

export function degrees2meters(lng: number, lat: number): [number, number] {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return [x, y];
}

export function sendIdentifyRequest(
  ev: MapClickEvent,
  options: IdentifyRequestOptions
  // webMap: WebMap
): Promise<FeatureLayersIdentify> {
  // webMap.emitter.emit('start-identify', { ev });
  const geom = getCirclePoly(ev.latLng.lng, ev.latLng.lat, options.radius);

  // create wkt string
  const polygon: string[] = [];

  // webMap.addLayer('GEOJSON', {
  //   visibility: true,
  //   data: {
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Polygon',
  //       coordinates: [geom]
  //     }
  //   }
  // })

  geom.forEach(([lng, lat]) => {
    const [x, y] = degrees2meters(lng, lat);
    polygon.push(x + ' ' + y);
  });

  const wkt = `POLYGON((${polygon.join(', ')}))`;

  const layers: number[] = options.layers;

  const data: FeatureIdentifyRequestOptions = {
    geom: wkt,
    srs: 3857,
    layers
  };

  return options.connector.post('feature_layer.identify', { data });
}

interface ExtendWebMapLayerAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  baseUrl?: string;
}

export function extendWebMapLayerAdapter(
  opt: ExtendWebMapLayerAdapterOptions
): Type<WebMapLayerAdapter> {
  class A extends WebMapLayerAdapter {
    constructor(map: any, options: WebMapAdapterOptions) {
      options = { ...opt, ...options };
      super(map, options);
    }
  }
  return A;
}

let _pixelsInMeter: number;

export function pixelsInMeterWidth() {
  if (_pixelsInMeter === undefined) {
    const div = document.createElement('div');
    div.style.cssText =
      'position: absolute;  left: -100%;  top: -100%;  width: 100cm;';
    document.body.appendChild(div);
    const px = div.offsetWidth;
    document.body.removeChild(div);
    _pixelsInMeter = px;
  }
  return _pixelsInMeter;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name
      );
      if (descriptor) {
        Object.defineProperty(derivedCtor.prototype, name, descriptor);
      }
    });
  });
}

// Returns width of map in meters on specified latitude.
export function getMapWidthForLanInMeters(lat: number): number {
  return 6378137 * 2 * Math.PI * Math.cos((lat * Math.PI) / 180);
}

export function getZoomFromScale(scale: number) {
  return Math.log(scale / 256) / Math.LN2;
}

export function setScaleRatio(scale: number, lat = 104) {
  // TODO: get real center
  // webmap does not contain center yet
  // const center = [104, 45]; // this.webMap.getCenter();
  if (lat) {
    const centerLat = lat;
    const crsScale =
      (pixelsInMeterWidth() * getMapWidthForLanInMeters(centerLat)) / scale;
    const zoom = getZoomFromScale(crsScale);
    return zoom;
  }
  return Math.round(Math.log(591657550.5 / (scale / 2)) / Math.log(2));
}
