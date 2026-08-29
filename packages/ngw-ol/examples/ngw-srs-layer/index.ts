import NgwMap from '@nextgis/ngw-ol';

import type { LineString } from 'geojson';

const vectorLayerKeyName = 'ngw-coordinate-transform';

const ngwMap = new NgwMap({
  baseUrl: 'https://sandbox.nextgis.com',
  auth: {
    login: 'administrator',
    password: 'demodemo',
  },
  target: 'map',
  osm: true,
});

ngwMap.onLoad().then(() => {
  const connector = ngwMap.connector;

  connector.getResource(vectorLayerKeyName).then((res) => {
    if (!res) {
      createVectorResource().then((newRes) => {
        fillFeatures(newRes.id).then(() => {
          onGeometryCreate(newRes.id);
        });
      });
    } else {
      fillFeatures(res.resource.id).then(() => {
        onGeometryCreate(res.resource.id);
      });
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
          display_name: 'NGF - Coordinate transform example',
          keyname: vectorLayerKeyName,
          description: null,
        },
        resmeta: {
          items: {},
        },
        vector_layer: {
          srs: { id: 3857 },
          geometry_type: 'LINESTRING',
          fields: [],
        },
      },
    });
  }

  function fillFeatures(id: number) {
    return connector
      .get('feature_layer.feature.count', null, { id: id })
      .then(function (resp) {
        const count = resp.total_count;
        const promises = [];
        for (let i = count; i < 1; i++) {
          promises.push(addFeaturePromise(id));
        }
        return Promise.all(promises);
      });
  }

  const geom =
    'LINESTRING (4061758.489219 6534209.544788, 4062483.849139 6533931.123808)';

  function addFeaturePromise(resourceId: number) {
    return connector.post(
      'feature_layer.feature.collection',
      {
        data: {
          extensions: {},
          fields: {},
          geom,
        },
      },
      {
        id: resourceId,
      },
    );
  }

  function onGeometryCreate(resource: number) {
    [3857, 4326].forEach((srs) => {
      Promise.all([
        ngwMap
          .addNgwLayer({
            id: vectorLayerKeyName,
            resource: resource,
            adapter: 'GEOJSON',
            fit: true,
            adapterOptions: {
              srs,
              paint: {
                color: srs === 3857 ? 'green' : 'red',
                weight: srs === 3857 ? 10 : 5,
              },
            },
          })
          .then((layer) => {
            if (!layer) {
              throw new Error(`Failed to add NGW layer ${resource}`);
            }
            const features = layer.getLayers();
            return features.map(
              ({ feature }) => (feature.geometry as LineString).coordinates,
            );
          }),
        ngwMap
          .fetchNgwLayerItems({ resourceId: resource, srs: 3857 })
          .then((resp) => {
            return resp.map((item) => (item.geom as LineString).coordinates);
          }),
      ]).then((coordArray) => {
        // Each coordinate from the layer on the map and from the data
        // obtained using the api should correspond to the one from which the object was created.
        //
        // the source coordinates are different, so it will be enough to check for compliance with one of them.
        console.log(
          coordArray.flat(Infinity).every((x) => geom.search(String(x)) !== -1),
        );
      });
    });
  }
});
