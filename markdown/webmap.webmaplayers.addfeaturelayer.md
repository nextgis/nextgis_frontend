<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [WebMapLayers](./webmap.webmaplayers.md) &gt; [addFeatureLayer](./webmap.webmaplayers.addfeaturelayer.md)

## WebMapLayers.addFeatureLayer() method

Shortcut for [WebMapLayers.addGeoJsonLayer()](./webmap.webmaplayers.addgeojsonlayer.md) to create GeoJson adapter with generic types for working in typescript

<b>Signature:</b>

```typescript
addFeatureLayer<P extends FeatureProperties = FeatureProperties, G extends Geometry = Geometry, O extends GeoJsonAdapterOptions<Feature<G, P>> = GeoJsonAdapterOptions<Feature<G, P>>>(options?: O): Promise<FeatureLayerAdapter<P, G>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  options | O |  |

<b>Returns:</b>

Promise&lt;[FeatureLayerAdapter](./webmap.featurelayeradapter.md)<!-- -->&lt;P, G&gt;&gt;
