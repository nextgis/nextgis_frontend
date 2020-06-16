import { expect } from 'chai';
import { Connection, BaseResource } from '../../packages/ngw-orm/src';
import { SandboxGroup } from '../helpers/ngw-orm/SandboxGroup';

let CONNECTION: Connection;
const TESTS_GROUP_ID = 446;

function getConnection() {
  if (CONNECTION) {
    return CONNECTION;
  }
  return Connection.connect({
    // baseUrl: 'http://dev.nextgis.com/sandbox/',
    baseUrl: 'http://geonote.nextgis.com',
    auth: {
      login: 'nextgis',
      password: 'nextgis',
    },
  }).then((connection) => {
    CONNECTION = connection;
    return connection;
  });
}

describe('NgwOrm', () => {
  describe('Connection', () => {
    it(`connect`, async () => {
      const connection = await getConnection();
      expect(connection.isConnected).to.be.true;
    });
  });

  describe('ResourceGroup', () => {
    it(`getOrCreate`, async () => {
      const connection = await getConnection();
      let resourceGroup: typeof BaseResource | undefined;
      try {
        const synced = await connection.getOrCreateResource(SandboxGroup, {
          parent: TESTS_GROUP_ID,
        });
        if (synced) {
          resourceGroup = synced;
        }
      } catch (er) {
        console.log(er);
      }

      expect(resourceGroup.connection && resourceGroup.connection.isConnected)
        .to.be.true;
      const id = resourceGroup.item.resource.id;
      await connection.deleteResource(resourceGroup);
      expect(resourceGroup.item).to.be.undefined;

      const afterDelete = await connection.driver.getResource(id);
      expect(afterDelete).to.be.undefined;
    });
  });
});
