# Area

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/area) ![version](https://img.shields.io/npm/v/@nextgis/area)

Dependencies free QGIS ellipsoidal area calculation reproduced in JavaScript.

also look at the Python [implementation](https://github.com/nextgis/qgis-area-calc)

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Area` will be registered as a global variable.

```html
<script src="../lib/area.global.js"></script>

<script>
  var area = Area.calculateArea([
    [51.82, 63.8],
    [43.48, 55.62],
    [75.38, 59.13],
    [51.82, 63.8], // the first and last positions MUST contain identical values
  ]);
  var area = Area.geojsonArea(geojson);
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/area"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/area"></script>
```

We recommend linking to a specific version number `/area@[version]`

### In Node.js

```bash
npm install @nextgis/area
```

## Usage

```javascript
import { calculateArea, geojsonArea } from '@nextgis/area';

const area = geojsonArea(geojson);
const area2 = calculateArea([
  [51.82, 63.8],
  [43.48, 55.62],
  [75.38, 59.13],
  [51.82, 63.8], // the first and last positions MUST contain identical values
]);
console.log(area2); // 730215205638.4752
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_area.html)

## Notes

Implementations and code in other software, languages

* NGQ 2.x [QgsDistanceArea::computePolygonArea](https://github.com/nextgis/nextgisqgis/blob/424126701151c25879a8ecfb17b387a346129f1c/src/core/qgsdistancearea.cpp#L889)
* QGIS 3.x [QgsDistanceArea::computePolygonArea](https://github.com/qgis/QGIS/blob/master/src/core/qgsdistancearea.cpp#L1022)
* GRASS [G_ellipsoid_polygon_area](https://github.com/OSGeo/grass/blob/53eda832018485b0d02f94755c8cca9c499c528d/lib/gis/area_poly1.c)
* pyproj [geod_geninverse_int](https://github.com/OSGeo/PROJ/blob/2414eb2bb655588b4b7e9fe86bba70592bd7f911/src/geodesic.c#L674) -> [geod_polygon_compute](https://github.com/OSGeo/PROJ/blob/2414eb2bb655588b4b7e9fe86bba70592bd7f911/src/geodesic.c#L1842) -> [geod_polygonarea](https://github.com/OSGeo/PROJ/blob/2414eb2bb655588b4b7e9fe86bba70592bd7f911/src/geodesic.c#L1948) -> [_polygon_area_perimeter](https://github.com/pyproj4/pyproj/blob/17886ea3a8b0aac9cc1f7d33275e8e2850a65463/pyproj/_geod.pyx#L266) -> [geometry_area_perimeter](https://github.com/pyproj4/pyproj/blob/17886ea3a8b0aac9cc1f7d33275e8e2850a65463/pyproj/geod.py#L517), [Geodesic Routines Description](https://github.com/OSGeo/PROJ/blob/master/src/geodesic.h#L1948), [Docs](https://pyproj4.github.io/pyproj/stable/api/geod.html#pyproj.Geod.geometry_area_perimeter)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/area`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
