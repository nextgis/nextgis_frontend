import {
  Paint,
  VectorAdapterLayerPaint,
  GeometryPaint,
  GetPaintFunction,
  GetCustomPaintOptions
} from '../interfaces/LayerAdapter';

function updatePaintOptionFromCallback(
  paint: GetCustomPaintOptions,
  getPaintFunctions: { [name: string]: GetPaintFunction }
): VectorAdapterLayerPaint | undefined {
  if (typeof paint.from === 'function') {
    return paint.from(paint.options);
  } else if (typeof paint.from === 'string' && getPaintFunctions) {
    const from = getPaintFunctions[paint.from];
    if (from) {
      return from(paint.options);
    }
  }
}

export function preparePaint(
  paint: Paint,
  defaultPaint: GeometryPaint,
  getPaintFunctions: { [name: string]: GetPaintFunction }
): Paint {
  let newPaint: Paint | undefined;
  if (typeof paint === 'function') {
    return (opt: any) => {
      return preparePaint(
        paint(opt),
        defaultPaint,
        getPaintFunctions
      ) as VectorAdapterLayerPaint;
    };
  } else if (paint.type === 'get-paint') {
    const getPaint = updatePaintOptionFromCallback(paint, getPaintFunctions);
    if (getPaint) {
      newPaint = preparePaint(getPaint, defaultPaint, getPaintFunctions);
    }
  } else if (paint.type === 'icon') {
    return paint;
  } else {
    newPaint = { ...paint };
    newPaint.fill = newPaint.fill !== undefined ? newPaint.fill : true;
    newPaint.stroke =
      newPaint.stroke !== undefined
        ? newPaint.stroke
        : !newPaint.fill || !!(newPaint.strokeColor || newPaint.strokeOpacity);
  }
  if (newPaint) {
    if (typeof newPaint === 'function') {
      return newPaint;
    } else {
      newPaint = { ...defaultPaint, ...newPaint };
    }
  } else {
    newPaint = { ...defaultPaint };
  }

  if ('color' in newPaint) {
    if (!newPaint.strokeColor) {
      newPaint.strokeColor = newPaint.color;
    }
    if (!newPaint.fillColor) {
      newPaint.fillColor = newPaint.color;
    }
  }
  if ('opacity' in newPaint) {
    if (newPaint.strokeOpacity === undefined) {
      newPaint.strokeOpacity = newPaint.opacity;
    }
    if (newPaint.fillOpacity === undefined) {
      newPaint.fillOpacity = newPaint.opacity;
    }
  }

  return newPaint;
}
