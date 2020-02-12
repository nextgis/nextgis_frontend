import { RequestOptions, RequestMethods } from '../interfaces';

const adapterFor = (inputUrl: string) => {
  const url = require('url');
  const adapters: Record<string, any> = {
    'http:': require('http'),
    'https:': require('https')
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
  return new Promise((resolve, reject) => {
    adapterFor(url)
      .get(
        url,
        // {
        //   url
        //   // proxy: 'http://127.0.0.1:3128'
        // },
        (resp: any) => {
          let data = '';
          resp.on('data', (chunk: any) => {
            data += chunk;
          });
          resp.on('end', () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on('error', (err: any) => {
        reject(err);
      });
  });
}
