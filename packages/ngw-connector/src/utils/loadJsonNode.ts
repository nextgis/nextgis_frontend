import { RequestOptions, RequestMethods } from '../interfaces';

// the 'eval' is used to exclude packages from the webpack bundle for browser
const url = eval('require("url")');
const http = eval('require("http")');
const https = eval('require("https")');

const adapterFor = (inputUrl: string) => {
  const adapters: Record<string, any> = {
    'http:': http,
    'https:': https,
  };
  return adapters[url.parse(inputUrl).protocol];
};

export default function loadJSONNode(
  url: string,
  callback: (...args: any[]) => any,
  options: RequestOptions<RequestMethods> | undefined,
  error: (reason?: any) => void,
  onCancel: (() => void)[]
) {
  const request = new Promise((resolve, reject) => {
    adapterFor(url)
      .get(url, (resp: any) => {
        let data = '';
        resp.on('data', (chunk: any) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err: any) => {
        reject(err);
      });
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
      }
      throw new Error(er);
    });
}
