import NgwConnector from '@nextgis/ngw-connector';
import {
  mapFeatureDisplayName,
  selectNgwLayerDistinct,
} from '@nextgis/ngw-kit';

// NGW resource keyname
const keyname = 'eat-here';
const featureListBlock = document.getElementById(
  'feature-list',
) as HTMLDivElement;
const fields = ['AMENITY', 'NAME'];
const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

connector.getResource(keyname).then((res) => {
  if (!res) {
    throw new Error(`Resource ${keyname} not found`);
  }
  const resourceId = res.resource.id;
  return mapFeatureDisplayName({
    connector,
    resourceId,
    fields,
  }).then((displayFields) => {
    selectNgwLayerDistinct({
      fields,
      connector,
      resourceId,
      filters: [['NAME', 'ilike', '%Cafe%']],
    }).then((select) => {
      featureListBlock.innerHTML = '';
      for (const k in select) {
        featureListBlock.innerHTML += `<p></p><p><b>${
          displayFields[fields.indexOf(k)]
        }</b></p><ul>`;

        for (const i of select[k]) {
          featureListBlock.innerHTML += `<li>${i}</li>`;
        }
        featureListBlock.innerHTML += `</ul>`;
      }
    });
  });
});
