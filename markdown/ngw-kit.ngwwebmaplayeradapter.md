<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/ngw-kit](./ngw-kit.md) &gt; [NgwWebmapLayerAdapter](./ngw-kit.ngwwebmaplayeradapter.md)

## NgwWebmapLayerAdapter class

<b>Signature:</b>

```typescript
export declare class NgwWebmapLayerAdapter<M = any> implements ResourceAdapter<M> 
```
<b>Implements:</b> [ResourceAdapter](./ngw-kit.resourceadapter.md)<!-- -->&lt;M&gt;

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(map, options)](./ngw-kit.ngwwebmaplayeradapter._constructor_.md) |  | Constructs a new instance of the <code>NgwWebmapLayerAdapter</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [\_extent?](./ngw-kit.ngwwebmaplayeradapter._extent.md) |  | [LngLatBoundsArray](./utils.lnglatboundsarray.md) | <i>(Optional)</i> |
|  [emitter](./ngw-kit.ngwwebmaplayeradapter.emitter.md) |  | StrictEventEmitter&lt;EventEmitter, [NgwWebmapLayerAdapterEvents](./ngw-kit.ngwwebmaplayeradapterevents.md)<!-- -->&gt; |  |
|  [layer?](./ngw-kit.ngwwebmaplayeradapter.layer.md) |  | [NgwWebmapItem](./ngw-kit.ngwwebmapitem.md) | <i>(Optional)</i> |
|  [map](./ngw-kit.ngwwebmaplayeradapter.map.md) |  | M |  |
|  [NgwWebmapItem](./ngw-kit.ngwwebmaplayeradapter.ngwwebmapitem.md) |  | [Type](./utils.type.md)<!-- -->&lt;[NgwWebmapItem](./ngw-kit.ngwwebmapitem.md)<!-- -->&gt; |  |
|  [options](./ngw-kit.ngwwebmaplayeradapter.options.md) |  | [NgwWebmapAdapterOptions](./ngw-kit.ngwwebmapadapteroptions.md) |  |
|  [pixelRadius](./ngw-kit.ngwwebmaplayeradapter.pixelradius.md) |  | number | Radius for searching objects in pixels |
|  [resourceId](./ngw-kit.ngwwebmaplayeradapter.resourceid.md) |  | number |  |
|  [webmapClassName](./ngw-kit.ngwwebmaplayeradapter.webmapclassname.md) |  | string |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [\_getWebMapLayerItem()](./ngw-kit.ngwwebmaplayeradapter._getwebmaplayeritem.md) |  |  |
|  [addLayer(options)](./ngw-kit.ngwwebmaplayeradapter.addlayer.md) |  |  |
|  [fetchBookmarks()](./ngw-kit.ngwwebmaplayeradapter.fetchbookmarks.md) |  |  |
|  [getBookmarksResourceId()](./ngw-kit.ngwwebmaplayeradapter.getbookmarksresourceid.md) |  |  |
|  [getDependLayers()](./ngw-kit.ngwwebmaplayeradapter.getdependlayers.md) |  |  |
|  [getExtent()](./ngw-kit.ngwwebmaplayeradapter.getextent.md) |  |  |
|  [getIdentificationIds()](./ngw-kit.ngwwebmaplayeradapter.getidentificationids.md) |  |  |
|  [hideLayer()](./ngw-kit.ngwwebmaplayeradapter.hidelayer.md) |  |  |
|  [removeLayer()](./ngw-kit.ngwwebmaplayeradapter.removelayer.md) |  |  |
|  [showLayer()](./ngw-kit.ngwwebmaplayeradapter.showlayer.md) |  |  |

