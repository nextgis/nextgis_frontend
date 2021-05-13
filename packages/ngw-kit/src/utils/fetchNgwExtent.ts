import { LngLatBoundsArray } from '@nextgis/webmap';
import NgwConnector, {
  WebmapResource,
  ResourceItem,
} from '@nextgis/ngw-connector';

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

export function fetchNgwLayerExtent(
  id: number,
  connector: NgwConnector,
): Promise<LngLatBoundsArray | undefined> {
  return connector.get('layer.extent', null, { id }).then((resp) => {
    if (resp) {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      const extenrArray: LngLatBoundsArray = [minLon, minLat, maxLon, maxLat];
      return extenrArray;
    }
  });
}

export async function fetchNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector,
): Promise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return getNgwWebmapExtent(item.webmap);
  } else {
    const resource = item.resource;
    if (resource.cls && resource.cls.indexOf('style') !== -1) {
      return connector.getResource(resource.parent.id).then((res) => {
        if (res) {
          return fetchNgwLayerExtent(res.resource.id, connector);
        }
      });
    } else {
      return fetchNgwLayerExtent(resource.id, connector);
    }
  }
}

/**
 * @deprecated use {@link fetchNgwLayerExtent} instead
 */
export function getNgwLayerExtent(
  id: number,
  connector: NgwConnector,
): Promise<LngLatBoundsArray | undefined> {
  return fetchNgwLayerExtent(id, connector);
}
/**
 * @deprecated use {@link fetchNgwResourceExtent} instead
 */
export async function getNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector,
): Promise<LngLatBoundsArray | undefined> {
  return fetchNgwResourceExtent(item, connector);
}
