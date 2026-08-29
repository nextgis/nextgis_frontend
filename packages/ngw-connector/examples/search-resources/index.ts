import NgwConnector from '@nextgis/ngw-connector';

const login = document.getElementById('login') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const ngwUrl = document.getElementById('ngw-url') as HTMLInputElement;
const classSelect = document.getElementById(
  'select-class',
) as HTMLSelectElement;
const fullSerialization = document.getElementById(
  'full-serialization',
) as HTMLInputElement;
const submit = document.getElementById('submit') as HTMLButtonElement;
const resultWrap = document.getElementById('result-wrap') as HTMLDivElement;
const resultElement = document.getElementById('results') as HTMLDivElement;
const loginStatusElement = document.getElementById(
  'login-status',
) as HTMLDivElement;
// helper function for updating DOM from json
const appendResponse = (toElement: HTMLElement, resp: unknown) => {
  toElement.innerHTML = '';
  toElement.appendChild(document.createElement('pre')).innerHTML =
    JSON.stringify(resp, null, 2);
};
const connector = new NgwConnector({
  baseUrl: ngwUrl.value,
});

submit.onclick = () => {
  submit.disabled = true;
  resultWrap.style.display = 'block';
  loginStatusElement.innerHTML = 'Loading...';
  resultElement.innerHTML = '';
  // make authorization and get user info first
  connector
    .getUserInfo({ login: login.value, password: password.value })
    .then((userInfo) => {
      appendResponse(loginStatusElement, userInfo);
      resultElement.innerHTML = 'Loading...';
      connector
        .get('resource.search', null, {
          cls: classSelect.value,
          owner_user__id: userInfo.id,
          // optional parameter to to control the number of parameters in the response
          // may be full and resource, resource is default value
          serialization: fullSerialization.checked ? 'full' : 'resource',
        })
        .then((data) => {
          // update the DOM from the search result
          appendResponse(resultElement, data);
          // make button activa again
          submit.disabled = false;
        });
    })
    .catch((er) => {
      appendResponse(loginStatusElement, er);
    });
};
