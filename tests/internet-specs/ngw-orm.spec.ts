import { expect } from 'chai';
import { Connection } from '../../packages/ngw-orm/src';
import { SandboxGroup } from '../helpers/ngw-orm/SandboxGroup';
import { SandboxPointLayer } from '../helpers/ngw-orm/SandboxPointLayer';
import { getMetadataArgsStorage } from '../../packages/ngw-orm/src';

let CONNECTION: Connection;
const TESTS_GROUP_ID = 0;
// const TESTS_GROUP_ID = 3;

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

let ID = 0;

async function newPointLayer(name?: string) {
  const connection = await getConnection();
  const Clone = SandboxPointLayer.clone({
    display_name: name || 'Clone of Point layer #' + ID++,
  }) as typeof SandboxPointLayer;

  await connection.getOrCreateResource(Clone, {
    parent: SandboxGroup,
  });
  return Clone;
}

describe('NgwOrm', function () {
  this.timeout(15000);

  before(async () => {
    const connection = await getConnection();
    return await connection.getOrCreateResource(SandboxGroup, {
      parent: TESTS_GROUP_ID,
    });
  });

  after(async () => {
    const connection = await getConnection();
    return await connection.deleteResource(SandboxGroup);
  });

  describe('Connection', () => {
    it(`connect`, async () => {
      const connection = await getConnection();
      expect(connection.isConnected).to.be.true;
    });
    it(`#getOrCreate`, async () => {
      const connection = await getConnection();
      const Clone = SandboxGroup.clone({
        display_name: 'Resource Group Clone',
      });
      const [Res1, created1] = await connection.getOrCreateResource(Clone, {
        parent: SandboxGroup,
      });
      expect(Res1.connection && Res1.connection.isConnected).to.be.true;
      expect(created1).to.be.true;
      const [, created2] = await connection.getOrCreateResource(Clone, {
        parent: SandboxGroup,
      });
      expect(created2).to.be.false;
      Clone.item = undefined;
      const [Res3, created3] = await connection.getOrCreateResource(Clone, {
        parent: SandboxGroup,
      });
      expect(created3).to.be.false;
    });
    it(`#deleteResource`, async () => {
      const connection = await getConnection();
      const Clone = SandboxGroup.clone({
        display_name: 'Resource Group Clone',
      });
      const [Res, created] = await connection.getOrCreateResource(Clone, {
        parent: SandboxGroup,
      });
      let notExist = false;
      if (Res) {
        expect(Res.item).to.be.exist;
        if (Res.item) {
          const id = Res.item.resource.id;
          await connection.deleteResource(Res);

          expect(Res.item).to.be.undefined;
          const afterDelete = await connection.getResourceItem(id);

          notExist = afterDelete === undefined ? true : false;
        }
      }
      expect(notExist).to.be.true;
    });
    it('#receiveResource', async () => {
      const connection = await getConnection();
      const [Point, created] = await connection.getOrCreateResource(
        SandboxPointLayer.clone({
          display_name: 'Clone for test receiveResource method',
        }),
        {
          parent: SandboxGroup,
        },
      );
      expect(Point.item).to.be.exist;
      if (Point.item) {
        const ReceivedPoint = (await connection.receiveResource<typeof Point>(
          Point.item.resource.id,
        )) as typeof SandboxPointLayer;
        expect(ReceivedPoint.item).to.be.exist;
        if (ReceivedPoint.item) {
          expect(ReceivedPoint.item.resource.id).to.be.eq(
            Point.item.resource.id,
          );
          const p = new ReceivedPoint();
          p.test = 'test';
          p.geom = { type: 'Point', coordinates: [104, 52] };
          await p.save();
          expect(p.id).to.eq(1);
          const ngwFeature = await connection.driver.get(
            'feature_layer.feature.item',
            null,
            {
              id: ReceivedPoint.item.resource.id,
              fid: p.id,
            },
          );
          expect(ngwFeature.fields);
          if (ngwFeature.fields) {
            expect(ngwFeature.fields.test).to.eq(p.test);
          }
        }
      }
    });
  });

  describe('VectorLayer', () => {
    it(`point`, async () => {
      const connection = await getConnection();

      const [point, created] = await connection.getOrCreateResource(
        SandboxPointLayer,
        {
          parent: SandboxGroup,
        },
      );
      expect(point).to.be.exist;
    });
    it(`.clone`, async () => {
      const connection = await getConnection();

      const [Point, created] = await connection.getOrCreateResource(
        SandboxPointLayer.clone({ display_name: 'Clone of Point layer' }),
        {
          parent: SandboxGroup,
        },
      );
      expect(Point).to.be.exist;
      if (Point) {
        expect(Point.item).to.be.exist;
        if (Point.item) {
          expect(Point.item.feature_layer).to.be.exist;
          if (Point.item.feature_layer) {
            const columns = getMetadataArgsStorage().filterColumns(Point);
            expect(Point.item.feature_layer.fields.length).to.be.eq(
              columns.length,
            );
          }
        }
      }
    });
    it(`create feature`, async () => {
      const connection = await getConnection();

      const Point = await newPointLayer(
        'Clone of Point layer for .create feature test',
      );
      const p = new Point();
      p.test = 'test';
      p.coordinates = [104, 52];

      await p.save();

      expect(p.id).to.eq(1);
      expect(Point.item).to.be.exist;
      if (Point.item) {
        const ngwFeature = await connection.driver.get(
          'feature_layer.feature.item',
          null,
          {
            id: Point.item.resource.id,
            fid: p.id,
          },
        );
        expect(ngwFeature.id).to.eq(1);
      }
    });
    it(`.save`, async () => {
      const Point = await newPointLayer('Clone of Point layer for .save test');

      const entities = Array.from(Array(5)).map((x, i) => {
        const p = new Point();
        p.test = String(i + 1);
        p.coordinates = [104, 52];
        return p;
      });
      const savedEntities = await Point.save(entities);
      const ok = savedEntities.every((x) => {
        return String(x.id) === x.test;
      });
      expect(ok).to.be.true;
    });

    it(`.findOne`, async () => {
      const Point = await newPointLayer(
        'Clone of Point layer for .findOne test',
      );

      const entities = Array.from(Array(5)).map((x, i) => {
        const p = new Point();
        p.number = i + 1;
        p.coordinates = [104, 52];
        return p;
      });
      await Point.save(entities);
      const findById = await Point.findOne(1);
      expect(findById).to.be.exist;
      if (findById) {
        expect(findById.id).to.be.eq(1);
      }
    });
  });
});
