import { Feature } from 'geojson';
import { ResourceItem } from '@nextgis/ngw-connector';

export function createPopupContent(
  feature: Feature,
  item?: ResourceItem,
): HTMLElement | string {
  // @ts-ignore
  if (__BROWSER__) {
    const element = document.createElement('div');
    if (item && item.feature_layer) {
      item.feature_layer.fields.forEach((x) => {
        if (x.grid_visibility) {
          const value = feature.properties && feature.properties[x.keyname];
          if (value) {
            const propElem = document.createElement('div');
            element.appendChild(propElem);
            propElem.innerHTML = `<span>${x.display_name}</span>: ${value}<span></span>`;
          }
        }
      });
    } else if (feature.properties) {
      for (const p in feature.properties) {
        const propElem = document.createElement('div');
        element.appendChild(propElem);
        propElem.innerHTML = `<span>${p}</span>: ${feature.properties[p]}<span></span>`;
      }
    }
    return element;
  } else {
    return '';
  }
}
