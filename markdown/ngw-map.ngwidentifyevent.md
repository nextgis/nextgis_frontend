<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/ngw-map](./ngw-map.md) &gt; [NgwIdentifyEvent](./ngw-map.ngwidentifyevent.md)

## NgwIdentifyEvent type

<b>Signature:</b>

```typescript
export declare type NgwIdentifyEvent<F = FeatureProperties, G extends Geometry = Geometry> = NgwIdentify & {
    getIdentifyItems: () => IdentifyItem<F, G>[];
};
```
<b>References:</b> [FeatureProperties](./utils.featureproperties.md)<!-- -->, [NgwIdentify](./ngw-kit.ngwidentify.md)<!-- -->, [IdentifyItem](./ngw-kit.identifyitem.md)
