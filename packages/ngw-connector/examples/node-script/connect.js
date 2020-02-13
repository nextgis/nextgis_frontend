const NgwConnector = require('@nextgis/ngw-connector');

async function connect() {
  const connector = new NgwConnector({ baseUrl: 'https://demo.nextgis.com' });
  try {
    console.log('start conection');
    const route = await connector.connect();
    console.log(route);
  } catch (er) {
    console.log(er);
  }
}

connect();
