<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/utils](./utils.md) &gt; [TileJson](./utils.tilejson.md) &gt; [center](./utils.tilejson.center.md)

## TileJson.center property

Default: null. The first value is the longitude, the second is latitude (both in WGS:84 values), the third value is the zoom level as an integer. Longitude and latitude MUST be within the specified bounds. The zoom level MUST be between minzoom and maxzoom. Implementations can use this value to set the default location. If the value is null, implementations may use their own algorithm for determining a default location.

<b>Signature:</b>

```typescript
center?: number[];
```