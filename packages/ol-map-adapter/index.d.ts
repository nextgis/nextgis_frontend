import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
interface LayerMem {
    order: number;
    layer: ImageLayer | TileLayer;
}
export declare class OlMapAdapter {
    displayProjection: string;
    lonlatProjection: string;
    private _olMap;
    private _olView;
    private DPI;
    private IPM;
    private _layers;
    create(options?: {
        target: string;
    }): void;
    setCenter(latLng: [number, number]): void;
    setZoom(zoom: number): void;
    fit(extent: any): void;
    setRotation(angle: number): void;
    addLayer(layerName: string): void;
    removeLayer(layerName: string): void;
    registrateWmsLayer(layerName: string, options?: {
        url: string;
        styleId: string;
        order?: number;
    }): LayerMem;
    getScaleForResolution(res: any, mpu: any): number;
    getResolutionForScale(scale: any, mpu: any): number;
    private _toggleLayer;
    private _imageAdapter;
}
export {};
