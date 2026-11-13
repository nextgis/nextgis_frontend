import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  QmsControlElement,
  type QmsControlItem,
} from '../../packages/qms-core/src/QmsControl';
import {
  QmsControlController,
} from '../../packages/qms-core/src/QmsControlController';
import { QmsClient } from '../../packages/qms-core/src/QmsClient';

import type { QmsCatalog } from '../../packages/qms-core/src/interfaces';

const catalog: QmsCatalog = {
  revision: 'test',
  groups: [
    {
      id: 'empty',
      name: 'Empty group',
      services: [],
    },
    {
      id: 'maps',
      name: 'Offline maps',
      services: [
        {
          type: 'tms',
          id: 'example',
          group: 'maps',
          name: 'Example tiles',
          url: 'https://example.invalid/{z}/{x}/{y}.png',
          yOriginTop: true,
        },
      ],
    },
  ],
};

const catalogItem: QmsControlItem = {
  source: 'catalog',
  service: catalog.groups[1].services[0],
};

const get = (element: HTMLElement, selector: string) =>
  element.querySelector<HTMLElement>(selector);

// The UI tests use local catalog fixtures and a stubbed API; they never reach qms.nextgis.com.
describe('QMS control element (offline)', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('starts closed and exposes an accessible open button', () => {
    const control = new QmsControlElement({ catalogData: catalog });
    const toggle = get(control.element, '.nextgis-qms-control__toggle');
    const panel = get(control.element, '.nextgis-qms-control__panel');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(panel?.hidden).toBe(true);
  });

  it('opens through the toggle and closes through the close button', () => {
    const control = new QmsControlElement({ catalogData: catalog });
    get(control.element, '.nextgis-qms-control__toggle')?.click();
    expect(get(control.element, '.nextgis-qms-control__panel')?.hidden).toBe(false);
    get(control.element, '.nextgis-qms-control__close')?.click();
    expect(get(control.element, '.nextgis-qms-control__panel')?.hidden).toBe(true);
  });

  it('uses configured language, class and title', () => {
    const control = new QmsControlElement({
      lang: 'ru',
      className: 'custom-qms',
      catalogData: catalog,
      messages: { title: 'Мои подложки' },
    });
    expect(control.element.lang).toBe('ru');
    expect(control.element.classList.contains('custom-qms')).toBe(true);
    expect(get(control.element, '.nextgis-qms-control__title')?.textContent).toBe('Мои подложки');
  });

  it('can disable both catalog and search', () => {
    const control = new QmsControlElement({ catalog: false, search: false });
    expect(get(control.element, '.nextgis-qms-control__catalog')).toBeNull();
    expect(get(control.element, '.nextgis-qms-control__input')).toBeNull();
  });

  it('renders nonempty catalog groups and their services', () => {
    const control = new QmsControlElement({ catalogData: catalog, search: false });
    expect(control.element.querySelectorAll('.nextgis-qms-control__group')).toHaveLength(1);
    expect(get(control.element, '.nextgis-qms-control__service')?.textContent).toBe('Example tiles');
  });

  it('calls onSelect with a catalog item', () => {
    const selected = vi.fn(async () => {});
    const control = new QmsControlElement({ catalogData: catalog, onSelect: selected });
    get(control.element, '.nextgis-qms-control__service')?.click();
    expect(selected).toHaveBeenCalledWith(catalogItem);
  });

  it('prevents selecting the same catalog service twice', () => {
    const selected = vi.fn(async () => {});
    const control = new QmsControlElement({ catalogData: catalog, onSelect: selected });
    const button = get(control.element, '.nextgis-qms-control__service');
    button?.click();
    button?.click();
    expect(selected).toHaveBeenCalledTimes(1);
  });

  it('closes after successful selection when closeOnSelect is enabled', async () => {
    const control = new QmsControlElement({
      catalogData: catalog,
      closeOnSelect: true,
      onSelect: async () => {},
    });
    control.open();
    get(control.element, '.nextgis-qms-control__service')?.click();
    await vi.waitFor(() => {
      expect(get(control.element, '.nextgis-qms-control__panel')?.hidden).toBe(true);
    });
  });

  it('opens and closes the about dialog', () => {
    const control = new QmsControlElement({ search: false, catalog: false });
    document.body.append(control.element);
    const dialog = control.element.querySelector<HTMLDialogElement>('dialog');
    get(control.element, '.nextgis-qms-control__about')?.click();
    expect(dialog?.open).toBe(true);
    get(control.element, '.nextgis-qms-control__about-close')?.click();
    expect(dialog?.open).toBe(false);
  });

  it('does not search for fewer than three characters', async () => {
    vi.useFakeTimers();
    const search = vi.spyOn(QmsClient.prototype, 'searchServices');
    const control = new QmsControlElement({ catalogData: catalog });
    const input = control.element.querySelector<HTMLInputElement>('input[type=search]')!;
    input.value = 'ab';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(400);
    expect(search).not.toHaveBeenCalled();
    expect(get(control.element, '.nextgis-qms-control__results')?.hidden).toBe(true);
  });

  it('combines TMS and WMS search results from the API', async () => {
    vi.useFakeTimers();
    const search = vi.spyOn(QmsClient.prototype, 'searchServices').mockImplementation(
      async (_query, options) => [{
        id: options.type === 'tms' ? 1 : 2,
        type: options.type,
        name: options.type === 'tms' ? 'Base tiles' : 'Overlay WMS',
        desc: '',
        icon: null,
      }],
    );
    const control = new QmsControlElement({ catalogData: catalog, limit: 4 });
    const input = control.element.querySelector<HTMLInputElement>('input[type=search]')!;
    input.value = 'street';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(350);
    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenCalledWith('street', expect.objectContaining({ limit: 4 }));
    expect(control.element.querySelectorAll('.nextgis-qms-control__results button')).toHaveLength(2);
    expect(get(control.element, '.nextgis-qms-control__catalog')?.hidden).toBe(true);
  });

  it('displays an empty-state message when search finds no services', async () => {
    vi.useFakeTimers();
    vi.spyOn(QmsClient.prototype, 'searchServices').mockResolvedValue([]);
    const control = new QmsControlElement({ catalog: false });
    const input = control.element.querySelector<HTMLInputElement>('input[type=search]')!;
    input.value = 'nothing';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(350);
    const text = get(control.element, '.nextgis-qms-control__results')?.textContent;
    expect(text).toBeTruthy();
    expect(text).not.toContain('Searching');
  });

  it('shows a search error instead of throwing when QMS fails', async () => {
    vi.useFakeTimers();
    vi.spyOn(QmsClient.prototype, 'searchServices').mockRejectedValue(new Error('offline'));
    const control = new QmsControlElement({ catalog: false, messages: { searchFailed: 'Offline error' } });
    const input = control.element.querySelector<HTMLInputElement>('input[type=search]')!;
    input.value = 'tiles';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(350);
    expect(get(control.element, '.nextgis-qms-control__results')?.textContent).toBe('Offline error');
  });
});

describe('QMS control controller (offline)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function makeAdapter() {
    return {
      addLayer: vi.fn((_map: object, _layer: { key: string }) => {}),
      removeLayer: vi.fn((_map: object, _layer: { key: string }) => {}),
      stopLayer: vi.fn((_layer: { key: string }) => {}),
      beforeAdd: vi.fn(async (_map: object) => {}),
      createLayer: vi.fn((layer: { name: string }) => ({ key: layer.name })),
    };
  }

  it('does not select layers before attaching to a map', async () => {
    const adapter = makeAdapter();
    const controller = new QmsControlController({ catalogData: catalog }, adapter);
    await controller.control.onSelect?.(catalogItem);
    expect(adapter.addLayer).not.toHaveBeenCalled();
  });

  it('creates and attaches a catalog layer', async () => {
    const adapter = makeAdapter();
    const map = {};
    const controller = new QmsControlController({ catalogData: catalog }, adapter);
    controller.setMap(map);
    await controller.control.onSelect?.(catalogItem);
    expect(adapter.createLayer).toHaveBeenCalled();
    expect(adapter.beforeAdd).toHaveBeenCalledWith(map);
    expect(adapter.addLayer).toHaveBeenCalledWith(map, { key: 'Example tiles' });
  });

  it('ignores repeated selection of the same catalog item', async () => {
    const adapter = makeAdapter();
    const controller = new QmsControlController({ catalogData: catalog }, adapter);
    controller.setMap({});
    await controller.control.onSelect?.(catalogItem);
    await controller.control.onSelect?.(catalogItem);
    expect(adapter.addLayer).toHaveBeenCalledTimes(1);
  });

  it('replaces the active layer when selecting a different service', async () => {
    const adapter = makeAdapter();
    const map = {};
    const controller = new QmsControlController({ catalogData: catalog }, adapter);
    controller.setMap(map);
    await controller.control.onSelect?.(catalogItem);
    const second: QmsControlItem = {
      source: 'catalog',
      service: {
        ...catalog.groups[1].services[0],
        id: 'another',
        name: 'Other tiles',
      },
    };
    await controller.control.onSelect?.(second);
    expect(adapter.stopLayer).toHaveBeenCalledWith({ key: 'Example tiles' });
    expect(adapter.removeLayer).toHaveBeenCalledWith(map, { key: 'Example tiles' });
    expect(adapter.addLayer).toHaveBeenCalledWith(map, { key: 'Other tiles' });
  });

  it('supports an initial layer supplied by a factory', async () => {
    const adapter = makeAdapter();
    const initial = vi.fn(() => ({ key: 'initial' }));
    const controller = new QmsControlController({ catalogData: catalog, initialLayer: initial }, adapter);
    controller.setMap({});
    await vi.waitFor(() => expect(initial).toHaveBeenCalledTimes(1));
    controller.setMap({});
    expect(initial).toHaveBeenCalledTimes(1);
  });

  it('supports an application-provided selection callback', async () => {
    const adapter = makeAdapter();
    const select = vi.fn(async () => ({ key: 'external' }));
    const controller = new QmsControlController({ catalogData: catalog, onSelect: select }, adapter);
    controller.setMap({});
    await controller.control.onSelect?.(catalogItem);
    expect(select).toHaveBeenCalledWith(catalogItem);
    expect(adapter.createLayer).not.toHaveBeenCalled();
    expect(adapter.addLayer).not.toHaveBeenCalled();
  });
});
