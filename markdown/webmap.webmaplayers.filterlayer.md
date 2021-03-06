<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [WebMapLayers](./webmap.webmaplayers.md) &gt; [filterLayer](./webmap.webmaplayers.filterlayer.md)

## WebMapLayers.filterLayer() method

Hide features from a vector layer using a callback function.

<b>Signature:</b>

```typescript
filterLayer(layerDef: LayerDef, filter: DataLayerFilter<Feature, L>): LayerDefinition<Feature, L>[];
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  layerDef | [LayerDef](./webmap.layerdef.md) |  |
|  filter | [DataLayerFilter](./webmap.datalayerfilter.md)<!-- -->&lt;Feature, L&gt; |  |

<b>Returns:</b>

[LayerDefinition](./webmap.layerdefinition.md)<!-- -->&lt;Feature, L&gt;\[\]

## Example


```javascript
const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
  webMap.filterLayer(layer, ({feature}) => feature.id === '42');
});

```

