import type {
  FetchNgwLayerExtentOptions,
  FetchNgwLayerItemExtentOptions,
} from '../interfaces';
import type NgwConnector from '@nextgis/ngw-connector';
import type { ResourceItem, WebmapResource } from '@nextgis/ngw-connector';
import type { LngLatBoundsArray } from '@nextgis/utils';

export function getNgwWebmapExtent(
  webmap: WebmapResource,
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

export function fetchNgwLayerExtent({
  resourceId,
  connector,
  cache = true,
  signal,
}: FetchNgwLayerExtentOptions): Promise<LngLatBoundsArray | undefined> {
  return connector
    .get('layer.extent', { cache, signal }, { id: resourceId })
    .then((resp) => {
      if (resp) {
        const { maxLat, maxLon, minLat, minLon } = resp.extent;
        const extentArray: LngLatBoundsArray = [minLon, minLat, maxLon, maxLat];
        return extentArray;
      }
    });
}

export function fetchNgwLayerItemExtent({
  resourceId,
  featureId,
  connector,
  cache = true,
  signal,
}: FetchNgwLayerItemExtentOptions): Promise<LngLatBoundsArray | undefined> {
  return connector
    .get(
      'feature_layer.feature.item_extent',
      { cache, signal },
      { id: resourceId, fid: featureId },
    )
    .then((resp) => {
      if (resp) {
        const { maxLat, maxLon, minLat, minLon } = resp.extent;
        const extentArray: LngLatBoundsArray = [minLon, minLat, maxLon, maxLat];
        return extentArray;
      }
    });
}

export function fetchNgwExtent(
  options: FetchNgwLayerExtentOptions,
): Promise<LngLatBoundsArray | undefined> {
  return options.connector
    .getResource(options.resourceId, {
      signal: options.signal,
      cache: options.cache,
    })
    .then((resource) => {
      if (resource) {
        return fetchNgwResourceExtent(resource, options.connector, options);
      }
    });
}

/** @deprecated use {@link fetchNgwExtent} instead */
export function fetchNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector,
  options?: FetchNgwLayerExtentOptions,
): Promise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return Promise.resolve(getNgwWebmapExtent(item.webmap));
  } else {
    const resource = item.resource;
    if (resource.cls && resource.cls.indexOf('style') !== -1) {
      return connector.getResource(resource.parent.id, options).then((res) => {
        if (res) {
          return fetchNgwLayerExtent({
            ...options,
            resourceId: res.resource.id,
            connector,
          });
        }
      });
    } else {
      return fetchNgwLayerExtent({
        ...options,
        resourceId: resource.id,
        connector,
      });
    }
  }
}
