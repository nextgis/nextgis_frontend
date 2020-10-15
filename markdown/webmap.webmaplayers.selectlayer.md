<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [WebMapLayers](./webmap.webmaplayers.md) &gt; [selectLayer](./webmap.webmaplayers.selectlayer.md)

## WebMapLayers.selectLayer() method

Mark the layer as selected. If the adapter is a vector layer and supports data selection, you can pass a callback function to specify which data will be selected.

<b>Signature:</b>

```typescript
selectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  layerDef | [LayerDef](./webmap.layerdef.md) |  |
|  findFeatureFun | [DataLayerFilter](./webmap.datalayerfilter.md) |  |

<b>Returns:</b>

void

## Example


```javascript
const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
  webMap.selectLayer(layer, ({feature}) => feature.id === '42');
});

```
