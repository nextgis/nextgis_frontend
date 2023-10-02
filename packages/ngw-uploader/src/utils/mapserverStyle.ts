import Color from 'color';

import type { Expression } from '@nextgis/expression';
import type { CreateMapserverStyleOptions } from '../interfaces';

export function mapserverStyle(opt: CreateMapserverStyleOptions) {
  const {
    color,
    fillColor,
    fill = true,
    stroke = true,
    strokeColor,
    opacity,
    fillOpacity,
    strokeOpacity,
    weight,
    radius,
  } = opt.paint || {};

  const fillColor_ = fillColor || color || 'rgb(255,237,111)';
  const strokeColor_ = strokeColor || color || 'rgb(64,64,64)';

  const fillOpacity_ = fillOpacity || opacity || 1;
  const strokeOpacity_ = strokeOpacity || opacity || 1;

  const width = weight ?? 1;
  const radius_ = radius ?? 1;

  // const isPoly = opt.geometryType.indexOf('POLYGON') !== -1;
  const isLine = opt.geometryType.indexOf('LINE') !== -1;
  const isPoint = opt.geometryType.indexOf('POINT') !== -1;

  const symbol = `
    <symbol>
      <type>ellipse</type>
      <name>circle</name>
      <points>1 1</points>
      <filled>true</filled>
    </symbol>`;

  const pathStyle = `${
    fill ? style('color', fillColor_, fillOpacity_, width) : ''
  }
  ${
    stroke && !isLine
      ? style('outlinecolor', strokeColor_, strokeOpacity_, width)
      : ''
  }`;

  return {
    xml: `
      <map>
        ${isPoint ? symbol : ''}
        <layer>
          <class>
            ${
              isPoint
                ? pointStyle(
                    fillColor_,
                    stroke ? strokeColor_ : undefined,
                    radius_,
                  )
                : pathStyle
            }
          </class>
        </layer>
        <legend>
          <keysize y="15" x="15"/>
          <label>
            <size>12</size>
            <type>truetype</type>
            <font>regular</font>
          </label>
        </legend>
      </map>`,
  };

  function style(
    type: string,
    color: string | Expression,
    opacity: number | Expression = 1,
    width?: number | Expression,
  ): string {
    if (typeof color !== 'string') {
      throw new Error(
        'Only `string` type for style `color` definition is available',
      );
    }
    if (typeof opacity !== 'number') {
      throw new Error(
        'Only `number` type for style `opacity` definition is available',
      );
    }
    if (width && typeof width !== 'number') {
      throw new Error(
        'Only `number` type for style `weight` definition is available',
      );
    }
    const c = Color(color).object();
    const alpha = (c.alpha !== undefined ? c.alpha : 1) * opacity;
    const w = Number(width);

    return `
    <style>
      <${type} blue="${c.b}" green="${c.g}" red="${c.r}"/>
      ${alpha < 1 ? `<opacity>${Math.round(alpha * 100)}</opacity>` : ''}
      ${w && w !== 1 ? `<width>${w}</width>` : ''}
    </style>
    `;
  }

  function pointStyle(
    color: string | Expression,
    stroke?: string | Expression,
    radius?: number | Expression,
  ): string {
    if (typeof color !== 'string') {
      throw new Error(
        'Only `string` type for style `color` definition is available',
      );
    }
    if (radius && typeof radius !== 'number') {
      throw new Error(
        'Only `number` type for style `radius` definition is available',
      );
    }
    const c = Color(color).object();
    const s = stroke && Color(stroke).object();

    return `
    <style>
      <color blue="${c.b}" green="${c.g}" red="${c.r}"/>
      ${s ? `<outlinecolor blue="${s.b}" green="${s.g}" red="${s.r}" />` : ''}
      <symbol>circle</symbol>
      <size>${Number(radius_)}</size>
    </style>
    `;
  }
}
