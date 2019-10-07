/**
 * @module leaflet-map-adapter
 */
export function callAjax(url: string, callback: (resp: any) => any, headers: any) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = 'blob';
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      callback(xmlhttp.response);
    }
  };
  xmlhttp.open('GET', url, true);
  for (const h in headers) {
    xmlhttp.setRequestHeader(h, headers[h]);
  }
  xmlhttp.send();
  return xmlhttp;
}
