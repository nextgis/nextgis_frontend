import CancelablePromise from '@nextgis/cancelable-promise';

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

export function apiRequest<
  K extends keyof RequestItemsParamsMap,
  P extends RequestItemKeys = RequestItemKeys,
>(opt: ApiRequestOptions<K>): CancelablePromise<P[K]> {
  const params = opt.params;
  return new CancelablePromise((resolve, reject) => {
    return opt.connector
      .connect()
      .then((apiItems) => {
        let apiItem = apiItems && apiItems[opt.name];
        if (apiItem) {
          apiItem = [...apiItem];
          let url = apiItem.shift();
          if (apiItem.length) {
            const replaceParams: {
              [num: number]: string;
            } = {};
            for (let fry = 0; fry < apiItem.length; fry++) {
              const arg = apiItem[fry];
              replaceParams[fry] = '{' + arg + '}';
              if (params[arg] === undefined) {
                throw new Error(
                  '`' + arg + '`' + ' url api argument is not specified',
                );
              }
            }
            if (url) {
              url = template(url, replaceParams);
            }
          }
          // Transfer part of the parameters from `params` to the URL string
          if (params) {
            const paramArray = [];
            const paramList = params.paramList;
            if (Array.isArray(paramList)) {
              delete params.paramList;
              paramList.forEach((x) => {
                paramArray.push(`${x[0]}=${x[1]}`);
              });
            }
            for (const p in params) {
              if (apiItem.indexOf(p) === -1) {
                paramArray.push(`${p}=${params[p]}`);
              }
            }
            if (paramArray.length) {
              url = url + '?' + paramArray.join('&');
            }
          }
          if (url) {
            resolve(opt.connector.makeQuery(url, params, opt.requestOptions));
          } else {
            reject(new Error('request url is not set'));
          }
        } else {
          resolve(undefined);
        }
      })
      .catch((er) => {
        reject(er);
      });
  });
}
