import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerItems, uploadFeatureAttachment } from '@nextgis/ngw-kit';

import type {
  CreatedResource,
  FeatureItem,
  FeatureItemAttachment,
} from '@nextgis/ngw-connector';
import type { CompositeRead } from '@nextgisweb/resource/type/api';

const logBlock = document.getElementById('log') as HTMLDivElement;
const featuresListBlock = document.getElementById(
  'features-list',
) as HTMLDivElement;

const log = function (message: string) {
  logBlock.innerHTML = message;
};
const vectorLayerKeyName = 'add-attachment-example-layer';

// 1. Preparation
// Get or create vector layer
const connector = new NgwConnector({
  baseUrl: 'https://sandbox.nextgis.com',
  auth: {
    login: 'administrator',
    password: 'demodemo',
  },
});
connector.getResource(vectorLayerKeyName).then(function (res) {
  if (!res) {
    log('Create vector resource');
    createVectorResource().then(function (newRes) {
      fillFeatures(newRes);
    });
  } else {
    fillFeatures(res);
  }
});

function createVectorResource() {
  return connector.post('resource.collection', {
    data: {
      resource: {
        cls: 'vector_layer',
        parent: {
          id: 0,
        },
        display_name: 'Add attachment example layer',
        keyname: vectorLayerKeyName,
        description: null,
      },
      resmeta: {
        items: {},
      },
      vector_layer: {
        srs: { id: 4326 },
        geometry_type: 'POINT',
        fields: [],
      },
    },
  });
}
// Fill vector layer with random features
function fillFeatures(res: CreatedResource | CompositeRead) {
  const id = 'resource' in res ? res.resource.id : res.id;
  connector
    .get('feature_layer.feature.count', null, { id: id })
    .then(function (resp) {
      const count = resp.total_count;
      const promises = [];
      for (let i = count; i < 5; i++) {
        promises.push(addFeaturePromise(id));
      }
      if (promises.length) {
        log('Add vector layer features');
      }
      Promise.all(promises).then(() => buildFeaturesList(id));
    });
}

function addFeaturePromise(resourceId: number) {
  return connector.post(
    'feature_layer.feature.collection',
    {
      data: {
        extensions: {},
        fields: {},
        geom: 'POINT (' + getRandomPointCoord().join(' ') + ')',
      },
    },
    { id: resourceId, srs: 4326 },
  );
}

function getRandomPointCoord(): [number, number] {
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return [
    Math.round(Math.random() * 180),
    Math.round(Math.random() * 90 * plusOrMinus),
  ];
}
// end of preparation

// 2. Create features list html block with add attachment button
function buildFeaturesList(resourceId: number) {
  featuresListBlock.innerHTML = '';
  fetchNgwLayerItems({
    connector: connector,
    resourceId: resourceId,
    limit: 5,
    geom: false,
    extensions: ['attachment'],
  }).then(function (items) {
    const link =
      '<a href="' +
      connector.options.baseUrl +
      '/resource/' +
      resourceId +
      '" target="_blank">open in ngw</a>';
    log('Features (' + link + '):');
    for (let i = 0; i < items.length; i++) {
      const itemBlock = createFeatureItemBlock(resourceId, items[i]);
      featuresListBlock.appendChild(itemBlock);
    }
  });
}

// A quick way to redraw the list without updating each changed element
function redraw(resourceId: number) {
  log('Updating...');
  buildFeaturesList(resourceId);
}

function createFeatureItemBlock(resourceId: number, item: FeatureItem) {
  const block = document.createElement('div');
  block.className = 'feature-item';

  block.innerHTML = [
    '<div class="item-part">#' + item.id + '</div>',
    '<div class="item-part"><input class="input' +
      item.id +
      '"type="file" /></div>',
    '<div class="item-part images' + item.id + '"></div>',
  ].join('');
  const input = block.getElementsByClassName(
    'input' + item.id,
  )[0] as HTMLInputElement;
  input.addEventListener('change', function () {
    const file = input.files?.[0];
    if (file) {
      addFeatureAttachment(resourceId, item.id, file);
    }
  });

  const images = block.getElementsByClassName(
    'images' + item.id,
  )[0] as HTMLDivElement;
  const attachments = item.extensions.attachment;
  if (attachments) {
    for (let i = 0; i < attachments.length; i++) {
      const attachmentBlock = createImageBlock(
        resourceId,
        item.id,
        attachments[i],
      );
      images.appendChild(attachmentBlock);
    }
  }
  return block;
}

function createImageBlock(
  resourceId: number,
  featureId: number,
  attach: FeatureItemAttachment,
) {
  const imgBlock = document.createElement('div');
  imgBlock.innerHTML = [
    '<div class="item-part">' + attach.name + '</div>',
    '<div class="item-part image-wrap' + attach.id + '"></div>',
    '<div class="item-part"><button class="attach-del-btn-' +
      attach.id +
      '">✕</button></div>',
  ].join('');

  const deleteAttachBtn = imgBlock.getElementsByClassName(
    'attach-del-btn-' + attach.id,
  )[0];
  deleteAttachBtn.addEventListener('click', function () {
    connector
      .delete('feature_attachment.item', null, {
        id: resourceId,
        fid: featureId,
        aid: attach.id,
      })
      .then(() => {
        redraw(resourceId);
      });
  });

  if (attach.is_image) {
    const imgWrapper = imgBlock.getElementsByClassName(
      'image-wrap' + attach.id,
    )[0];
    // Show image preview.
    // Using connector here is necessary to display attachment with BASE authorization
    connector
      .get(
        'feature_attachment.image',
        { responseType: 'blob' },
        {
          id: resourceId,
          fid: featureId,
          aid: attach.id,
          size: '40x40',
        },
      )
      .then((src) => {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(src);
        imgWrapper.innerHTML = '<img src="' + imageUrl + '">';
      });
  }
  return imgBlock;
}

function addFeatureAttachment(rid: number, fid: number, file: File) {
  return uploadFeatureAttachment({
    connector: connector,
    resourceId: rid,
    featureId: fid,
    file: file,
  }).then(() => {
    redraw(rid);
  });
}
