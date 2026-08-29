import NgwUploader from '@nextgis/ngw-uploader';

import type { CreatedResource } from '@nextgis/ngw-connector';

const input = document.getElementById('wms-url') as HTMLInputElement;
const button = document.getElementById('connect-wms') as HTMLButtonElement;
const resultBlock = document.getElementById('result-block') as HTMLDivElement;
const statusUpload = document.getElementById('status') as HTMLDivElement;
const wmsDataBlock = document.getElementById(
  'wms-data-block',
) as HTMLDivElement;
const wmsConnectBlock = document.getElementById(
  'wms-connect-block',
) as HTMLDivElement;

const wmsLayersBlock = document.getElementById(
  'wms-layers-block',
) as HTMLDivElement;
const createWmsLayersBtn = document.getElementById(
  'create-wms-layers',
) as HTMLButtonElement;
const layersSelect = document.getElementById('layers-select') as HTMLDivElement;

const ngwUploader = new NgwUploader({
  baseUrl: 'https://sandbox.nextgis.com',
});

ngwUploader.emitter.on('status:change', (evt) => {
  statusUpload.innerHTML = evt.message ?? '';
});

let parentId = 0;

button.onclick = () => {
  // Create group for all new resources
  ngwUploader
    .createGroup({
      displayName: 'wms_proxy_example_' + new Date().toISOString(),
      parentId: 0,
    })
    .then((group) => {
      parentId = group.id;
      ngwUploader
        .createWmsConnection({
          name: 'custom',
          parentId,
          url: input.value,
          version: '1.1.1',
        })
        .then(onWmsConectionCreated);
    });
};

function onWmsConectionCreated(newWmsConnection: CreatedResource) {
  resultBlock.style.display = 'block';
  ngwUploader.getResource(newWmsConnection.id).then((wmsData) => {
    if (!wmsData?.wmsclient_connection?.capcache) {
      throw new Error('WMS connection capabilities are unavailable');
    }
    if (!wmsData.resource.parent) {
      throw new Error('WMS connection parent is unavailable');
    }
    const connectionParentId = wmsData.resource.parent.id;
    wmsConnectBlock.style.display = 'none';
    wmsDataBlock.innerHTML = '';
    wmsLayersBlock.style.display = 'block';
    wmsDataBlock.appendChild(document.createElement('pre')).innerHTML =
      JSON.stringify(wmsData, null, 2);

    const layers = wmsData.wmsclient_connection.capcache.layers;
    const layersToCreate: Record<string, string | false> = {};

    const createPromise = (id: string, title: string) => {
      return ngwUploader
        .createWmsConnectedLayer({
          id: wmsData.resource.id,
          parentId: connectionParentId,
          name: title,
          wmslayers: [id],
        })
        .then((newLayer) => ({ ...newLayer, name: title }));
    };

    for (let fry = 0; fry < layers.length; fry++) {
      const layer = layers[fry];
      const label = document.createElement('checkbox');
      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(layer.title));
      checkbox.onchange = () => {
        layersToCreate[layer.id] = checkbox.checked ? layer.title : false;
      };
      layersSelect.appendChild(label);
    }
    createWmsLayersBtn.onclick = () => {
      const promises = [];
      for (const l in layersToCreate) {
        const title = layersToCreate[l];
        if (title) {
          const promise = createPromise(l, title);
          promises.push(promise);
        }
      }
      if (promises.length) {
        createWmsLayersBtn.disabled = true;
        window.Promise.all(promises).then((values) => {
          const layers = [];
          for (let fry = 0; fry < values.length; fry++) {
            const layer = values[fry];
            layers.push({
              keyname: 'image' + fry,
              display_name: layer.name,
              parentId: parentId,
              resource_id: layer.id,
            });
          }
          ngwUploader
            .createWms({
              name: 'proxy',
              parentId: parentId,
              layers: layers,
            })
            .then((newWmsService) => {
              ngwUploader.getResource(newWmsService.id).then((wmsService) => {
                wmsLayersBlock.style.display = 'none';
                wmsDataBlock.innerHTML = '';
                wmsDataBlock.appendChild(
                  document.createElement('pre'),
                ).innerHTML = JSON.stringify(wmsService, null, 2);
              });
            });
        });
      } else {
        statusUpload.innerHTML = 'no one layer selected';
      }
    };
  });
}
