import NgwConnector from '@nextgis/ngw-connector';

const loginStatusElement = document.getElementById(
  'login-status',
) as HTMLDivElement;
const resultElement = document.getElementById('results') as HTMLDivElement;
const appendResponse = (toElement: HTMLElement, resp: unknown) => {
  toElement.innerHTML = '';
  toElement.appendChild(document.createElement('pre')).innerHTML =
    JSON.stringify(resp, null, 2);
};
const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
  auth: {
    login: 'ngf_test',
    password: 'ngf_test',
  },
});
connector.connect();
connector
  .route('resource.item', 7678)
  .get()
  .then((data) => {
    appendResponse(resultElement, data);
  })
  .catch((error) => {
    appendResponse(resultElement, error);
  });
connector.emitter.on('login', (data) => {
  appendResponse(loginStatusElement, data);
});
connector.emitter.on('login:error', (data) => {
  appendResponse(loginStatusElement, data);
});
