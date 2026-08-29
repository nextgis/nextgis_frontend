import NgwConnector from '@nextgis/ngw-connector';

const logElement = document.getElementById('log') as HTMLDivElement;

const appendResponse = function (
  toElement: HTMLElement,
  url: string,
  resp: unknown,
) {
  const pre = toElement.appendChild(document.createElement('pre'));
  pre.innerHTML = `${url}<br>${JSON.stringify(resp, null, 2)}<br>`;
};
const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
  auth: {
    login: 'ngf_test',
    password: 'ngf_test',
  },
  requestTransform: (url, options) => {
    appendResponse(logElement, url, options);
    return [url, options];
  },
});
connector.getResource(4226);
connector.getResource(4224);
