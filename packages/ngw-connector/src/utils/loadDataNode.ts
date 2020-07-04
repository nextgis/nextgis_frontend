import {
  RequestOptions as NgwRequestOptions,
  RequestMethods,
} from '../interfaces';

// the 'eval' is used to exclude packages from the webpack bundle for browser
const url = eval('require("url")');
const http = eval('require("http")');
const https = eval('require("https")');

const adapterFor = (inputUrl: string) => {
  const adapters: Record<string, any> = {
    'http:': http,
    'https:': https,
  };
  const protocol = url.parse(inputUrl).protocol || 'https:';
  return adapters[protocol];
};

export default function loadDataNode(
  url: string,
  callback: (...args: any[]) => any,
  options: NgwRequestOptions<RequestMethods> = {},
  error: (reason?: any) => void,
  onCancel: (cancelHandler: () => void) => void
): Promise<unknown> {
  const request = new Promise((resolve, reject) => {
    const adapter = adapterFor(url);
    if (adapter) {
      const requestOpt = {
        headers: options.headers || {},
        method: options.method,
      };
      const body =
        typeof options.data === 'string'
          ? options.data
          : JSON.stringify(options.data);
      const req = adapter.request(url, requestOpt, (resp: any) => {
        let data = '';
        resp.on('data', (chunk: any) => {
          data += chunk;
        });
        resp.on('end', () => {
          if (data) {
            let json: Record<string, any> | undefined;
            try {
              json = JSON.parse(data);
              if (json && json.status_code && json.status_code) {
                throw new Error(json.message);
              }
            } catch (er) {
              reject(er);
              // throw new Error(er);
            }
            if (json !== undefined) {
              resolve(json);
            }
          }
          reject('no data');
        });
      });
      req.on('error', (err: any) => {
        reject(err);
      });
      if (body) {
        req.write(body);
      }
      onCancel(() => {
        req.abort();
      });
      req.end();
    } else {
      throw new Error(`Given URL '${url}' is not correct`);
    }
  });
  return request
    .then((data) => {
      if (callback) {
        callback(data);
      }
      return data;
    })
    .catch((er) => {
      if (error) {
        error(er);
      } else {
        throw new Error(er);
      }
    });
}
