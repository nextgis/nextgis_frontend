import { describe, expect, it } from 'vitest';

import { NgwKit } from '../../packages/ngw-kit/src/NgwKit';
import { QmsKit } from '../../packages/qms-kit/src/QmsKit';
import { appendNgwResources } from '../../packages/ngw-map/src/utils/appendNgwResources';
import { prepareWebMapOptions } from '../../packages/ngw-map/src/utils/prepareWebMapOptions';

import type NgwConnector from '@nextgis/ngw-connector';
import type { NgwLayerOptions } from '../../packages/ngw-kit/src/interfaces';
import type { NgwMapOptions } from '../../packages/ngw-map/src/interfaces';
import type { StarterKit } from '@nextgis/webmap';

const fakeConnector = {
  options: { baseUrl: 'https://example.ngw.test' },
} as NgwConnector;

describe('NGW resource declarations', () => {
  it('appends numeric resource IDs', () => {
    const resources: NgwLayerOptions[] = [];
    appendNgwResources(resources, 5, { fit: false });
    expect(resources).toEqual([{ fit: false, resource: 5 }]);
  });

  it('accepts numeric IDs supplied as strings', () => {
    const resources: NgwLayerOptions[] = [];
    appendNgwResources(resources, '15' as never);
    expect(resources).toEqual([{ resource: 15 }]);
  });

  it('supports tuple resources with a custom map-layer identifier', () => {
    const resources: NgwLayerOptions[] = [];
    appendNgwResources(resources, [25, 'roads'],
      { fit: false }, { simplification: 5 });
    expect(resources).toEqual([{
      fit: false, resource: 25, id: 'roads', simplification: 5,
    }]);
  });

  it('lets explicit resource options and overwrites override defaults', () => {
    const resources: NgwLayerOptions[] = [];
    appendNgwResources(resources, { resource: 27, simplification: 4 },
      { simplification: 1, fit: false }, { simplification: 7 });
    expect(resources).toEqual([{
      resource: 27, simplification: 7, fit: false,
    }]);
  });

  it('ignores undefined resources', () => {
    const resources: NgwLayerOptions[] = [];
    appendNgwResources(resources);
    expect(resources).toEqual([]);
  });
});

describe('NGW map bootstrap options', () => {
  it('configures defaults, bounds, connector and starter kits', () => {
    const options = prepareWebMapOptions({ connector: fakeConnector });
    expect(options.target).toBe('map');
    expect(options.bounds).toEqual([-179, -90, 180, 90]);
    expect(options.create).toBe(false);
    expect(options.starterKits).toHaveLength(2);
    expect(options.starterKits?.[0]).toBeInstanceOf(QmsKit);
    expect(options.starterKits?.[1]).toBeInstanceOf(NgwKit);
  });

  it('does not override a configured center', () => {
    const options = prepareWebMapOptions({
      connector: fakeConnector, center: [30, 50], zoom: 9,
    });
    expect(options.center).toEqual([30, 50]);
    expect(options.zoom).toBe(9);
    expect(options.bounds).toBeUndefined();
  });

  it('does not override explicit map bounds', () => {
    const bounds: [number, number, number, number] = [10, 20, 30, 40];
    const options = prepareWebMapOptions({ connector: fakeConnector, bounds });
    expect(options.bounds).toEqual(bounds);
  });

  it('preserves additional starter kits in their original order', () => {
    const custom: StarterKit = {};
    const options = prepareWebMapOptions({
      connector: fakeConnector, starterKits: [custom],
    });
    expect(options.starterKits).toHaveLength(3);
    expect(options.starterKits?.[0]).toBeInstanceOf(QmsKit);
    expect(options.starterKits?.[1]).toBe(custom);
    expect(options.starterKits?.[2]).toBeInstanceOf(NgwKit);
  });

  it('uses the supplied connector base URL rather than a stale option', () => {
    const options: NgwMapOptions = {
      baseUrl: 'https://old.ngw.test', connector: fakeConnector,
    };
    prepareWebMapOptions(options);
    expect(options.baseUrl).toBe('https://example.ngw.test');
  });
});
