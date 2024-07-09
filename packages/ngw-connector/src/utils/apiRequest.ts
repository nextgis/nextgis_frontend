import { template } from './template';
import type { NgwConnector } from '../NgwConnector';
import type {
  RequestItemKeys,
  RequestItemsParams,
  RequestOptions,
} from '../interfaces';
import type { RequestItemsParamsMap } from '../types/RequestItemsParamsMap';

interface ApiRequestOptions<K extends keyof RequestItemsParamsMap> {
  name: string;
  connector: NgwConnector;
  params: RequestItemsParams<K>;
  requestOptions: RequestOptions;
}

export async function apiRequest<
  K extends keyof RequestItemsParamsMap,
  P extends RequestItemKeys = RequestItemKeys,
>(opt: ApiRequestOptions<K>): Promise<P[K]> {
  const { params, name, connector, requestOptions } = opt;

  const apiItems = await connector.connect();
  let apiItem = apiItems && apiItems[name];

  if (apiItem) {
    apiItem = [...apiItem];
    let url = apiItem.shift(); // Extract the base URL

    if (apiItem.length) {
      const replaceParams: { [num: number]: string } = {};

      // Prepare URL template parameters described in apiItem
      for (let fry = 0; fry < apiItem.length; fry++) {
        const arg = apiItem[fry];
        replaceParams[fry] = `{${arg}}`;

        // Check if each required by apiItem parameter is provided in params
        if (params[arg] === undefined) {
          throw new Error(`\`${arg}\` URL API argument is not specified`);
        }
      }

      // Replace URL template parameters with actual values
      if (url) {
        url = template(url, replaceParams);
      }
    }

    if (params) {
      const paramArray: string[] = [];
      const paramList = params.paramList;

      // Handle paramList if present: transform it into query string format
      if (Array.isArray(paramList)) {
        delete params.paramList;
        paramList.forEach(([key, value]) => {
          paramArray.push(`${key}=${value}`);
        });
      }

      // Append other parameters to the URL, excluding those already used in the template
      for (const p in params) {
        if (apiItem.indexOf(p) === -1) {
          paramArray.push(`${p}=${params[p]}`);
        }
      }

      // If there are any query parameters, append them to the URL
      if (paramArray.length) {
        url = `${url}?${paramArray.join('&')}`;
      }
    }

    if (url) {
      return connector.makeQuery(url, params, {
        cacheName: name,
        ...requestOptions,
      });
    } else {
      throw new Error('Request URL is not set');
    }
  } else {
    // Return undefined if API item is not found
    return undefined as P[K];
  }
}
