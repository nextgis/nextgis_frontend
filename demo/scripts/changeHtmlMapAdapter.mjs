export default function changeHtmlMapAdapter(html, adapter, adapters) {
  if (typeof adapter !== 'string') {
    const reName = new RegExp(adapters.map((x) => x.name).join('|'), 'g');
    const reVersion = new RegExp(adapters.map((x) => x.version).join('|'), 'g');
    html = html.replace(reName, adapter.name);
    html = html.replace(reVersion, adapter.version);
  } else {
    const reName = new RegExp(adapters.map((x) => x).join('|'), 'g');
    html = html.replace(reName, adapter);
  }
  return html;
}
