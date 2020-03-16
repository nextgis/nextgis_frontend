import { Feature } from "geojson";
import { ResourceItem } from "@nextgis/ngw-connector";
import { create } from "@nextgis/dom";

export function createPopupContent(feature: Feature, item?: ResourceItem, ): HTMLElement | string {
  const element = create('div');
  if (item) {
    item.feature_layer?.fields.forEach(x => {
      if (x.grid_visibility) {
        const value = feature.properties && feature.properties[x.keyname];
        if (value) {
          const propElem = create('div', null, element);
          propElem.innerHTML = `<span>${x.display_name}</span>: ${value}<span></span>`
        }
      }
    });
  } else if (feature.properties) {
    for (const p in feature.properties) {
      const propElem = create('div', null, element);
      propElem.innerHTML = `<span>${p}</span>: ${feature.properties[p]}<span></span>`
    }
  }

  return element;
}
