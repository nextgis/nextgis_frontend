import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  colorObjectToColor,
  colorToRGB,
  isColor,
  toColor,
} from '../../packages/expression/src/utils/color';
import { Clipboard } from '../../packages/utils/src/Clipboard';
import { Keys } from '../../packages/webmap/src/components/keys/Keys';

const originalNavigatorClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
);
const originalWindowClipboardData = Object.getOwnPropertyDescriptor(
  window,
  'clipboardData',
);
const originalExec = Object.getOwnPropertyDescriptor(document, 'execCommand');

function replaceValue(target: object, property: string, value: unknown): void {
  Object.defineProperty(target, property, { configurable: true, value });
}
function restoreValue(
  target: object,
  property: string,
  descriptor?: PropertyDescriptor,
): void {
  if (descriptor) Object.defineProperty(target, property, descriptor);
  else Reflect.deleteProperty(target, property);
}

describe('Clipboard native, legacy and DOM fallback (offline)', () => {
  afterEach(() => {
    restoreValue(navigator, 'clipboard', originalNavigatorClipboard);
    restoreValue(window, 'clipboardData', originalWindowClipboardData);
    restoreValue(document, 'execCommand', originalExec);
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('uses the native clipboard API when present', () => {
    const writeText = vi.fn();
    replaceValue(navigator, 'clipboard', { writeText });
    expect(Clipboard.copy('offline text')).toBe(true);
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith('offline text');
  });

  it('supports the legacy browser clipboard API', () => {
    const setData = vi.fn();
    replaceValue(navigator, 'clipboard', undefined);
    replaceValue(window, 'clipboardData', { setData });
    const clipboard = new Clipboard('first');
    expect(setData).toHaveBeenCalledWith('text', 'first');
    expect(clipboard.copy('second')).toBe(true);
    expect(setData).toHaveBeenCalledWith('text', 'second');
  });

  it('selects a temporary input and removes it after DOM clipboard fallback', () => {
    replaceValue(navigator, 'clipboard', undefined);
    replaceValue(window, 'clipboardData', undefined);
    const exec = vi.fn().mockReturnValue(true);
    replaceValue(document, 'execCommand', exec);
    const clipboard = new Clipboard();
    clipboard.silent = false;
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(clipboard.copy('copy using DOM')).toBe(true);
    expect(exec).toHaveBeenCalledWith('copy');
    expect(document.querySelector('input')).toBeNull();
    expect(log).toHaveBeenCalledWith('Copied to Clipboard');
  });

  it('removes temporary elements even if the fallback copy command throws', () => {
    replaceValue(navigator, 'clipboard', undefined);
    replaceValue(window, 'clipboardData', undefined);
    replaceValue(
      document,
      'execCommand',
      vi.fn(() => {
        throw new Error('Copy denied');
      }),
    );
    const clipboard = new Clipboard();
    clipboard.silent = false;
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(clipboard.copy('blocked')).toBe(false);
    expect(document.querySelector('input')).toBeNull();
    expect(log).toHaveBeenCalledWith('Please copy manually');
  });
});

describe('Color parsing including named, RGB and object inputs', () => {
  it('converts compact and long hex values to RGB', () => {
    expect(toColor('#fa0')).toEqual([255, 170, 0]);
    expect(toColor('#00ff80')).toEqual([0, 255, 128]);
  });

  it('parses CSS RGB and RGBA syntax with the alpha channel', () => {
    expect(toColor('rgb(1, 2, 3)')).toEqual([1, 2, 3]);
    expect(toColor('rgba(4, 5, 6, 0.25)')).toEqual([4, 5, 6, 0.25]);
  });

  it('recognizes standard color names and rejects unsupported formats', () => {
    expect(isColor('red')).toBe(true);
    expect(toColor('red')).toEqual([255, 0, 0]);
    expect(isColor('not-a-color')).toBe(false);
    expect(() => toColor('not-a-color')).toThrow(
      'cannot be converted to color',
    );
    expect(isColor(null)).toBe(false);
  });

  it('preserves optional alpha for object colors', () => {
    expect(colorObjectToColor({ r: 3, g: 4, b: 5 })).toEqual([3, 4, 5]);
    expect(colorObjectToColor({ r: 3, g: 4, b: 5, a: 0.4 })).toEqual([
      3, 4, 5, 0.4,
    ]);
    expect(isColor({ r: 3, g: 4, b: 5, a: 2 })).toBe(false);
    expect(isColor({ r: 3, g: 4, b: 5, a: 0.5 })).toBe(true);
    expect(colorToRGB([3, 4, 5])).toBe('rgb(3,4,5)');
  });
});

function keyEvent(type: 'keydown' | 'keyup', code: number): KeyboardEvent {
  const event = new KeyboardEvent(type, { bubbles: true });
  Object.defineProperty(event, 'keyCode', { value: code });
  return event;
}

describe('Keyboard shortcut state and listener cleanup', () => {
  it('marks pressed keys and clears them on keyup', () => {
    const keys = new Keys();
    try {
      expect(keys.pressed('shift')).toBeFalsy();
      window.dispatchEvent(keyEvent('keydown', 16));
      expect(keys.pressed('shift')).toBe(true);
      window.dispatchEvent(keyEvent('keyup', 16));
      expect(keys.pressed('shift')).toBe(false);
    } finally {
      keys.removeKeyboardEventsListener();
    }
  });

  it('resets key state when the browser window regains focus', () => {
    const keys = new Keys();
    try {
      window.dispatchEvent(keyEvent('keydown', 17));
      expect(keys.pressed('ctrl')).toBe(true);
      window.dispatchEvent(new Event('focus'));
      expect(keys.pressed('ctrl')).toBeFalsy();
    } finally {
      keys.removeKeyboardEventsListener();
    }
  });

  it('ignores future keyboard events after listeners are removed', () => {
    const keys = new Keys();
    window.dispatchEvent(keyEvent('keydown', 18));
    expect(keys.pressed('alt')).toBe(true);
    keys.removeKeyboardEventsListener();
    window.dispatchEvent(keyEvent('keyup', 18));
    expect(keys.pressed('alt')).toBe(true);
  });
});
