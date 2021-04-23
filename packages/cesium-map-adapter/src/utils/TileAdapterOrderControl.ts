import { ImageryLayer, ImageryLayerCollection } from 'cesium';

const catalog: [ImageryLayerCollection, [ImageryLayer, number][]][] = [];

export function addToTileCatalog(
  collection: ImageryLayerCollection,
  layer: ImageryLayer,
  order = 0,
): void {
  let exist = catalog.find((x) => x[0] === collection);
  if (!exist) {
    exist = [collection, []];
    catalog.push(exist);
  }
  if (exist) {
    exist[1].push([layer, order]);
    updateCollectionOrder(collection);
  }
}

export function updateCollectionOrder(
  collection: ImageryLayerCollection,
): void {
  const exist = catalog.find((x) => x[0] === collection);
  if (exist) {
    const arr = exist[1].filter((x) => collection.contains(x[0]));

    arr.sort((a, b) => {
      const aOrder = a[1];
      const bOrder = b[1];
      return aOrder - bOrder;
    });
    arr.forEach((x) => {
      collection.raiseToTop(x[0]);
    });
  }
}

export function removeFromTileCatalog(
  collection: ImageryLayerCollection,
  layer: ImageryLayer,
): void {
  const collectionExist = catalog.find((x) => x[0] === collection);
  if (collectionExist) {
    const layerIndex = collectionExist[1].findIndex((x) => x[0] === layer);
    if (layerIndex !== -1) {
      collectionExist[1].splice(layerIndex, 1);
    }
  }
}
