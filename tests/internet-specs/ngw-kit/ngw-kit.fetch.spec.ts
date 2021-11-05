import { Point, Position } from 'geojson';

import { expect } from 'chai';
import { Connection } from '../../../packages/ngw-orm/src';
import { SandboxGroupNgwKit } from '../../helpers/ngw-orm/SandboxGroupNgwKit';
import {
  SandboxPointLayer,
  ISandboxPointLayer,
} from '../../helpers/ngw-orm/SandboxPointLayer';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';

const TESTS_GROUP_ID = 0;
let CONNECTION: Connection;

function getConnection(): Promise<Connection> {
  if (CONNECTION) {
    return Promise.resolve(CONNECTION);
  }
  return Connection.connect({
    baseUrl: 'https://sandbox.nextgis.com',
    auth: {
      login: 'administrator',
      password: 'demodemo',
    },
  }).then((connection) => {
    CONNECTION = connection;
    return connection;
  });
}

const features: [ISandboxPointLayer, Position][] = [
  [{ number: 12, test: 'foofoo' }, [1, 1]],
  [{ number: 11, test: 'FooFoo' }, [0, 1]],
  [{ number: 11, test: 'barbar' }, [0, 0]],
  [{ number: 11, test: 'BarBar' }, [1, 0]],
  [{ number: 11, test: 'FooBar' }, [1, 0]],
  [{ number: 11, test: 'foobar' }, [1, 0]],
];

async function newPointLayer(name: string) {
  const connection = await getConnection();
  const Clone = SandboxPointLayer.clone<typeof SandboxPointLayer>({
    display_name: name,
  });

  const [Point, created] = await connection.getOrCreateResource(Clone, {
    parent: SandboxGroupNgwKit,
  });
  if (created) {
    for (const [properties, coordinates] of features) {
      const p = new Point({ properties, coordinates });
      await p.save();
    }
  }
  return Point;
}

describe('NgwKit', function () {
  this.timeout(15000);

  before(async () => {
    const connection = await getConnection();
    await connection.getOrCreateResource(SandboxGroupNgwKit, {
      parent: TESTS_GROUP_ID,
    });
  });

  after(async () => {
    const connection = await getConnection();
    await connection.deleteResource(SandboxGroupNgwKit);
  });

  describe('#fetchNgwLayerItems', () => {
    it(`ilike filter`, async () => {
      const connection = await getConnection();
      const pointLayer = await newPointLayer('NgwKit items');
      const resourceId = pointLayer.item.resource.id;
      const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['%test', 'ilike', 'bar']],
      });
      expect(items1.length).to.be.equal(4);

      const items2 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['test%', 'ilike', 'foo']],
      });
      expect(items2.length).to.be.equal(4);

      const items3 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['%test%', 'ilike', 'oB']],
      });
      expect(items3.length).to.be.equal(2);

      const items4 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['test', 'ilike', 'FooFoo']],
      });
      expect(items4.length).to.be.equal(2);
    });

    it(`like filter`, async () => {
      const connection = await getConnection();
      const pointLayer = await newPointLayer('NgwKit items');
      const resourceId = pointLayer.item.resource.id;
      const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['%test', 'like', 'bar']],
      });
      expect(items1.length).to.be.equal(2);

      const items2 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['test%', 'like', 'foo']],
      });
      expect(items2.length).to.be.equal(2);

      const items3 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['%test%', 'like', 'oB']],
      });
      expect(items3.length).to.be.equal(1);

      const items4 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
        connector: connection.driver,
        resourceId,
        filters: [['test', 'like', 'FooFoo']],
      });
      expect(items4.length).to.be.equal(1);
    });
  });
});
