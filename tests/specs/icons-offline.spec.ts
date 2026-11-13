import { describe, expect, it } from 'vitest';

import { getIcon } from '../../packages/icons/src/index';

describe('SVG icon creation', () => {
  it('creates a default SVG circle with the default size and anchor', () => {
    const icon = getIcon();
    expect(icon.type).toBe('icon');
    expect(icon.iconSize).toEqual([12, 12]);
    expect(icon.iconAnchor).toEqual([6, 6]);
    expect(icon.svg?.getAttribute('fill')).toBe('blue');
    expect(icon.svg?.getAttribute('stroke')).toBe('white');
    expect(icon.svg?.querySelector('circle')).not.toBeNull();
  });

  it('renders every named shape as SVG rather than returning a missing alias', () => {
    for (const shape of [
      'rect', 'star', 'plus', 'minus', 'brill', 'circle',
      'marker', 'triangle', 'asterisk',
    ] as const) {
      const icon = getIcon({ shape, color: '#ff0000' });
      expect(icon.html).toContain('<svg');
      expect(icon.svg?.getAttribute('fill')).toBe('#ff0000');
      expect(icon.svg?.childElementCount).toBeGreaterThan(0);
    }
  });

  it('preserves custom sizes, anchors, rotation and stroke settings', () => {
    const icon = getIcon({
      shape: 'star', size: 24, anchor: [12, 20], rotate: 45,
      stroke: 2, strokeColor: '#abcdef', color: 'orange',
    });
    expect(icon.iconSize).toEqual([24, 24]);
    expect(icon.iconAnchor).toEqual([12, 20]);
    expect(icon.rotate).toBe(45);
    expect(icon.svg?.getAttribute('stroke-width')).toBe('2');
    expect(icon.svg?.getAttribute('stroke')).toBe('#abcdef');
    expect(icon.svg?.getAttribute('fill')).toBe('orange');
  });

  it('supports a custom SVG path and disables the stroke when requested', () => {
    const icon = getIcon({ p: '<path id="custom-icon" d="M0 0L12 12"/>', stroke: 0 });
    expect(icon.svg?.querySelector('#custom-icon')).not.toBeNull();
    expect(icon.svg?.hasAttribute('stroke')).toBe(false);
  });

  it('accepts complete custom SVG markup while applying the requested size', () => {
    const icon = getIcon({
      svg: '<svg xmlns="http://www.w3.org/2000/svg"><rect id="custom"/></svg>',
      size: 32, color: 'green',
    });
    expect(icon.svg?.querySelector('#custom')).not.toBeNull();
    expect(icon.svg?.getAttribute('width')).toBe('32');
    expect(icon.svg?.getAttribute('height')).toBe('32');
    expect(icon.svg?.getAttribute('fill')).toBe('green');
  });
});
