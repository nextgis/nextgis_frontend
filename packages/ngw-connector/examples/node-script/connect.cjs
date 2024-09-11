// @ts-check

// const NgwConnector = require('@nextgis/ngw-connector');
const NgwConnector = require('../../lib/ngw-connector.cjs');

async function connect() {
  const connector = new NgwConnector({ baseUrl: 'https://demo.nextgis.com' });
  try {
    console.log('start connection');
    const route = await connector.connect();
    console.log(route);
    const user = await connector.route('auth.current_user').get();
    console.log(user);
  } catch (er) {
    console.log(er);
  }
}

connect();
