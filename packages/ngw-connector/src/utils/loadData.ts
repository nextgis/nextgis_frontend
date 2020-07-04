// readyState
// Holds the status of the XMLHttpRequest.
// 0: request not initialized
// 1: server connection established
// 2: request received
// 3: processing request
// 4: request finished and response is ready

// status
// 200: "OK"
// 201 "Created"	The request has been fulfilled, and a new resource is created
// 403: "Forbidden"
// 404: "Page not found"
// 500: "Internal Server Error"
// For a complete list go to the Http Messages Reference

import { RequestOptions, RequestMethods } from '../interfaces';

type LoadData = (
  url: string,
  callback: (...args: any[]) => any,
  options: RequestOptions<RequestMethods> | undefined,
  error: (reason?: any) => void,
  onCancel: (cancelHandler: () => void) => void
) => void;

let loadData: LoadData;

const isBrowser = new Function(
  'try {return this===window;}catch(e){ return false;}'
)();
if (isBrowser) {
  loadData = require('./loadDataBrowser').default;
} else {
  loadData = require('./loadDataNode').default;
}
export { loadData };
