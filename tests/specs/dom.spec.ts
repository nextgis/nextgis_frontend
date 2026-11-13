import { afterEach, describe, expect, it } from 'vitest';

import { create, getElement, remove } from '../../packages/dom/src/dom';
import { loadScript } from '../../packages/dom/src/loadScript';

const addedScripts: HTMLScriptElement[] = [];

describe('DOM helpers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    addedScripts.splice(0).forEach((script) => script.remove());
  });

  it('creates an element with a class and appends it to a parent', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    const child = create('span', 'map-label', parent);
    expect(child.tagName).toBe('SPAN');
    expect(child.className).toBe('map-label');
    expect(parent.firstElementChild).toBe(child);
  });

  it('creates elements without a class or parent', () => {
    const child = create('button');
    expect(child.className).toBe('');
    expect(child.parentElement).toBeNull();
  });

  it('finds elements by ID, selector and direct element reference', () => {
    document.body.innerHTML = '<div id="map"><span class="layer"></span></div>';
    const map = document.getElementById('map')!;
    expect(getElement('map')).toBe(map);
    expect(getElement('#map .layer')).toBe(map.firstElementChild);
    expect(getElement(map)).toBe(map);
  });

  it('returns undefined for missing elements and invalid selectors', () => {
    expect(getElement('missing-id')).toBeUndefined();
    expect(getElement('[')).toBeUndefined();
  });

  it('removes elements using an ID, a selector or a reference', () => {
    document.body.innerHTML = '<div id="first"></div><div class="second"></div>';
    remove('first');
    remove('.second');
    expect(document.body.children).toHaveLength(0);
    const detached = document.createElement('span');
    remove(detached);
    remove('missing');
  });
});

describe('loadScript', () => {
  afterEach(() => {
    addedScripts.splice(0).forEach((script) => script.remove());
  });

  it('sets script attributes and resolves when load is emitted', async () => {
    const loading = loadScript('data:text/javascript,', {
      id: 'ngw-test-script',
      crossOrigin: 'anonymous',
      async: true,
      defer: true,
      data: { test_value: 12, 'data-feature': true },
    });
    const script = document.getElementById('ngw-test-script') as HTMLScriptElement;
    addedScripts.push(script);

    expect(script.src).toBe('data:text/javascript,');
    expect(script.type).toBe('text/javascript');
    expect(script.getAttribute('crossorigin')).toBe('anonymous');
    expect(script.async).toBe(true);
    expect(script.defer).toBe(true);
    expect(script.getAttribute('data-test-value')).toBe('12');
    expect(script.getAttribute('data-feature')).toBe('true');

    script.dispatchEvent(new Event('load'));
    await expect(loading).resolves.toBeInstanceOf(Event);
  });

  it('rejects when a script fails to load', async () => {
    const loading = loadScript('data:text/javascript,');
    const script = document.head.lastElementChild as HTMLScriptElement;
    addedScripts.push(script);
    script.dispatchEvent(new Event('error'));
    await expect(loading).rejects.toBeInstanceOf(Event);
  });
});
