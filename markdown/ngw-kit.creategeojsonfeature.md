<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/ngw-kit](./ngw-kit.md) &gt; [createGeoJsonFeature](./ngw-kit.creategeojsonfeature.md)

## createGeoJsonFeature() function

<b>Signature:</b>

```typescript
export declare function createGeoJsonFeature<G extends Geometry | null = Geometry, P extends FeatureProperties = FeatureProperties>(item: Pick<FeatureItem, 'id' | 'geom' | 'fields'>): Feature<G, P>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  item | Pick&lt;[FeatureItem](./ngw-connector.featureitem.md)<!-- -->, 'id' \| 'geom' \| 'fields'&gt; |  |

<b>Returns:</b>

Feature&lt;G, P&gt;

