import NgwUploader from '@nextgis/ngw-uploader';

import type { CompositeRead } from '@nextgisweb/resource/type/api';

interface ProxyLayerConfig {
  id: string;
  name: string;
  vendorParams: Record<string, string>;
}

interface WmsConfig {
  name: string;
  proxyLayers: ProxyLayerConfig[];
  url: string;
}

const configs: WmsConfig[] = [
  {
    url: 'http://maps.kosmosnimki.ru/rest/ver1/service/wms?apikey=84RY0J61QQ&BGCOLOR=0xFFFFFF',
    name: 'kosmosnimki_white',
    proxyLayers: [
      {
        id: '04C9E7CE82C34172910ACDBF8F1DF49A',
        name: 'white_2012',
        vendorParams: {
          StartDate: '01.01.2012 12:59:59',
          EndDate: '31.12.2012 12:59:59',
        },
      },
      {
        id: '04C9E7CE82C34172910ACDBF8F1DF49A',
        name: 'white_2013',
        vendorParams: {
          StartDate: '01.01.2013 12:59:59',
          EndDate: '31.12.2013 12:59:59',
        },
      },
    ],
  },
  {
    url: 'http://maps.kosmosnimki.ru/rest/ver1/service/wms?apikey=84RY0J61QQ&BGCOLOR=0xFF0000',
    name: 'kosmosnimki_red',
    proxyLayers: [
      {
        id: '04C9E7CE82C34172910ACDBF8F1DF49A',
        name: 'red_2012',
        vendorParams: {
          StartDate: '01.01.2012 12:59:59',
          EndDate: '31.12.2012 12:59:59',
        },
      },
      {
        id: '04C9E7CE82C34172910ACDBF8F1DF49A',
        name: 'red_2013',
        vendorParams: {
          StartDate: '01.01.2013 12:59:59',
          EndDate: '31.12.2013 12:59:59',
        },
      },
    ],
  },
];

const baseUrl = 'https://sandbox.nextgis.com';

const wmsUrlsToConnect = document.getElementById(
  'wms-urls-to-connect',
) as HTMLUListElement;
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

const ngwUploader = new NgwUploader({
  baseUrl,
});

ngwUploader.emitter.on('status:change', (evt) => {
  const li = document.createElement('li');
  statusUpload.appendChild(li);
  li.innerHTML = evt.message ?? '';
  if (evt.data?.id !== undefined) {
    li.innerHTML += `&nbsp<a href="${baseUrl}/resource/${evt.data.id}" target="_blank">Open</a>`;
  }
});

for (let fry = 0; fry < configs.length; fry++) {
  const config = configs[fry];
  if (!config) {
    continue;
  }
  // insert urls to document
  wmsUrlsToConnect.innerHTML += '<li>' + config.url + '</li>';
}
let parentId = 0;

button.onclick = function () {
  const name = 'wms_params_example_' + new Date().toISOString();
  // Create group for all new resources
  ngwUploader.createGroup({ name, parentId: 0 }).then((group) => {
    parentId = group.id;
    const connectionPromises = [];
    for (let fry = 0; fry < configs.length; fry++) {
      const config = configs[fry];
      if (!config) {
        continue;
      }
      // crate WMS connection query
      const connectionQuery = ngwUploader
        .createWmsConnection({
          name: 'custom_' + config.name,
          parentId: parentId,
          url: config.url,
          version: '1.1.1',
        })
        .then((newWmsConnection) => {
          return ngwUploader.getResource(newWmsConnection.id);
        });

      connectionPromises.push(connectionQuery);
    }

    Promise.all(connectionPromises).then(onWmsConnectionCreated);
  });
};

function createConnectLayerPromise(
  wmsData: CompositeRead,
  id: string,
  title: string,
  vendorParams: Record<string, string>,
) {
  if (!wmsData.resource.parent) {
    throw new Error('WMS connection parent is unavailable');
  }
  return ngwUploader
    .createWmsConnectedLayer({
      id: wmsData.resource.id,
      parentId: wmsData.resource.parent.id,
      name: title,
      wmslayers: [id],
      vendor_params: vendorParams,
    })
    .then((newLayer) => ({ ...newLayer, name: title }));
}

function onWmsConnectionCreated(
  newWmsConnection: Array<CompositeRead | undefined>,
) {
  // update DOM, show list of conected WMS resources
  resultBlock.style.display = 'block';
  wmsConnectBlock.style.display = 'none';
  wmsDataBlock.innerHTML = '';
  wmsLayersBlock.style.display = 'block';
  wmsDataBlock.appendChild(document.createElement('pre')).innerHTML =
    JSON.stringify(newWmsConnection, null, 2);

  createWmsLayersBtn.onclick = () => {
    const connectLayerPromises = [];
    for (let fry = 0; fry < newWmsConnection.length; fry++) {
      const wmsData = newWmsConnection[fry];
      const config = configs[fry];
      if (!wmsData?.wmsclient_connection?.capcache || !config) {
        continue;
      }
      const layers = wmsData.wmsclient_connection.capcache.layers;
      for (let f = 0; f < config.proxyLayers.length; f++) {
        const proxyLayer = config.proxyLayers[f];
        const exist = layers.find((x) => {
          return x.id === proxyLayer.id;
        });
        if (exist) {
          // Create conection with updating WMS parameters from config
          connectLayerPromises.push(
            createConnectLayerPromise(
              wmsData,
              exist.id,
              proxyLayer.name,
              proxyLayer.vendorParams,
            ),
          );
        }
      }
    }

    if (connectLayerPromises.length) {
      createWmsLayersBtn.disabled = true;

      Promise.all(connectLayerPromises).then((values) => {
        const layers = [];
        for (let fry = 0; fry < values.length; fry++) {
          const layer = values[fry];
          layers.push({
            keyname: 'image' + fry,
            display_name: layer.name,
            resource_id: layer.id,
          });
        }
        // Create wms service with updated layers
        ngwUploader
          .createWms({
            name: 'custom',
            parentId: parentId,
            layers: layers,
          })
          .then((newWmsService) => {
            // Update DOM with data from result WMS service
            ngwUploader.getResource(newWmsService.id).then((wmsService) => {
              wmsLayersBlock.style.display = 'none';
              wmsDataBlock.innerHTML = '';
              wmsDataBlock.appendChild(
                document.createElement('pre'),
              ).innerHTML = JSON.stringify(wmsService, null, 2);
            });
          });
      });
    }
  };
}
