import NgwConnector from '@nextgis/ngw-connector';

const output = document.createElement('div');
document.body.appendChild(output);

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

connector.connect().then(() => {
  const abortController = new AbortController(); // Create a new AbortController instance

  connector
    .route('resource.item', { id: 4005 })
    .get({ signal: abortController.signal }) // Pass abort signal to the request
    .then((response) => {
      output.innerHTML = `<p>Request successful:</p><pre>${JSON.stringify(response, null, 2)}</pre>`;
    })
    .catch((e) => {
      if (e.name === 'AbortError') {
        output.innerHTML = '<p>Request was aborted</p>';
      } else {
        output.innerHTML = `<p>Request failed:</p><pre>${e}</pre>`;
      }
    });

  // Simulate request abort after 10 ms
  setTimeout(() => {
    abortController.abort();
  }, 10);
});
