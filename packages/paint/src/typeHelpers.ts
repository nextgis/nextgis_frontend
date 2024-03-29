import type {
  GeometryPaint,
  GetPaintCallback,
  IconPaint,
  Paint,
  PropertiesPaint,
  VectorAdapterLayerPaint,
} from './interfaces';

export function isPropertiesPaint(paint: Paint): paint is PropertiesPaint {
  if (Array.isArray(paint)) {
    return true;
  }
  return false;
}

export function isPaint(paint: Paint): paint is VectorAdapterLayerPaint {
  if (Object.prototype.toString.call(paint) === '[object Object]') {
    return true;
  }
  return false;
}

export function isBasePaint(paint: Paint): paint is GeometryPaint {
  if (isPaint(paint)) {
    if (paint.type === 'get-paint' || paint.type === 'icon') {
      return false;
    }
    return true;
  }
  return false;
}

export function isPaintCallback(paint: Paint): paint is GetPaintCallback {
  if (typeof paint === 'function') {
    return true;
  }
  return false;
}

export function isIcon(paint: IconPaint): paint is IconPaint {
  return paint.type === 'icon' || 'html' in paint;
}
