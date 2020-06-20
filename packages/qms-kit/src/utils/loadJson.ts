import { fixUrlStr } from '@nextgis/utils';

export function loadJson<T = any>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        if (xmlHttp.responseText) {
          try {
            resolve(JSON.parse(xmlHttp.responseText));
          } catch (er) {
            reject(er);
          }
        }
      }
    };
    xmlHttp.open('GET', fixUrlStr(url), true); // true for asynchronous
    xmlHttp.send();
  });
}
