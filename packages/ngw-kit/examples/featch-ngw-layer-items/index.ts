import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';

// NGW resource keyname
const keyname = 'eat-here';
const featureListBlock = document.getElementById(
  'feature-list',
) as HTMLDivElement;

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

connector.getResourceId(keyname).then((resourceId) => {
  if (resourceId === undefined) {
    throw new Error(`Resource ${keyname} not found`);
  }
  fetchNgwLayerItems({
    connector,
    resourceId,
    // it is good practice to only ask for fields that will be used
    fields: ['NAME'],
    // geom: false,
    filters: [['NAME', 'eq', 'Subway']],
    limit: 10,
    // Use the cache for lists carefully, it can overflow memory and break the browser.
    cache: true,
  }).then((items) => {
    featureListBlock.innerHTML = '';
    for (const i of items) {
      featureListBlock.innerHTML += `<p>${i.fields.NAME}</p>`;
    }
  });
});
