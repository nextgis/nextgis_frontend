export interface ZoomControlOptions {
    zoomInText?: string;
    zoomInTitle?: string;
    zoomOutText?: string;
    zoomOutTitle?: string;
}
export interface AttributionControlOptions {
    compact?: boolean;
    customAttribution?: string | string[];
}
export interface MapControls {
    'ZOOM': ZoomControlOptions;
    'ATTRIBUTION': AttributionControlOptions;
    [name: string]: {};
}
export interface MapControl<M extends any = any> {
    onAdd?(map?: M): any;
    onRemove?(map?: M): any;
}
