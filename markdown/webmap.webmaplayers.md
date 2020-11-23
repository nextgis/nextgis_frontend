<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [WebMapLayers](./webmap.webmaplayers.md)

## WebMapLayers class


<b>Signature:</b>

```typescript
export declare class WebMapLayers<M = any, L = any, E extends WebMapEvents = WebMapEvents, O extends MapOptions = MapOptions> extends WebMapMain<M, E, O> 
```
<b>Extends:</b> [WebMapMain](./webmap.webmapmain.md)<!-- -->&lt;M, E, O&gt;

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [addBaseLayer(adapter, options)](./webmap.webmaplayers.addbaselayer.md) |  | Shortcut method to create base layer |
|  [addGeoJsonLayer(opt, adapter)](./webmap.webmaplayers.addgeojsonlayer.md) |  | Create layer from GeoJson data. Set style and behavior for selection. |
|  [addLayer(adapter, options, order)](./webmap.webmaplayers.addlayer.md) |  | Registration of map layer. |
|  [addLayerData(layerDef, data)](./webmap.webmaplayers.addlayerdata.md) |  | Push new the GeoJSON features into given vector layer. |
|  [addLayerFromAsyncAdapter(adapter, options, order)](./webmap.webmaplayers.addlayerfromasyncadapter.md) |  |  |
|  [allLayers()](./webmap.webmaplayers.alllayers.md) |  |  |
|  [clearLayerData(layerDef, cb)](./webmap.webmaplayers.clearlayerdata.md) |  | Remove from vector layer all features. it is possible to remove only some objects if you specify a callback function. |
|  [filterLayer(layerDef, filter)](./webmap.webmaplayers.filterlayer.md) |  | Hide features from a vector layer using a callback function. |
|  [findLayer(filter)](./webmap.webmaplayers.findlayer.md) |  |  |
|  [fitLayer(layerDef, options)](./webmap.webmaplayers.fitlayer.md) |  | Try to fit map view by given layer bounds. But not all layers have borders |
|  [getActiveBaseLayer()](./webmap.webmaplayers.getactivebaselayer.md) |  |  |
|  [getAttributions(options)](./webmap.webmaplayers.getattributions.md) |  |  |
|  [getBaseLayers()](./webmap.webmaplayers.getbaselayers.md) |  |  |
|  [getBaseLayersIds()](./webmap.webmaplayers.getbaselayersids.md) |  |  |
|  [getLayer(layerDef)](./webmap.webmaplayers.getlayer.md) |  | Helper method to return added layer object by any definition type. |
|  [getLayerId(layerDef)](./webmap.webmaplayers.getlayerid.md) |  | Helper method to return added layer identificator by any definition type. |
|  [getLayers()](./webmap.webmaplayers.getlayers.md) |  | Return array of all added layer identifications. |
|  [hideLayer(layerDef, options)](./webmap.webmaplayers.hidelayer.md) |  | Hide added layer on the map by it definition. |
|  [isBaseLayer(layerDef)](./webmap.webmaplayers.isbaselayer.md) |  | Check if given layer is baselayer |
|  [isLayerVisible(layerDef)](./webmap.webmaplayers.islayervisible.md) |  | Check if the given layer on the map |
|  [propertiesFilter(layerDef, filters, options)](./webmap.webmaplayers.propertiesfilter.md) |  |  |
|  [removeLayer(layerDef)](./webmap.webmaplayers.removelayer.md) |  | Remove specific layer from map and memory by its definition. |
|  [removeLayerFilter(layerDef)](./webmap.webmaplayers.removelayerfilter.md) |  |  |
|  [removeLayers(allowCb)](./webmap.webmaplayers.removelayers.md) |  | Remove all layer from map and memory. |
|  [removeOverlays()](./webmap.webmaplayers.removeoverlays.md) |  | Remove all layers but not remove basemap. |
|  [reserveOrder()](./webmap.webmaplayers.reserveorder.md) |  |  |
|  [selectLayer(layerDef, findFeatureFun)](./webmap.webmaplayers.selectlayer.md) |  | Mark the layer as selected. If the adapter is a vector layer and supports data selection, you can pass a callback function to specify which data will be selected. |
|  [setLayerData(layerDef, data)](./webmap.webmaplayers.setlayerdata.md) |  | Sets the GeoJSON data for given vector layer. |
|  [setLayerOpacity(layerDef, value)](./webmap.webmaplayers.setlayeropacity.md) |  | Set transparency for a given layer by number from 0 to 1 |
|  [showLayer(layerDef, options)](./webmap.webmaplayers.showlayer.md) |  | Show added layer on the map by it definition. |
|  [toggleLayer(layerDef, status, options)](./webmap.webmaplayers.togglelayer.md) |  | Change added layer visibility on the map by given status or inverse current status. |
|  [unSelectLayer(layerDef, findFeatureFun)](./webmap.webmaplayers.unselectlayer.md) |  | Unselect the given layer. If the adapter is a vector layer and supports data selection, you can pass a callback function to specify which data will be unselected. |
|  [updateLayer(layerDef)](./webmap.webmaplayers.updatelayer.md) |  |  |
