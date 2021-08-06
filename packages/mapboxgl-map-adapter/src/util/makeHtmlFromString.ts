export function makeHtmlFromString(str: string): HTMLElement {
  const html = document.createElement('div');
  html.innerHTML = str;
  return html;
}
