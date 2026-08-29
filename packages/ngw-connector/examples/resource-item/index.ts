import NgwConnector from '@nextgis/ngw-connector';

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

connector
  .route('resource.item', { id: 5248 })
  .get()
  .then(function (data) {
    console.log(data);
    document.body.appendChild(document.createElement('pre')).innerHTML =
      JSON.stringify(data, null, 2);
  });
