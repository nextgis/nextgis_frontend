import CancelablePromise from '@nextgis/cancelable-promise';
import type { LngLatBoundsArray } from '@nextgis/webmap';
import type NgwConnector from '@nextgis/ngw-connector';
import type { WebmapResource, ResourceItem } from '@nextgis/ngw-connector';
import type {
  FetchNgwLayerExtentOptions,
  FetchNgwLayerItemExtentOptions,
} from '../interfaces';

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
}: FetchNgwLayerExtentOptions): CancelablePromise<
  LngLatBoundsArray | undefined
> {
  return connector
    .get('layer.extent', { cache }, { id: resourceId })
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
}: FetchNgwLayerItemExtentOptions): CancelablePromise<
  LngLatBoundsArray | undefined
> {
  return connector
    .get(
      'feature_layer.feature.item_extent',
      { cache },
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

export function fetchNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector,
): CancelablePromise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return CancelablePromise.resolve(getNgwWebmapExtent(item.webmap));
  } else {
    const resource = item.resource;
    if (resource.cls && resource.cls.indexOf('style') !== -1) {
      return connector.getResource(resource.parent.id).then((res) => {
        if (res) {
          return fetchNgwLayerExtent({
            resourceId: res.resource.id,
            connector,
          });
        }
      });
    } else {
      return fetchNgwLayerExtent({ resourceId: resource.id, connector });
    }
  }
}
