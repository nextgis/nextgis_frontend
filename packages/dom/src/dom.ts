export function create<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string | null,
  container?: HTMLElement,
): HTMLElementTagNameMap[K] {
  const el = window.document.createElement(tagName);
  if (className !== undefined && className !== null) {
    el.className = className;
  }
  if (container) {
    container.appendChild(el);
  }
  return el;
}

export type ElementDef = HTMLElement | string;

/**
 * Helper function for determining the HTML element through the transmitted parameters
 *
 * @example
 * ```javascript
 * let el = getElement(HTMLElement || 'element-id');
 * el = getElement('#element-id .sub-class');
 * el = getElement('.element-class');
 * ```
 */
export function getElement(el: HTMLElement | string): HTMLElement | undefined {
  if (typeof el === 'string') {
    let el_ = document.getElementById(el);
    if (!el_) {
      try {
        el_ = document.querySelector(el);
      } catch {
        // ignore
      }
    }
    return el_ || undefined;
  }
  return el;
}

export function remove(element: ElementDef): void {
  const el = getElement(element);
  if (el) {
    const parent = el.parentElement;
    if (parent) {
      parent.removeChild(el);
    }
  }
}
