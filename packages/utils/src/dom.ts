/**
 * @module utils
 */
export function create(
  tagName: string,
  className?: string,
  container?: HTMLElement
): HTMLElement {
  const el = window.document.createElement(tagName);
  if (className !== undefined) el.className = className;
  if (container) container.appendChild(el);
  return el;
}
