<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/area](./area.md)

## area package

Dependencies free QGIS ellipsoidal area calculation reproduced in JavaScript.

## Example


```javascript
import { calculateArea, geojsonArea } from '@nextgis/area';

const area = geojsonArea(geojson);
const area2 = calculateArea([
  [51.82, 63.8],
  [43.48, 55.62],
  [75.38, 59.13],
  [51.82, 63.8], // the first and last positions MUST contain identical values
]);

```

## Functions

|  Function | Description |
|  --- | --- |
|  [calculateArea(points)](./area.calculatearea.md) |  |
|  [geojsonArea(geojson)](./area.geojsonarea.md) |  |

