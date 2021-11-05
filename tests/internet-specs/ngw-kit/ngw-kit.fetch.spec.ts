// import { Point, Position } from 'geojson';

// import { expect } from 'chai';
// import { Connection } from '../../../packages/ngw-orm/src';
// import { SandboxGroup } from '../../helpers/ngw-orm/SandboxGroup';
// import {
//   SandboxPointLayer,
//   ISandboxPointLayer,
// } from '../../helpers/ngw-orm/SandboxPointLayer';
// import { fetchNgwLayerItems } from '@nextgis/ngw-kit';

// const TESTS_GROUP_ID = 0;
// let CONNECTION: Connection;

// function getConnection(): Promise<Connection> {
//   if (CONNECTION) {
//     return Promise.resolve(CONNECTION);
//   }
//   return Connection.connect({
//     baseUrl: 'https://sandbox.nextgis.com',
//     auth: {
//       login: 'administrator',
//       password: 'demodemo',
//     },
//   }).then((connection) => {
//     CONNECTION = connection;
//     return connection;
//   });
// }

// const features: [ISandboxPointLayer, Position][] = [
//   [{ number: 12, test: 'foo' }, [1, 1]],
//   [{ number: 11, test: 'Foo' }, [1, 1]],
// ];

// async function newPointLayer(name: string) {
//   const connection = await getConnection();
//   const Clone = SandboxPointLayer.clone({
//     display_name: name,
//   });

//   const [Point, created] = await connection.getOrCreateResource(
//     SandboxPointLayer,
//     {
//       parent: SandboxGroup,
//     },
//   );
//   if (created) {
//     for (const [properties, coordinates] of features) {
//       const p = new Point({ properties, coordinates });
//       await p.save();
//     }
//   }
//   return Clone;
// }

// describe('NgwKit', function () {
//   this.timeout(15000);

//   before(async () => {
//     const connection = await getConnection();
//     await connection.getOrCreateResource(SandboxGroup, {
//       parent: TESTS_GROUP_ID,
//     });
//   });

//   after(async () => {
//     const connection = await getConnection();
//     await connection.deleteResource(SandboxGroup);
//   });

//   describe('#fetchNgwLayerItems', () => {
//     it(`ilike filter`, async () => {
//       const connection = await getConnection();
//       const pointLayer = await newPointLayer('NgwKit items');
//       const resourceId = pointLayer.item.resource.id;
//       const items = await fetchNgwLayerItems<Point, ISandboxPointLayer>({
//         connector: connection.driver,
//         resourceId,
//         filters: [['%test%', 'ilike', 'Fo']],
//       });
//       expect(items.length).to.be.equal(2);
//     });
//   });
// });
