<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/ngw-kit](./ngw-kit.md) &gt; [NgwLayerOptionsAdditional](./ngw-kit.ngwlayeroptionsadditional.md) &gt; [tileNoData](./ngw-kit.ngwlayeroptionsadditional.tilenodata.md)

## NgwLayerOptionsAdditional.tileNoData property

Parameter for `TILE` and `IMAGE` adapters to say NGW what will be returned if there is no data to render.

 In NGW api this parameter is written as follows: `nd=204|404|200`<!-- -->, 200 by default. But in frontend libraries default value id 204 (no content) for performance purpose.

 204

<b>Signature:</b>

```typescript
tileNoData?: TileNoData;
```