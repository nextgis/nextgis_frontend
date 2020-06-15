import { expect } from 'chai';
import { Connection } from '../../packages/ngw-orm/src';

function getConnection() {
  return Connection.connect({
    baseUrl: 'http://dev.nextgis.com/sandbox/',
  });
}

describe('NgwOrm', () => {
  describe('Connection', () => {
    it(`connect`, async () => {
      const connection = await getConnection();
      expect(connection.isConnected).to.be.true;
    });
  });
});
