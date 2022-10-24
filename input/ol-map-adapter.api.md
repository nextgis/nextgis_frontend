## API Report File for "@nextgis/ol-map-adapter"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="node" />

import type { AdapterOptions } from '@nextgis/webmap';
import { default as Attr_2 } from 'ol/control/Attribution';
import type { AttributionControlOptions } from '@nextgis/webmap';
import type Base from 'ol/layer/Base';
import type { ButtonControlOptions } from '@nextgis/webmap';
import type Control from 'ol/control/Control';
import type { ControlPosition } from '@nextgis/webmap';
import type { CreateControlOptions } from '@nextgis/webmap';
import type { DataLayerFilter } from '@nextgis/webmap';
import { EventEmitter } from 'events';
import type { Feature } from 'geojson';
import type { FitOptions } from '@nextgis/webmap';
import type { GeoJsonAdapterOptions } from '@nextgis/webmap';
import type { GeoJsonObject } from 'geojson';
import type { ImageAdapterOptions } from '@nextgis/webmap';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import type { LayerDefinition } from '@nextgis/webmap';
import type { LngLatArray } from '@nextgis/utils';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { MainLayerAdapter } from '@nextgis/webmap';
import { default as Map_2 } from 'ol/Map';
import type { MapAdapter } from '@nextgis/webmap';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type { MapControl } from '@nextgis/webmap';
import type { MapOptions } from '@nextgis/webmap';
import OSM from 'ol/source/OSM';
import { Paint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { TileAdapterOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import type { VectorLayerAdapter } from '@nextgis/webmap';
import VectorSource from 'ol/source/Vector';
import type { ViewOptions } from '@nextgis/webmap';
import type { WmsAdapterOptions } from '@nextgis/webmap';
import XYZ from 'ol/source/XYZ';
import Zoom from 'ol/control/Zoom';

// Warning: (ae-forgotten-export) The symbol "Layer" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
class OlMapAdapter implements MapAdapter<Map_2, Layer> {
    // (undocumented)
    addControl(control: Control, position: ControlPosition): Control | undefined;
    // (undocumented)
    static controlAdapters: {
        ZOOM: typeof ZoomControl;
        ATTRIBUTION: typeof Attribution;
    };
    // (undocumented)
    controlAdapters: {
        ZOOM: typeof ZoomControl;
        ATTRIBUTION: typeof Attribution;
    };
    // (undocumented)
    create(options: MapOptions<Map_2>): void;
    // (undocumented)
    createButtonControl(options: ButtonControlOptions): Control;
    // (undocumented)
    createControl(control: MapControl, options: CreateControlOptions): Control;
    // (undocumented)
    destroy(): void;
    // (undocumented)
    emitter: EventEmitter;
    // (undocumented)
    fitBounds(e: LngLatBoundsArray, options?: FitOptions): void;
    // (undocumented)
    getBounds(): LngLatBoundsArray | undefined;
    // (undocumented)
    getCenter(): LngLatArray | undefined;
    // (undocumented)
    getContainer(): HTMLElement | undefined;
    // (undocumented)
    getControlContainer(): HTMLElement;
    // (undocumented)
    getZoom(): number | undefined;
    // (undocumented)
    hideLayer(layer: Layer): void;
    // (undocumented)
    static layerAdapters: {
        IMAGE: typeof ImageAdapter;
        TILE: typeof TileAdapter;
        WMS: typeof WmsAdapter;
        OSM: typeof OsmAdapter;
        GEOJSON: typeof GeoJsonAdapter;
    };
    // (undocumented)
    layerAdapters: {
        IMAGE: typeof ImageAdapter;
        TILE: typeof TileAdapter;
        WMS: typeof WmsAdapter;
        OSM: typeof OsmAdapter;
        GEOJSON: typeof GeoJsonAdapter;
    };
    // (undocumented)
    map?: Map_2;
    // Warning: (ae-forgotten-export) The symbol "MapBrowserPointerEvent" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    onMapClick(evt: MapBrowserPointerEvent): void;
    // (undocumented)
    options: MapOptions<Map_2>;
    // (undocumented)
    removeControl(control: Control): void;
    // (undocumented)
    removeLayer(layer: Layer): void;
    // (undocumented)
    setCenter(lngLat: LngLatArray): void;
    // (undocumented)
    setLayerOpacity(layer: Layer, val: number): void;
    // (undocumented)
    setLayerOrder(layer: Layer, order: number): void;
    // (undocumented)
    setRotation(angle: number): void;
    // (undocumented)
    setView(lngLat: LngLatArray, zoom?: number): void;
    // (undocumented)
    setView(options: ViewOptions): void;
    // (undocumented)
    setZoom(zoom: number): void;
    // (undocumented)
    showLayer(layer: Layer): void;
}
export default OlMapAdapter;

// Warnings were encountered during analysis:
//
// src/OlMapAdapter.ts:64:7 - (ae-forgotten-export) The symbol "ImageAdapter" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:65:7 - (ae-forgotten-export) The symbol "TileAdapter" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:66:7 - (ae-forgotten-export) The symbol "WmsAdapter" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:67:7 - (ae-forgotten-export) The symbol "OsmAdapter" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:68:7 - (ae-forgotten-export) The symbol "GeoJsonAdapter" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:74:7 - (ae-forgotten-export) The symbol "ZoomControl" needs to be exported by the entry point index.d.ts
// src/OlMapAdapter.ts:75:7 - (ae-forgotten-export) The symbol "Attribution" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```