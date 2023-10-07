/**
 * @module icons
 */

import { IconPaint } from '@nextgis/paint';

const svgPath: { [name: string]: string | GetPathCallback } = {
  brill: '<path d="m6 0-5 6 5 6 5-6z"/>',
  circle: '<circle cx="6" cy="6" r="6"/>',
  rect: '<rect width="12" height="12"/>',
  marker:
    '<path d="m6 0c-1.85 0-4 1.19-4 4.22 0 2.05 3.08 6.59 4 7.78 0.821-1.19 4-5.62 4-7.78 0-3.03-2.15-4.22-4-4.22z"/>',
  cross:
    '<path d="M 2.4,12 6,8.4 9.6,12 12,9.6 8.4,6 12,2.4 9.6,0 6,3.6 2.4,0 0,2.4 3.6,6 0,9.6 Z"/>',
  star: '<path d="m6 0.25 1.71 4.18 4.29-1.04e-4 -3.43 3.14 0.857 4.18-3.43-3.14-3.43 3.14 0.857-4.18-3.43-3.14 4.29-0.209z"/>',
  triangle: '<path d="m12 11.7h-12l6-11.2z"/>',
  plus: '<path d="m7.5 12v-4.5h4.5v-3h-4.5v-4.5h-3v4.5h-4.5v3h4.5v4.5z"/>',
  minus: '<path d="m12 7.5v-3h-12v3z"/>',
  asterisk:
    '<path d="m7.59 12v-3.27l2.83 1.64 1.58-2.74-2.85-1.64 2.83-1.64-1.56-2.74-2.83 1.64v-3.24h-3.17v3.24l-2.85-1.64-1.57 2.74 2.84 1.64-2.84 1.64 1.57 2.74 2.85-1.64v3.27z"/>',
};

export interface IconOptions {
  svg?: string;
  /** Svg path */
  p?: string;
  shape?:
    | 'rect'
    | 'star'
    | 'plus'
    | 'minus'
    | 'brill'
    | 'circle'
    | 'marker'
    | 'triangle'
    | 'asterisk';
  color?: string;
  size?: number;
  stroke?: number;
  strokeColor?: string;
  rotate?: number;
}

interface GenerateSvgOptions {
  width: number;
  height: number;
  stroke?: number;
  content?: string;
}

const VIEW_BOX = 12;
const STROKE = 0.8;

function generateSvg({
  width,
  height,
  stroke = 0,
  content,
}: GenerateSvgOptions) {
  const s = stroke / 2;
  const svg = `<svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="${width}"
    height="${height}"
    viewBox="-${s} -${s} ${VIEW_BOX + stroke} ${VIEW_BOX + stroke}"
  >${content}</svg>`;
  return svg;
}

function insertSvg(svg: string) {
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
  return oDOM.documentElement;
}

type GetPathCallback = (opt?: IconOptions) => string;

/**
 * Retrieves an icon with the provided options.
 * @function
 * @param {IconOptions} [opt={}] - Options for the icon.
 * @returns {IconPaint} Icon paint object.
 */
export function getIcon(opt: IconOptions = {}): IconPaint {
  // Default values
  const shape = opt.shape ?? 'circle';
  const color = opt.color ?? 'blue';
  const strokeColor = opt.strokeColor ?? 'white';
  let size = opt.size ?? VIEW_BOX;
  size = size * 2;
  const rotate = opt.rotate ?? 0;

  const anchor = size / 2;

  const stroke = opt.stroke !== undefined ? Number(opt.stroke) : STROKE;

  const pathAlias = opt.p || svgPath[shape] || 'circle';

  const path = typeof pathAlias === 'string' ? pathAlias : pathAlias(opt);
  const svg = insertSvg(
    opt.svg ||
      generateSvg({
        width: size,
        height: size,
        stroke,
        content: path,
      }),
  );

  if (!opt.svg && !opt.p) {
    (svg.firstChild as SVGElement).setAttribute(
      'transform',
      `scale(0.5), translate(${VIEW_BOX / 2}, ${VIEW_BOX / 2})`,
    );
  } else {
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
  }
  svg.setAttribute('transform', `rotate(${rotate})`);

  svg.setAttribute('fill', color);
  if (stroke) {
    svg.setAttribute('stroke', strokeColor);
    svg.setAttribute('stroke-width', String(stroke));
  }
  const s = new XMLSerializer();

  return {
    type: 'icon',
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    html: s.serializeToString(svg),
    svg,
  };
}
