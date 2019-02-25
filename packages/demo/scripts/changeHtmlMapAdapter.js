function changeHtmlMapAdapter(html, adapter, adapters) {
  const reName = new RegExp(adapters.map((x) => x.name).join('|'), 'g');
  const reVersion = new RegExp(adapters.map((x) => x.version).join('|'), 'g');
  html = html.replace(reName, adapter.name);
  html = html.replace(reVersion, adapter.version);

  return html;
}

module.exports = changeHtmlMapAdapter;

