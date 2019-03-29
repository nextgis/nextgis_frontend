import {
  Paint,
  GeoJsonAdapterLayerPaint,
  GeometryPaint,
  GetPaintFunction,
  GetCustomPaintOptions
} from '../interfaces/LayerAdapter';

export function preparePaint(
  paint: Paint,
  defaultPaint: GeometryPaint,
  getPaintFunctions: { [name: string]: GetPaintFunction }): Paint {

  let newPaint: Paint | undefined;
  if (typeof paint === 'function') {
    return (opt: any) => {
      return preparePaint(paint(opt), defaultPaint, getPaintFunctions) as GeoJsonAdapterLayerPaint;
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
    newPaint.stroke = newPaint.stroke !== undefined ?
      newPaint.stroke : (newPaint.fill !== undefined && newPaint.fill === false) ? true :
        !!(newPaint.strokeColor || newPaint.strokeOpacity);
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

function updatePaintOptionFromCallback(
  paint: GetCustomPaintOptions,
  getPaintFunctions: { [name: string]: GetPaintFunction }): GeoJsonAdapterLayerPaint | undefined {

  if (typeof paint.from === 'function') {
    return paint.from(paint.options);
  } else if (typeof paint.from === 'string' && getPaintFunctions) {
    const from = getPaintFunctions[paint.from];
    if (from) {
      return from(paint.options);
    }
  }

}
