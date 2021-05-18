<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [WebMap](./webmap.webmap.md)

## WebMap class

The core component for managing map adapters. It contains methods for adding and manipulation with [map](./webmap.webmapmain.md)<!-- -->, [layers](./webmap.webmaplayers.md) and [controls](./webmap.webmapcontrols.md)<!-- -->.

<b>Signature:</b>

```typescript
export declare class WebMap<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents, O extends MapOptions = MapOptions> extends WebMapControls<M, L, C, E, O> implements WebMapControls, WebMapLayers, WebMapMain 
```
<b>Extends:</b> [WebMapControls](./webmap.webmapcontrols.md)<!-- -->&lt;M, L, C, E, O&gt;

<b>Implements:</b> [WebMapControls](./webmap.webmapcontrols.md)<!-- -->, [WebMapLayers](./webmap.webmaplayers.md)<!-- -->, [WebMapMain](./webmap.webmapmain.md)

## Example


```javascript
import { WebMap } from '@nextgis/webmap';
import MapAdapter from '@nextgis/ol-map-adapter';

const webMap = new WebMap({
  mapAdapter: new MapAdapter(),
  target: 'map',
});

```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(mapOptions)](./webmap.webmap._constructor_.md) |  | Constructs a new instance of the <code>WebMap</code> class |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [get(id)](./webmap.webmap.get.md) | <code>static</code> |  |
