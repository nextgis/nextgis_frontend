import { expect } from 'chai';

import { ResourcesControl } from '../../packages/ngw-connector/src/ResourcesControl';
import { vectorLayerGeomToPaintTypeAlias } from '../../packages/ngw-kit/src/utils/utils';

import type { NgwConnectorExtended } from '../../packages/ngw-connector/src/NgwConnectorExtended';
import type { CompositeRead } from '@nextgisweb/resource/type/api';

function vectorResource(
  geometryType: 'POINT' | 'NONE' = 'POINT',
): CompositeRead {
  return {
    resource: {
      id: 1,
      cls: 'vector_layer',
      display_name: 'Layer',
    },
    vector_layer: {
      geometry_type: geometryType,
    },
    feature_layer: {
      fields: [
        {
          id: 1,
          keyname: 'payload',
          display_name: 'Payload',
          datatype: 'JSON',
          label_field: false,
          grid_visibility: true,
        },
      ],
    },
  } as unknown as CompositeRead;
}

describe('NGW API compatibility', () => {
  it('reads both resource search response formats', async () => {
    const item = vectorResource();
    const responses = [
      [item],
      {
        items: [item],
        total_count: 1,
        limit: null,
        offset: 0,
        order: [],
      },
    ];

    for (const response of responses) {
      const connector = {
        route: () => ({ get: () => Promise.resolve(response) }),
      } as unknown as NgwConnectorExtended;
      const resources = new ResourcesControl({ connector });

      expect(await resources.getMany({ keyname: 'layer' })).to.deep.equal([
        item,
      ]);
    }
  });

  it('does not select a paint type for no-geometry layers', () => {
    expect(vectorLayerGeomToPaintTypeAlias.NONE).to.be.undefined;
  });
});
