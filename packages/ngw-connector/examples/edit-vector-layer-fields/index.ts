import NgwConnector from '@nextgis/ngw-connector';

import type {
  FeatureLayerFieldRead,
  FeatureLayerFieldWrite,
} from '@nextgisweb/feature-layer/type/api';
import type { CompositeRead } from '@nextgisweb/resource/type/api';

const fieldsBlock = document.getElementById('fields-block') as HTMLDivElement;
const vectorLayerKeyName = 'edit-resource-fields-example-layer';

const connector = new NgwConnector({
  baseUrl: 'https://sandbox.nextgis.com',
  auth: {
    login: 'administrator',
    password: 'demodemo',
  },
});

update();

function update() {
  connector.resources.cache.clean();
  // get or create test resource
  connector.getResource(vectorLayerKeyName).then((resource) => {
    if (resource) {
      drawFieldsBlock(resource);
    } else {
      createVectorResource().then(() => {
        update();
      });
    }
  });
}

function createVectorResource() {
  return connector.post('resource.collection', {
    data: {
      resource: {
        cls: 'vector_layer',
        parent: {
          id: 0,
        },
        display_name: 'NGF - Edit resource fields example layer',
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

function drawFieldsBlock(resource: CompositeRead) {
  if (!resource.feature_layer) {
    throw new Error(`Resource ${resource.resource.id} is not a feature layer`);
  }
  fieldsBlock.innerHTML =
    '<a href="https://sandbox.nextgis.com/resource/' +
    resource.resource.id +
    '" target="_blank">Open in NGW</a><p></p>';
  const fields = resource.feature_layer.fields;
  for (const f of fields) {
    fieldsBlock.appendChild(createFieldInput(resource.resource.id, f).element);
  }
  const newField = createFieldInput(resource.resource.id);
  fieldsBlock.appendChild(newField.element);
}

function createFieldInput(resourceId: number, field?: FeatureLayerFieldRead) {
  const element = document.createElement('div');
  const keyname = document.createElement('input');
  keyname.placeholder = 'keyname';
  element.appendChild(keyname);
  const displayName = document.createElement('input');
  displayName.placeholder = 'display_name';
  element.appendChild(displayName);
  const dataType = document.createElement('select');
  element.appendChild(dataType);
  ['STRING', 'REAL'].forEach((x) => {
    const option = document.createElement('option');
    option.innerHTML = x;
    option.value = x;
    dataType.appendChild(option);
  });

  if (field) {
    dataType.disabled = true;
    keyname.value = field.keyname;
    displayName.value = field.display_name;
    dataType.value = field.datatype;
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = 'delete';
    element.appendChild(removeBtn);
    removeBtn.onclick = () => {
      connector
        .route('resource.item', { id: resourceId })
        .put({
          json: {
            feature_layer: {
              fields: [{ id: field.id, delete: true }],
            },
          },
        })
        .then(() => {
          update();
        });
    };
    const updateBtn = document.createElement('button');
    updateBtn.innerHTML = 'update';
    element.appendChild(updateBtn);
    updateBtn.onclick = () => {
      connector
        .route('resource.item', { id: resourceId })
        .put({
          json: {
            feature_layer: {
              fields: [{ ...field, ...values() }],
            },
          },
        })
        .then(() => {
          update();
        });
    };
  } else {
    const addBtn = document.createElement('button');
    addBtn.innerHTML = 'add';
    element.appendChild(addBtn);
    addBtn.onclick = () => {
      connector
        .route('resource.item', { id: resourceId })
        .put({
          json: {
            feature_layer: {
              fields: [values()],
            },
          },
        })
        .then(() => {
          update();
        });
    };
  }
  const values = (): FeatureLayerFieldWrite => {
    return {
      keyname: keyname.value,
      display_name: displayName.value || keyname.value,
      datatype: dataType.value as FeatureLayerFieldWrite['datatype'],
    };
  };
  return { element, values };
}
