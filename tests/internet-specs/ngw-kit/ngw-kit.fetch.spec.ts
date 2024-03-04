import { fetchNgwLayerItems } from '@nextgis/ngw-kit';
import { expect } from 'chai';

import { Connection } from '../../../packages/ngw-orm/src';
import { SandboxGroupNgwKit } from '../../helpers/ngw-orm/SandboxGroupNgwKit';
import { SandboxPointLayer } from '../../helpers/ngw-orm/SandboxPointLayer';
import { SandboxPointLayerSpecial } from '../../helpers/ngw-orm/SandboxPointLayerSpecial';

import type { ISandboxPointLayer } from '../../helpers/ngw-orm/SandboxPointLayer';
import type { ISandboxPointLayerSpecial } from '../../helpers/ngw-orm/SandboxPointLayerSpecial';
import type { Point, Position } from 'geojson';

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
  [{ number: 111, test: 'VAL_a' }, [1, 1]],
  [{ number: 112, test: 'VAL_a' }, [1, 1]],
  [{ number: 113, test: 'VAL_a' }, [1, 1]],

  [{ number: 111, test: 'VAL_b' }, [1, 1]],
  [{ number: 112, test: 'VAL_b' }, [1, 1]],
  [{ number: 113, test: 'VAL_b' }, [1, 1]],

  [{ number: 111, test: 'VAL_c' }, [1, 1]],
  [{ number: 112, test: 'VAL_c' }, [1, 1]],
  [{ number: 113, test: 'VAL_c' }, [1, 1]],

  [{ number: 211, test: 'VAL_d' }, [1, 1]],
  [{ number: 212, test: 'VAL_d' }, [1, 1]],

  [{ number: 12, test: 'foofoo' }, [1, 1]],
  [{ number: 11, test: 'FooFoo' }, [0, 1]],
  [{ number: 11, test: 'barbar' }, [0, 0]],
  [{ number: 11, test: 'BarBar' }, [1, 0]],
  [{ number: 11, test: 'FooBar' }, [1, 0]],
  [{ number: 11, test: 'foobar' }, [1, 0]],
  [{ number: null, test: null }, [1, 0]],
  [{ number: null, test: null }, [1, 0]],
  [
    {
      number: 11,
      test: 'съешь ещё этих мягких французских булок, да выпей чаю',
    },
    [1, 0],
  ],
  [
    {
      number: 11,
      test: 'Съешь Ещё Этих Мягких Французских Булок, Да Выпей Чаю',
    },
    [1, 0],
  ],
];

const featuresSpecial: ISandboxPointLayerSpecial[] = [
  {
    // id: 1,
    ATTR_G: 'g1',
    ATTR_N: 'n, 78',
    ATTR_Z: '000, 000',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },

  {
    // id: 2,
    ATTR_G: 'g2',
    ATTR_N: 'n, 78',
    ATTR_Z: '444, 444',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },

  {
    // id: 3,
    ATTR_G: 'g3',
    ATTR_N: 'n, 73/2',
    ATTR_Z: '888, 888',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },

  {
    // id: 4,
    ATTR_G: 'g4',
    ATTR_N: 'n, 73/2',
    ATTR_Z: '000, 000',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },

  {
    // id: 5,
    ATTR_G: 'g5',
    ATTR_N: 'n, 73/2',
    ATTR_Z: '000, 000',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },

  {
    // id: 6,
    ATTR_G: 'g5',
    ATTR_N: 'n, 00/0',
    ATTR_Z: '000, 000',
    ATTR_S: 'some',
    ATTR_K: 'some',
    ATTR_P: 'some',
  },
];

async function newPointLayerId(name: string) {
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
  if (!Point.item) {
    throw new Error('Not new Point layer item');
  }
  return Point.item?.resource.id;
}
async function newSpecialLayerId(name: string) {
  const connection = await getConnection();
  const Clone = SandboxPointLayerSpecial.clone<typeof SandboxPointLayerSpecial>(
    {
      display_name: name,
    },
  );

  const [Point, created] = await connection.getOrCreateResource(Clone, {
    parent: SandboxGroupNgwKit,
  });
  if (created) {
    for (const properties of featuresSpecial) {
      const p = new Point({ properties, coordinates: [0, 0] });
      await p.save();
    }
  }
  if (!Point.item) {
    throw new Error('Not new Point layer item');
  }
  return Point.item?.resource.id;
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
    describe('filter', () => {
      it(`ilike`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
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
      it(`like`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
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
      it(`eq all any`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
        const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
          connector: connection.driver,
          resourceId,
          filters: [
            'all',
            [
              'any',
              ['test', 'eq', 'VAL_a'],
              ['test', 'eq', 'VAL_b'],
              ['test', 'eq', 'VAL_c'],
            ],
            ['number', 'eq', 111],
          ],
        });
        expect(items1.length).to.be.equal(3);
      });
      it(`eq all any any`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
        const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
          connector: connection.driver,
          resourceId,
          filters: [
            'all',
            ['any', ['test', 'eq', 'VAL_d'], ['test', 'eq', 'VAL_c']],
            ['any', ['number', 'eq', 211], ['number', 'eq', 111]],
          ],
        });
        // result
        // [
        //   { test: 'VAL_d', number: 211 },
        //   { test: 'VAL_c', number: 111 },
        // ];
        expect(items1.length).to.be.equal(2);
      });
      it(`ilike cyrillic`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
        const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
          connector: connection.driver,
          resourceId,
          filters: [['%test%', 'ilike', 'Да Выпей']],
        });
        expect(items1.length).to.be.equal(2);
      });
      it(`like cyrillic`, async () => {
        const connection = await getConnection();
        const resourceId = await newPointLayerId('NgwKit items');
        const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
          connector: connection.driver,
          resourceId,
          filters: [['%test%', 'like', 'Да Выпей']],
        });
        expect(items1.length).to.be.equal(1);
      });
      // NGW not support yet
      // it(`ne null`, async () => {
      //   const connection = await getConnection();
      //   const pointLayer = await newPointLayer('NgwKit items');
      //   const resourceId = pointLayer.item.resource.id;
      //   const items1 = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
      //     connector: connection.driver,
      //     resourceId,
      //     filters: [['test', 'ne', null]],
      //   });
      //   expect(items1.length).to.be.equal(2);
      // });
    });

    describe('filter', () => {
      it(`special1`, async () => {
        const connection = await getConnection();
        const resourceId = await newSpecialLayerId('NgwKit special items');
        const items1 = await fetchNgwLayerItems<
          Point,
          ISandboxPointLayerSpecial
        >({
          connector: connection.driver,
          resourceId,
          geom: false,
          fields: ['ATTR_G', 'ATTR_N', 'ATTR_Z', 'ATTR_S', 'ATTR_K', 'ATTR_P'],
          filters: [
            'all',
            ['ATTR_G', 'in', ['g1', 'g2', 'g3', 'g4', 'g5']],
            ['any', ['ATTR_N', 'eq', 'n, 78'], ['ATTR_N', 'eq', 'n, 73/2']],
          ],
        });
        expect(items1.map((x) => x.id)).to.eql([1, 2, 3, 4, 5]);
      });
      it(`special2`, async () => {
        const connection = await getConnection();
        const resourceId = await newSpecialLayerId('NgwKit special items');
        const items1 = await fetchNgwLayerItems<
          Point,
          ISandboxPointLayerSpecial
        >({
          connector: connection.driver,
          resourceId,
          geom: false,
          fields: ['ATTR_G', 'ATTR_N', 'ATTR_Z', 'ATTR_S', 'ATTR_K', 'ATTR_P'],
          filters: [
            'all',
            ['ATTR_G', 'in', ['g1', 'g2', 'g3', 'g4', 'g5']],
            ['any', ['ATTR_N', 'eq', 'n, 78'], ['ATTR_N', 'eq', 'n, 73/2']],
            ['ATTR_Z', 'eq', '444, 444'],
          ],
        });
        expect(items1.map((x) => x.id)).to.eql([2]);
      });
      it(`special3`, async () => {
        const connection = await getConnection();
        const resourceId = await newSpecialLayerId('NgwKit special items');
        const items1 = await fetchNgwLayerItems<
          Point,
          ISandboxPointLayerSpecial
        >({
          connector: connection.driver,
          resourceId,
          geom: false,
          fields: ['ATTR_G', 'ATTR_N', 'ATTR_Z', 'ATTR_S', 'ATTR_K', 'ATTR_P'],
          filters: [
            'all',
            ['ATTR_G', 'in', ['g1', 'g2', 'g3', 'g4', 'g5']],
            ['any', ['ATTR_N', 'eq', 'n, 78'], ['ATTR_N', 'eq', 'n, 73/2']],
            ['any', ['ATTR_Z', 'eq', '444, 444'], ['ATTR_Z', 'eq', '888, 888']],
          ],
        });
        expect(items1.map((x) => x.id)).to.eql([2, 3]);
      });
    });
  });
});
