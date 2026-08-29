import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';

let abortController: AbortController | null = null;
const abortBtn = document.getElementById('abort-btn') as HTMLButtonElement;
const globalAbortBtn = document.getElementById(
  'global-abort-btn',
) as HTMLButtonElement;
const resultBlock = document.getElementById('result-block') as HTMLDivElement;

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

const showResourceMetaItems = async (resourceId: number) => {
  abortController = new AbortController();
  resultBlock.innerHTML = `<p>Loading...</p>`;
  try {
    const features = await fetchNgwLayerFeatures({
      connector,
      resourceId,
      limit: Infinity,
      signal: abortController.signal,
    });
    resultBlock.innerHTML = `<p>Loaded ${features.length} features</p>`;
  } catch (er) {
    if (er instanceof Error && er.name === 'CancelError') {
      handleCancelError();
    }
  }
};

const abort = () => {
  if (abortController) {
    abortController.abort();
  }
  abortController = null;
};

const globalAbort = () => {
  connector.abort();
};

const handleCancelError = () => {
  const activeRequests = connector.getActiveApiRequests();
  resultBlock.innerHTML = `<p>Request is canceled (check at the Network tab in the console).</p>
        <p>There are ${Object.keys(activeRequests).length} active requests.</p>`;
};

const makeRequestAndAbort = () => {
  showResourceMetaItems(3988);
  setTimeout(abort, 200);
};

const makeRequestAndGlobalAbort = () => {
  showResourceMetaItems(3988);
  setTimeout(globalAbort, 200);
};

abortBtn.addEventListener('click', makeRequestAndAbort);
globalAbortBtn.addEventListener('click', makeRequestAndGlobalAbort);
