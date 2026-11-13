import { EventEmitter } from 'events';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { arrayChunk } from '../../packages/utils/src/array/arrayChunk';
import { arrayCompare, arrayCompareStrict } from '../../packages/utils/src/array/arrayCompare';
import { arrayUnique } from '../../packages/utils/src/array/arrayUnique';
import { debounce } from '../../packages/utils/src/debounce';
import { Events } from '../../packages/utils/src/events';
import { flatten } from '../../packages/utils/src/flatten';
import { getBoundsCoordinates, getBoundsFeature, getBoundsPolygon } from '../../packages/utils/src/geom/getBoundsPolygon';
import { getCircleFeature, getCirclePolygonCoordinates } from '../../packages/utils/src/geom/getCirclePolygon';
import { getSquarePolygonCoordinates } from '../../packages/utils/src/geom/getSquarePolygon';
import { latLngToLngLatArray, lngLatArrayToLatLng } from '../../packages/utils/src/geom/geom';
import { objectDeepEqual } from '../../packages/utils/src/object/objectDeepEqual';
import { round } from '../../packages/utils/src/number/round';
import { camelize } from '../../packages/utils/src/string/camelize';
import { capitalize } from '../../packages/utils/src/string/capitalize';
import { numberWithSpaces } from '../../packages/utils/src/string/numberWithSpaces';
import { unflatten } from '../../packages/utils/src/unflatten';
import { fixUrlStr, updateUrlParams } from '../../packages/utils/src/url';

describe('Array helpers', () => {
  it('compares arrays with or without order', () => {
    expect(arrayCompare(['b', 'a'], ['a', 'b'])).toBe(true);
    expect(arrayCompare(['a', 'b'], ['a'])).toBe(false);
    expect(arrayCompareStrict(['a', 'b'], ['b', 'a'])).toBe(false);
    expect(arrayCompareStrict(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(arrayCompareStrict([1, 2], [1, 3])).toBe(false);
  });

  it('splits arrays into chunks without dropping the last items', () => {
    expect(arrayChunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(arrayChunk([], 2)).toEqual([]);
  });

  it('removes duplicate array values, retaining their first order', () => {
    expect(arrayUnique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });
});

describe('Flattening and URL helpers', () => {
  it('flattens nested objects and indexed arrays', () => {
    expect(flatten({ nested: { count: 2 }, items: ['a', 'b'] })).toEqual({
      'nested.count': 2,
      'items[0]': 'a',
      'items[1]': 'b',
    });
  });

  it('preserves empty objects and arrays when flattening', () => {
    expect(flatten({ emptyObject: {}, emptyArray: [] })).toEqual({
      emptyObject: {},
      emptyArray: [],
    });
  });

  it('supports flattening with array index properties', () => {
    expect(flatten({ values: [1, 2] }, { flatArray: false })).toEqual({
      'values.0': 1,
      'values.1': 2,
    });
  });

  it('restores nested objects', () => {
    expect(unflatten({ 'user.name': 'NextGIS', 'map.zoom': 12 })).toEqual({
      user: { name: 'NextGIS' },
      map: { zoom: 12 },
    });
  });

  it('returns array input unchanged when unflattening', () => {
    const array = ['a', 'b'];
    expect(unflatten(array)).toBe(array);
  });

  it('normalizes repeated slashes without breaking the protocol', () => {
    expect(fixUrlStr('https://example.com//api///resource')).toBe('https://example.com/api/resource');
  });

  it('updates and removes query parameters without losing the fragment', () => {
    const result = updateUrlParams('https://example.com/path?a=old&remove=1#section', {
      a: 'new', remove: undefined, added: 'value',
    });
    const url = new URL(result);
    expect(url.hash).toBe('#section');
    expect(url.searchParams.get('a')).toBe('new');
    expect(url.searchParams.has('remove')).toBe(false);
    expect(url.searchParams.get('added')).toBe('value');
    expect(Number(url.searchParams.get('timestamp'))).toBeGreaterThan(0);
  });
});

describe('Geometry helpers', () => {
  it('creates a closed bounds ring and polygon feature', () => {
    const bounds: [number, number, number, number] = [1, 2, 3, 4];
    const ring = [[1, 2], [3, 2], [3, 4], [1, 4], [1, 2]];
    expect(getBoundsCoordinates(bounds)).toEqual(ring);
    expect(getBoundsPolygon(bounds)).toEqual({ type: 'Polygon', coordinates: [ring] });
    expect(getBoundsFeature(bounds)).toEqual({
      type: 'Feature', properties: {}, geometry: getBoundsPolygon(bounds),
    });
  });

  it('creates closed circle and square rings', () => {
    const circle = getCirclePolygonCoordinates(0, 0, 10, 8);
    expect(circle).toHaveLength(9);
    expect(circle[0][0]).toBeCloseTo(circle[8][0]);
    expect(circle[0][1]).toBeCloseTo(circle[8][1]);
    const square = getSquarePolygonCoordinates(0, 0, 10);
    expect(square).toHaveLength(5);
    expect(square[0]).toEqual(square[4]);
    expect(getCircleFeature(0, 0, 10, 8).geometry.coordinates[0]).toEqual(circle);
  });

  it('converts latitude/longitude objects to arrays and back', () => {
    expect(latLngToLngLatArray({ lat: 52, lng: 13 })).toEqual([13, 52]);
    expect(lngLatArrayToLatLng([13, 52])).toEqual({ lat: 52, lng: 13 });
  });
});

describe('Object, string and number helpers', () => {
  it('compares nested objects, arrays and dates', () => {
    expect(objectDeepEqual({ x: { y: 1 }, tags: ['b', 'a'] }, { x: { y: 1 }, tags: ['a', 'b'] })).toBe(true);
    expect(objectDeepEqual({ x: 1 }, { x: 2 })).toBe(false);
    expect(objectDeepEqual({ date: new Date(0) }, { date: new Date(0) })).toBe(true);
    expect(objectDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('converts strings and formats numbers', () => {
    expect(camelize('map-layer_name')).toBe('MapLayerName');
    expect(capitalize('nEXTGIS')).toBe('Nextgis');
    expect(numberWithSpaces(1234567.89)).toBe('1 234 567.89');
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.6)).toBe(2);
  });
});

describe('Event status and debounce helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for multiple events and remembers completed events', async () => {
    const emitter = new EventEmitter();
    const events = new Events<{ ready: boolean; loaded: boolean }>(emitter);
    expect(events.getEventStatus('ready')).toBe(false);
    const waiting = events.onLoad(['ready', 'loaded']);
    emitter.emit('ready');
    expect(events.getEventStatus('ready')).toBe(true);
    emitter.emit('loaded');
    await expect(waiting).resolves.toBe(events);
    await expect(events.onLoad('ready')).resolves.toBe(events);
  });

  it('can reset an event status', () => {
    const events = new Events<{ ready: boolean }>(new EventEmitter());
    events.setEventStatus('ready', true);
    expect(events.getEventStatus('ready')).toBe(true);
    events.setEventStatus('ready', false);
    expect(events.getEventStatus('ready')).toBe(false);
  });

  it('debounces rapid calls, preserving the last context and arguments', async () => {
    vi.useFakeTimers();
    const callback = vi.fn(function (this: { value: number }, addition: number) {
      return this.value + addition;
    });
    const debounced = debounce(callback, 25);
    const context = { value: 10, run: debounced };
    context.run(1);
    context.run(2);
    await vi.advanceTimersByTimeAsync(25);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback.mock.contexts[0]).toBe(context);
  });

  it('allows a scheduled debounced call to be cleared', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 25);
    debounced();
    debounced.clear();
    await vi.advanceTimersByTimeAsync(25);
    expect(callback).not.toHaveBeenCalled();
  });
});
